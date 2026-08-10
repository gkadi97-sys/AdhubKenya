/**
 * CallContext.jsx
 * ===============
 * Global context that:
 *  - Listens on the current user's personal inbox channel for incoming calls
 *  - Shares call state (outgoing & incoming) across the entire app
 *  - Provides initiateCall() and endCall() helpers
 */
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

const CallContext = createContext(null);

// ─── ICE Servers (STUN) ───────────────────────────────────────────────────────
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

// ─── Ring tone via Web Audio API (no external files needed) ───────────────────
function createRingtone() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let stopped = false;

  function ring() {
    if (stopped) return;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.setValueAtTime(480, ctx.currentTime);
    oscillator.frequency.setValueAtTime(440, ctx.currentTime + 0.5);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1.2);
    if (!stopped) setTimeout(ring, 2000);
  }

  ring();
  return () => {
    stopped = true;
    ctx.close();
  };
}

export function CallProvider({ children }) {
  const { user } = useAuth();

  // ─── Call state ──────────────────────────────────────────────────────────
  const [callState, setCallState] = useState('idle');
  // 'idle' | 'calling' | 'ringing' | 'connected' | 'ended'

  const [callInfo, setCallInfo] = useState(null);
  // { callId, callerId, callerName, sellerId, sellerName, listingId, listingTitle, direction }
  // direction: 'outgoing' | 'incoming'

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);

  const peerRef = useRef(null);
  const signalChannelRef = useRef(null);
  const inboxChannelRef = useRef(null);
  const stopRingtoneRef = useRef(null);
  const durationTimerRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    // Stop ringtone
    if (stopRingtoneRef.current) { stopRingtoneRef.current(); stopRingtoneRef.current = null; }
    // Stop duration timer
    if (durationTimerRef.current) { clearInterval(durationTimerRef.current); durationTimerRef.current = null; }
    // Close peer connection
    if (peerRef.current) { peerRef.current.close(); peerRef.current = null; }
    // Stop local tracks
    if (localStream) { localStream.getTracks().forEach(t => t.stop()); }
    // Remove signal channel
    if (signalChannelRef.current) {
      supabase.removeChannel(signalChannelRef.current);
      signalChannelRef.current = null;
    }
    pendingCandidatesRef.current = [];
    setLocalStream(null);
    setRemoteStream(null);
    setCallDuration(0);
    setIsMuted(false);
    setError(null);
  }, [localStream]);

  const resetToIdle = useCallback(() => {
    cleanup();
    setCallState('idle');
    setCallInfo(null);
  }, [cleanup]);

  // ─── Build RTCPeerConnection ──────────────────────────────────────────────
  const buildPeer = useCallback((callId, direction) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Send ICE candidates to remote peer via signal channel
    pc.onicecandidate = ({ candidate }) => {
      if (candidate && signalChannelRef.current) {
        signalChannelRef.current.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: { candidate: candidate.toJSON() },
        });
      }
    };

    // Receive remote audio
    const remote = new MediaStream();
    setRemoteStream(remote);
    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach(t => remote.addTrack(t));
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setCallState('connected');
        let secs = 0;
        durationTimerRef.current = setInterval(() => setCallDuration(++secs), 1000);
      }
      if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
        resetToIdle();
      }
    };

    return pc;
  }, [resetToIdle]);

  // ─── Subscribe to signal channel (shared by both parties) ────────────────
  const subscribeToSignalChannel = useCallback((callId, pc) => {
    const ch = supabase.channel(`call-signal-${callId}`, {
      config: { broadcast: { self: false } },
    });

    ch.on('broadcast', { event: 'call-answer' }, async ({ payload }) => {
      if (!pc || pc.signalingState === 'closed') return;
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      // Flush buffered ICE candidates
      for (const c of pendingCandidatesRef.current) {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      }
      pendingCandidatesRef.current = [];
      setCallState('connected');
    });

    ch.on('broadcast', { event: 'call-offer' }, async ({ payload }) => {
      // Callee receives offer via signal channel (after accepting)
      if (!pc || pc.signalingState !== 'stable' && pc.signalingState !== 'have-local-pranswer') return;
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      ch.send({ type: 'broadcast', event: 'call-answer', payload: { sdp: pc.localDescription } });
    });

    ch.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
      if (!pc) return;
      const candidate = new RTCIceCandidate(payload.candidate);
      if (pc.remoteDescription) {
        await pc.addIceCandidate(candidate);
      } else {
        pendingCandidatesRef.current.push(payload.candidate);
      }
    });

    ch.on('broadcast', { event: 'call-declined' }, () => {
      resetToIdle();
    });

    ch.on('broadcast', { event: 'call-ended' }, () => {
      resetToIdle();
    });

    ch.subscribe();
    signalChannelRef.current = ch;
    return ch;
  }, [resetToIdle]);

  // ─── INITIATE a call (buyer calls seller) ────────────────────────────────
  const initiateCall = useCallback(async ({ sellerId, sellerName, listingId, listingTitle }) => {
    if (!user) return;
    if (callState !== 'idle') return;

    setError(null);
    const callId = crypto.randomUUID();

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch {
      setError('Microphone access denied. Please allow microphone access to make calls.');
      return;
    }

    setLocalStream(stream);
    setCallState('calling');
    setCallInfo({
      callId, callerId: user.id, callerName: user.name || 'Buyer',
      sellerId, sellerName, listingId, listingTitle, direction: 'outgoing',
    });

    const pc = buildPeer(callId, 'outgoing');
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    peerRef.current = pc;

    const signalCh = subscribeToSignalChannel(callId, pc);

    // Create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Notify seller's personal inbox
    const inboxCh = supabase.channel(`call-inbox-${sellerId}`, {
      config: { broadcast: { self: false } },
    });
    await new Promise(res => inboxCh.subscribe(res));
    inboxCh.send({
      type: 'broadcast',
      event: 'incoming-call',
      payload: {
        callId, callerId: user.id,
        callerName: user.name || 'Buyer',
        listingId, listingTitle,
        sdp: pc.localDescription,
      },
    });
    supabase.removeChannel(inboxCh);

    // Timeout if no answer in 30s
    setTimeout(() => {
      if (peerRef.current && callState === 'calling') {
        signalCh.send({ type: 'broadcast', event: 'call-ended', payload: {} });
        resetToIdle();
      }
    }, 30000);
  }, [user, callState, buildPeer, subscribeToSignalChannel, resetToIdle]);

  // ─── ACCEPT incoming call ─────────────────────────────────────────────────
  const acceptCall = useCallback(async (incomingPayload) => {
    if (stopRingtoneRef.current) { stopRingtoneRef.current(); stopRingtoneRef.current = null; }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch {
      setError('Microphone access denied.');
      setCallState('idle');
      return;
    }

    setLocalStream(stream);
    setCallState('connected');

    const { callId, callerId, callerName, listingId, listingTitle, sdp } = incomingPayload;
    const pc = buildPeer(callId, 'incoming');
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    peerRef.current = pc;

    subscribeToSignalChannel(callId, pc);

    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    signalChannelRef.current?.send({
      type: 'broadcast',
      event: 'call-answer',
      payload: { sdp: pc.localDescription },
    });

    // Start timer
    let secs = 0;
    durationTimerRef.current = setInterval(() => setCallDuration(++secs), 1000);
  }, [buildPeer, subscribeToSignalChannel]);

  // ─── DECLINE incoming call ────────────────────────────────────────────────
  const declineCall = useCallback((incomingPayload) => {
    if (stopRingtoneRef.current) { stopRingtoneRef.current(); stopRingtoneRef.current = null; }
    // Signal caller
    const ch = supabase.channel(`call-signal-${incomingPayload.callId}`, {
      config: { broadcast: { self: false } },
    });
    ch.subscribe(() => {
      ch.send({ type: 'broadcast', event: 'call-declined', payload: {} });
      supabase.removeChannel(ch);
    });
    setCallState('idle');
    setCallInfo(null);
  }, []);

  // ─── END active call ──────────────────────────────────────────────────────
  const endCall = useCallback(() => {
    if (signalChannelRef.current) {
      signalChannelRef.current.send({ type: 'broadcast', event: 'call-ended', payload: {} });
    }
    resetToIdle();
  }, [resetToIdle]);

  // ─── MUTE toggle ─────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setIsMuted(prev => !prev);
  }, [localStream]);

  // ─── Listen on personal inbox when logged in ──────────────────────────────
  useEffect(() => {
    if (!user?.id) return;

    const ch = supabase.channel(`call-inbox-${user.id}`, {
      config: { broadcast: { self: false } },
    });

    ch.on('broadcast', { event: 'incoming-call' }, ({ payload }) => {
      if (callState !== 'idle') {
        // Already in a call — auto-decline
        const declineCh = supabase.channel(`call-signal-${payload.callId}`, {
          config: { broadcast: { self: false } },
        });
        declineCh.subscribe(() => {
          declineCh.send({ type: 'broadcast', event: 'call-declined', payload: {} });
          supabase.removeChannel(declineCh);
        });
        return;
      }
      setCallState('ringing');
      setCallInfo({
        ...payload,
        sellerId: user.id,
        sellerName: user.name,
        direction: 'incoming',
      });
      // Start ringtone
      try { stopRingtoneRef.current = createRingtone(); } catch { /* AudioContext may fail on some browsers */ }
    });

    ch.subscribe();
    inboxChannelRef.current = ch;

    return () => {
      supabase.removeChannel(ch);
      inboxChannelRef.current = null;
    };
  }, [user?.id, callState]);

  // ─── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => () => cleanup(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CallContext.Provider value={{
      callState, callInfo,
      localStream, remoteStream,
      callDuration, isMuted, error,
      initiateCall, acceptCall, declineCall, endCall, toggleMute,
    }}>
      {children}
    </CallContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCall = () => useContext(CallContext);
