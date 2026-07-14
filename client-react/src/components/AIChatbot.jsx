import { useState, useRef, useEffect, useCallback } from 'react';
import './AIChatbot.css';

// ─── Constants ───────────────────────────────────────────────
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are AdBot, the friendly and knowledgeable AI assistant for AdHub Kenya — Kenya's premier online classifieds and marketplace platform. Your role is to help users navigate the site, buy and sell safely, and get the most out of AdHub Kenya.

ABOUT ADHUB KENYA:
- AdHub Kenya is an online classifieds marketplace where Kenyans buy and sell items across all categories.
- The platform is free to use. Users can post ads, browse listings, message sellers, and promote their ads.
- It serves buyers and sellers across all 47 counties of Kenya.

CATEGORIES ON ADHUB:
- Vehicles (cars, motorcycles, trucks, buses, trailers)
- Property (houses for sale, apartments, offices)
- Land & Plots
- Phones & Tablets (smartphones, feature phones, accessories)
- Electronics (laptops, TVs, audio, cameras, gaming)
- Home & Living (furniture, appliances, décor)
- Fashion (clothing, shoes, jewelry, bags)
- Beauty & Health (cosmetics, salon equipment, wellness)
- Services (professional services, freelancers)
- Repair & Construction (contractors, plumbers, electricians)
- Commercial Equipment (machinery, tools)
- Commercial Vehicles (trucks, vans, pickups)
- Leisure (sports, travel, entertainment)
- Babies & Kids (toys, clothing, strollers)
- Food & Agriculture (farm produce, seeds, livestock)
- Animals & Pets (dogs, cats, livestock, aquarium)
- Auto Spares (car parts, accessories)
- Jobs (job listings)
- Seeking Work (CV/job seekers)

KEY FEATURES:
- Post an ad: Click "Post Ad" → choose category → fill details → add photos → publish
- Free ads: Standard listings are completely free
- Promoted ads: Sellers can pay to boost their ad visibility
- Messages: Built-in messaging between buyers and sellers
- Saved ads: Bookmark favourite listings
- Google login: Sign in quickly with your Google account
- Reviews: Leave reviews for sellers you've transacted with
- Safety: AdHub does not facilitate payments — always meet in person for transactions

SAFETY TIPS:
- Always meet sellers in a safe, public place (malls, police stations work well)
- Never pay for an item before physically seeing it
- Beware of too-good-to-be-true prices — likely scams
- Never share your M-Pesa PIN or banking details
- Report suspicious listings using the Report button
- AdHub staff will NEVER ask for your password

TONE & STYLE:
- Be warm, helpful and conversational — like a knowledgeable Kenyan friend
- Keep responses concise and scannable (use bullet points for lists)
- Use KSh for prices, not USD
- **Always respond in English by default**, regardless of how you feel the conversation is going
- **Only switch to Kiswahili if the user writes to you in Kiswahili** — then match their language
- Do not mix languages unless the user does so first
- If you don't know a specific listing's details, be honest — you can't access live listings
- For questions outside AdHub's scope, give a helpful general answer but gently guide back to how AdHub can help

