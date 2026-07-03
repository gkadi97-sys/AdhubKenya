import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, ArrowLeft, Loader2, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { timeAgo } from '@/lib/api';

export default function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Realtime subscription ref
  const subscriptionRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchConversations();
  }, [session, conversationId]); // Refresh conversations if ID changes to update unread status

  useEffect(() => {
    if (!session || !conversationId) return;
    fetchMessages(conversationId);
    subscribeToMessages(conversationId);
    markAsRead(conversationId);

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [session, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    setLoadingConv(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id, updated_at,
          listing:listings(id, title, price, images),
          buyer:profiles!buyer_id(id, name, avatar_url),
          seller:profiles!seller_id(id, name, avatar_url),
          messages(id, content, is_read, sender_id, created_at)
        `)
        .or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Post-process to sort correctly and find last message
      const formatted = (data || []).map(c => {
        const msgs = Array.isArray(c.messages) ? c.messages : [];
        const sortedMsgs = msgs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const lastMsg = sortedMsgs[0];
        const unreadCount = sortedMsgs.filter(m => !m.is_read && m.sender_id !== session.user.id).length;
        const otherUser = c.buyer?.id === session.user.id ? c.seller : c.buyer;
        
        return {
          ...c,
          otherUser,
          lastMsg,
          unreadCount
        };
      });

      setConversations(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConv(false);
    }
  };

  const fetchMessages = async (cId) => {
    setLoadingMsgs(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', cId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const markAsRead = async (cId) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', cId)
        .neq('sender_id', session.user.id)
        .eq('is_read', false);
    } catch (err) {
      console.error(err);
    }
  };

  const subscribeToMessages = (cId) => {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
    }

    subscriptionRef.current = supabase
      .channel(`conversation:${cId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${cId}`
      }, payload => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
        if (payload.new.sender_id !== session?.user?.id) {
          markAsRead(cId);
        }
      })
      .subscribe();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: session.user.id,
        content
      });
      if (error) throw error;

      // Update conversation updated_at
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);
      
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
      setNewMessage(content); // Restore draft
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find(c => c.id === conversationId);

  // Responsive Layout
  const isMobile = window.innerWidth < 768;
  const showList = !isMobile || !conversationId;
  const showThread = !isMobile || conversationId;

  if (!session) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center px-4">
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-foreground">Sign in to view messages</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">You need to be logged in to chat with buyers and sellers.</p>
        <Link to="/auth/login" className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-primary/90 transition">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 md:py-8 h-[calc(100vh-120px)] md:h-[calc(100vh-200px)] min-h-[500px] max-h-[800px]">
      <div className="flex h-full rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/5">
        
        {/* Sidebar / Conversation List */}
        {showList && (
          <div className={`${showThread ? 'hidden md:flex w-1/3 min-w-[300px]' : 'w-full'} flex-col border-r border-border`}>
            <div className="p-4 border-b border-border bg-secondary/30">
              <h2 className="text-xl font-bold text-foreground">Messages</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loadingConv ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-50" />
                  Loading...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No messages yet.</p>
                </div>
              ) : (
                conversations.map(c => (
                  <Link 
                    key={c.id} 
                    to={`/messages/${c.id}`}
                    className={`flex items-start gap-3 p-4 border-b border-border hover:bg-secondary/50 transition ${conversationId === c.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                  >
                    <img 
                      src={c.otherUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${c.otherUser?.name || 'U'}`} 
                      alt="" 
                      className="w-12 h-12 rounded-full border border-border object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-semibold text-sm truncate text-foreground pr-2">{c.otherUser?.name || 'Unknown User'}</h4>
                        {c.lastMsg && <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo(c.lastMsg.created_at)}</span>}
                      </div>
                      <p className="text-xs text-primary font-medium truncate mb-1">{c.listing?.title}</p>
                      <p className={`text-xs truncate ${c.unreadCount > 0 ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                        {c.lastMsg?.content || 'No messages yet'}
                      </p>
                    </div>
                    {c.unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </div>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chat Thread */}
        {showThread && (
          <div className={`${showList ? 'hidden md:flex flex-1' : 'w-full'} flex-col bg-background/50 relative`}>
            {conversationId ? (
              <>
                {/* Header */}
                <div className="h-16 px-4 border-b border-border flex items-center gap-3 bg-card sticky top-0 z-10 shadow-sm">
                  <button onClick={() => navigate('/messages')} className="md:hidden p-2 -ml-2 rounded-full hover:bg-secondary text-muted-foreground">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {activeConv && (
                    <>
                      <img 
                        src={activeConv.otherUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${activeConv.otherUser?.name || 'U'}`} 
                        alt="" 
                        className="w-10 h-10 rounded-full border border-border object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate">{activeConv.otherUser?.name || 'Unknown User'}</h3>
                        <Link to={`/listing/${activeConv.listing?.id}`} className="text-xs text-primary hover:underline truncate block">
                          {activeConv.listing?.title}
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMsgs ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-muted-foreground">
                      <p>Send a message to start the conversation.</p>
                    </div>
                  ) : (
                    messages.map((m, idx) => {
                      const isMe = m.sender_id === session.user.id;
                      const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender_id === session.user.id);
                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                          {!isMe && showAvatar && (
                            <img 
                              src={activeConv?.otherUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${activeConv?.otherUser?.name || 'U'}`} 
                              alt="" 
                              className="w-8 h-8 rounded-full border border-border mr-2 self-end mb-1"
                            />
                          )}
                          {!isMe && !showAvatar && <div className="w-10"></div>}
                          
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-secondary text-foreground rounded-bl-sm border border-border'}`}>
                            <p className="whitespace-pre-wrap break-words">{m.content}</p>
                            <span className={`text-[10px] mt-1 block ${isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                              {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-card">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim() || sending}
                      className="rounded-full bg-primary p-3 text-primary-foreground transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center w-11 h-11 shrink-0"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 translate-x-px -translate-y-px" />}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-secondary/10">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-10 h-10 opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Your Messages</h3>
                <p className="max-w-xs">Select a conversation from the list to view your messages or reply.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
