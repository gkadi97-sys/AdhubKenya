/**
 * IncomingCallOverlay.jsx
 * ========================
 * Floating overlay shown to the SELLER when someone is calling.
 * Rendered globally from AppLayout so it persists across page navigation.
 */
import { useEffect, useRef } from 'react';
import { Phone, PhoneOff, PhoneCall } from 'lucide-react';
import { useCall } from '@/context/CallContext';

export default function IncomingCallOverlay() {
  const { callState, callInfo, acceptCall, declineCall } = useCall();
  const audioRef = useRef(null);

  const isVisible = callState === 'ringing' && callInfo?.direction === 'incoming';

  if (!isVisible) return null;

  const handleAccept = () => acceptCall(callInfo);
  const handleDecline = () => declineCall(callInfo);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-[900] bg-black/40 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.2s ease' }}
      />

      {/* ── Card ── */}
      <div
        className="fixed z-[901] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] max-w-[90vw]"
        style={{ animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: 'linear-gradient(145deg, #0f2027, #203a43, #2c5364)' }}>

          {/* Pulsing ring animation */}
          <div className="flex justify-center pt-10 pb-4 relative">
            <div className="absolute w-28 h-28 rounded-full bg-green-500/10 animate-ping" />
            <div className="absolute w-24 h-24 rounded-full bg-green-500/15 animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/50">
              <PhoneCall className="w-9 h-9 text-white" />
            </div>
          </div>

          {/* Caller info */}
          <div className="text-center px-6 pb-2">
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">Incoming Call</p>
            <h2 className="text-white text-2xl font-bold truncate">{callInfo.callerName}</h2>
            <p className="text-white/50 text-sm mt-1 truncate">
              Re: <span className="text-white/70">{callInfo.listingTitle}</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-8 py-8">
            {/* Decline */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleDecline}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-red-900/40"
                aria-label="Decline call"
              >
                <PhoneOff className="w-7 h-7 text-white" />
              </button>
              <span className="text-white/50 text-xs">Decline</span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleAccept}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-green-900/40"
                style={{ animation: 'pulseGreen 1.5s ease-in-out infinite' }}
                aria-label="Accept call"
              >
                <Phone className="w-7 h-7 text-white" />
              </button>
              <span className="text-white/50 text-xs">Accept</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, -40%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%       { box-shadow: 0 0 0 14px rgba(34,197,94,0); }
        }
      `}</style>
    </>
  );
}
