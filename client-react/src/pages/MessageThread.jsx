import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSEO } from '@/lib/useSEO';
import { ArrowLeft, Send, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessageThreadPage() {
  const { id } = useParams();
  useSEO({
    title: 'Conversation | AdHub Kenya',
    description: 'Chat with a buyer or seller on AdHub Kenya.',
    canonicalPath: `/messages/${id}`
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user && id) {
      // eslint-disable-next-line react-hooks/immutability
      loadConversation();
      
      // Subscribe to new messages
      const subscription = supabase
        .channel(`public:messages:conversation_id=eq.${id}`)
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `conversation_id=eq.${id}`
          }, 
          (payload) => {
            setMessages(prev => [...prev, payload.new]);
            if (payload.new.sender_id !== user.id) {
              // eslint-disable-next-line react-hooks/immutability
              markAsRead();
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(subscription);
      };
    }
    // eslint-disable-next-line
  }, [user, id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversation = async () => {
    try {
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select(`
          id, buyer_id, seller_id, listing_id,
          listings ( id, title, price, images, status )
        `)
        .eq('id', id)
        .single();

      if (convError) throw convError;
      
      // Security check
      if (conv.buyer_id !== user.id && conv.seller_id !== user.id) {
        toast.error('Unauthorized');
        navigate('/messages');
        return;
      }

      const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, is_phone_verified')
        .eq('id', otherUserId)
        .single();

      setConversation({ ...conv, otherUser: profile || { name: 'Unknown User' } });

      const { data: msgs, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;
      setMessages(msgs || []);
      
      markAsRead();
    } catch (error) {
      console.error(error);
      toast.error('Failed to load conversation');
      navigate('/messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', id)
        .neq('sender_id', user.id)
        .eq('is_read', false);
    // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
    } catch (e) {
      // non critical
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      // Optimistic update
      const tempId = 'temp-' + Date.now();
      setMessages(prev => [...prev, {
        id: tempId,
        conversation_id: id,
        sender_id: user.id,
        content: content,
        created_at: new Date().toISOString(),
        is_read: false
      }]);

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: id,
          sender_id: user.id,
          content: content
        });

      if (error) throw error;
      
      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);

    // eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(content); // restore text
      setMessages(prev => prev.filter(m => m.id !== 'temp'));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-muted-foreground">Loading...</div>;
  if (!conversation) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background max-w-4xl mx-auto w-full border-x border-border">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-card border-b border-border shrink-0 z-10 sticky top-0">
        <Link to="/messages" className="p-2 -ml-2 rounded-full hover:bg-secondary transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
            {conversation.otherUser.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="font-bold text-foreground leading-tight truncate">
              {conversation.otherUser.name || 'User'}
            </h2>
            <div className="text-xs text-muted-foreground truncate">
              {conversation.otherUser.is_phone_verified ? 'Verified User' : 'Unverified'}
            </div>
          </div>
        </div>
      </div>

      {/* Listing Context Bar */}
      {conversation.listings && (
        <Link to={`/listing/${conversation.listings.id}`} className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center justify-between hover:bg-secondary transition shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-12 rounded bg-muted overflow-hidden shrink-0">
              <img src={conversation.listings.images?.[0] || 'https://placehold.co/100'} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="truncate">
              <div className="text-sm font-semibold truncate text-foreground">{conversation.listings.title}</div>
              <div className="text-xs font-bold text-primary">KES {Number(conversation.listings.price).toLocaleString()}</div>
            </div>
          </div>
          {conversation.listings.status !== 'active' && (
            <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-1 rounded-md uppercase tracking-wider">
              {conversation.listings.status}
            </span>
          )}
        </Link>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
            <p>Start of conversation</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_id === user.id;
            const showTime = i === 0 || new Date(msg.created_at) - new Date(messages[i-1].created_at) > 10 * 60000;
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {showTime && (
                  <span className="text-[10px] text-muted-foreground font-medium mb-2 mt-4">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                  isMe 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-card border border-border text-foreground rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                {isMe && i === messages.length - 1 && (
                  <span className="text-[10px] text-muted-foreground mt-1 mr-1">
                    {msg.is_read ? 'Read' : 'Delivered'}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-card border-t border-border shrink-0">
        <form onSubmit={handleSend} className="flex items-end gap-2 relative">
          <button type="button" className="p-2.5 text-muted-foreground hover:text-primary transition shrink-0 rounded-full hover:bg-secondary">
            <ImageIcon className="h-5 w-5" />
          </button>
          
          <textarea 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-secondary rounded-2xl px-4 py-3 min-h-[44px] max-h-[120px] outline-none text-sm resize-none focus:ring-1 focus:ring-primary/30"
            rows={1}
            disabled={sending}
          />
          
          <button 
            type="submit" 
            disabled={!newMessage.trim() || sending}
            className={`p-3 rounded-full shrink-0 transition ${
              newMessage.trim() && !sending
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-secondary text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Send className="h-5 w-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
