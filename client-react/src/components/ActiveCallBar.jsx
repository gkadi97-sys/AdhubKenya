/**
 * ActiveCallBar.jsx
 * ==================
 * Persistent top bar shown during an active or outgoing call.
 * Rendered globally so it persists across page navigation.
 */
import { useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, Phone } from 'lucide-react';
import { useCall } from '@/context/CallContext';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ActiveCallBar() {
  const { callState, callInfo, callDuration, isMuted, toggleMute, endCall } = useCall();
  const audioRef = useRef(null);
  const { remoteStream } = useCall();

  // Attach remote audio stream to audio element
  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const isVisible = callState === 'calling' || callState === 'connected';
  if (!isVisible) return null;

  const isCalling = callState === 'calling';
  const otherName = callInfo?.direction === 'outgoing' ? callInfo?.sellerName : callInfo?.callerName;

  return (
    <>
      {/* Hidden audio element to play remote audio */}
      <audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />

      {/* ── Active Call Bar ── */}
      <div
        className="fixed top-0 left-0 right-0 z-[800] flex items-center justify-between px-4 py-2.5 shadow-lg"
        style={{
          background: isCalling
            ? 'linear-gradient(90deg, #1a1a2e, #16213e)'
            : 'linear-gradient(90deg, #064e3b, #065f46)',
          animation: 'slideDown 0.3s ease',
        }}
      >
        {/* Left: status + name */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Green dot / pulse */}
          <div className="relative flex-shrink-0">
            {isCalling ? (
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            ) : (
              <>
                <div className="absolute w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider leading-none mb-0.5">
              {isCalling ? 'Calling…' : 'In Call'}
            </p>
            <p className="text-white font-bold text-sm truncate">{otherName}</p>
          </div>
        </div>

        {/* Center: timer */}
        <div className="font-mono text-white/80 text-sm font-semibold tabular-nums">
          {isCalling ? (
            <span className="animate-pulse text-amber-300">Ringing…</span>
          ) : (
            formatDuration(callDuration)
          )}
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">
          {/* Mute */}
          {!isCalling && (
            <button
              onClick={toggleMute}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-red-500/80 hover:bg-red-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          {/* End call */}
          <button
            onClick={endCall}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white rounded-full px-4 py-2 text-xs font-bold shadow-md"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            End
          </button>
        </div>
      </div>

      {/* Push content down so it isn't hidden under the bar */}
      <div className="h-12" />

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </>
  );
}