Always prioritize user safety, especially around transactions and personal data.`;

const INITIAL_SUGGESTIONS = [
  'How do I post an ad?',
  'Is this site safe?',
  'How to contact a seller?',
  'What can I sell here?',
];

// ─── Simple markdown → HTML converter ───────────────────────
function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^#{1,3}\s+(.+)$/gm, '<strong>$1</strong>')
    .replace(/^\s*[-•]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

function formatTime(date) {
  return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}

// ─── Typing indicator component ──────────────────────────────
function TypingIndicator() {
  return (
    <div className="adbot-typing">
      <div className="adbot-typing-bubble">
        <div className="adbot-typing-dot" />
        <div className="adbot-typing-dot" />
        <div className="adbot-typing-dot" />
      </div>
    </div>
  );
}

// ─── Main AIChatbot component ────────────────────────────────
export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasUnread, setHasUnread] = useState(true);
  
  // Voice feature state
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);
  const sendMessageRef = useRef(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [input]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasUnread(false);
      setTimeout(() => textareaRef.current?.focus(), 300);
    } else {
      // eslint-disable-next-line react-hooks/immutability
      if (isListening) stopListening();
      window.speechSynthesis.cancel();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Init SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-KE';

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setInterimTranscript(interim);
        if (final) {
          const textToSend = final.trim();
          if (textToSend) {
            if (sendMessageRef.current) {
              sendMessageRef.current(textToSend, true);
            }
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    } else {
      alert("Your browser does not support voice input.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text, forceSpeak = false) => {
    if ((!speechSynthesisEnabled && !forceSpeak) || !window.speechSynthesis) return;
    
    // Strip markdown for speech
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Try to find a female English voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Female') || v.name.includes('Woman') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Victoria'))
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else {
      // Fallback: UK English often defaults to female, adjust pitch slightly to sound softer
      utterance.lang = 'en-GB';
      utterance.pitch = 1.2;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const closePanel = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200);
  }, []);

  const sendMessage = useCallback(async (text, isVoiceInput = false) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError('');
    setShowSuggestions(false);
    setInput('');
    if (isListening) stopListening();
    window.speechSynthesis.cancel(); // Stop current speech if any

    const userMsg = { role: 'user', text: trimmed, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      if (!API_KEY) {
        throw new Error('VITE_GROQ_API_KEY is not set in your .env file.');
      }

      // Build conversation history for multi-turn context
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: trimmed },
          ],
          temperature: 0.75,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      const botText =
        data?.choices?.[0]?.message?.content ||
        "Pole, I couldn't get a response right now. Please try again!";

      setMessages(prev => [
        ...prev,
        { role: 'bot', text: botText, time: new Date() },
      ]);
      
      speakText(botText, isVoiceInput);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('[AdBot]', err);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, loading, speechSynthesisEnabled]);

  // Keep sendMessageRef updated to avoid stale closures in SpeechRecognition
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }, [input, sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setShowSuggestions(true);
    setError('');
  }, []);

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* ── Floating Bubble ── */}
      {!open && (
        <button
          className="adbot-bubble"
          onClick={() => setOpen(true)}
          aria-label="Open AdBot assistant"
          title="Chat with AdBot"
        >
          {/* Chat icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
            <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
            <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
          </svg>
          {hasUnread && <span className="adbot-unread">1</span>}
        </button>
      )}

      {/* ── Chat Panel ── */}
      {open && (
        <div className={`adbot-panel${closing ? ' closing' : ''}`} role="dialog" aria-label="AdBot Chat">

          {/* Header */}
          <div className="adbot-header">
            <div className="adbot-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                <path d="M18 6l2-2m0 0l2 2m-2-2v4" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="adbot-header-info">
              <div className="adbot-header-name">AdBot</div>
              <div className="adbot-header-status">
                <div className="adbot-status-dot" />
                <span>Always here to help</span>
              </div>
            </div>
            <div className="adbot-header-actions">
              {/* Speaker Toggle */}
              <button
                className="adbot-icon-btn"
                onClick={() => {
                  setSpeechSynthesisEnabled(!speechSynthesisEnabled);
                  if (speechSynthesisEnabled) window.speechSynthesis.cancel();
                }}
                title={speechSynthesisEnabled ? "Mute Voice Responses" : "Enable Voice Responses"}
                aria-label="Toggle voice"
                style={{ opacity: speechSynthesisEnabled ? 1 : 0.6 }}
              >
                {speechSynthesisEnabled ? (
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                     <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                   </svg>
                ) : (
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                     <line x1="23" y1="9" x2="17" y2="15"></line>
                     <line x1="17" y1="9" x2="23" y2="15"></line>
                   </svg>
                )}
              </button>
              {/* Clear chat */}
              <button
                className="adbot-icon-btn"
                onClick={clearChat}
                title="Clear chat"
                aria-label="Clear chat history"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                </svg>
              </button>
              {/* Close */}
              <button
                className="adbot-icon-btn"
                onClick={closePanel}
                title="Close"
                aria-label="Close chat"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="adbot-messages" role="log" aria-live="polite">
            {isEmpty ? (
              <div className="adbot-welcome">
                <div className="adbot-welcome-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3>Karibu! I'm AdBot 👋</h3>
                <p>Your AI assistant for AdHub Kenya. Ask me anything about buying, selling, or navigating the site!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`adbot-msg ${msg.role}`}>
                  <div
                    className="adbot-msg-bubble"
                    {...(msg.role === 'bot'
                      ? { dangerouslySetInnerHTML: { __html: parseMarkdown(msg.text) } }
                      : { children: msg.text }
                    )}
                  />
                  <span className="adbot-msg-time">{formatTime(msg.time)}</span>
                </div>
              ))
            )}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <p className="adbot-error-msg" role="alert">⚠️ {error}</p>
          )}

          {/* Quick Suggestions */}
          {showSuggestions && (
            <div className="adbot-suggestions">
              {INITIAL_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  className="adbot-suggestion-chip"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="adbot-input-bar">
            {interimTranscript && (
               <div style={{position: 'absolute', top: '-25px', left: '16px', fontSize: '12px', color: 'var(--muted-foreground)', background: 'var(--background)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)', zIndex: 10}}>
                 <em>{interimTranscript}...</em>
               </div>
            )}
            <button
              className="adbot-icon-btn"
              style={{ background: isListening ? 'var(--destructive)' : 'transparent', color: isListening ? 'white' : 'var(--foreground)', alignSelf: 'center', flexShrink: 0 }}
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
            <textarea
              ref={textareaRef}
              className="adbot-textarea"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything…"
              rows={1}
              aria-label="Message input"
              disabled={loading}
            />
            <button
              className="adbot-send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
