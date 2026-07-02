import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '@/lib/useSEO';
import { MessageSquare, Clock, User, ChevronRight } from 'lucide-react';
import { timeAgo } from '@/lib/api';

export default function MessagesPage() {
  useSEO({
    title: 'Messages | AdHub Kenya',
    description: 'View your messages and conversations on AdHub Kenya.',
    canonicalPath: '/messages'
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      // Fetch conversations where user is either buyer or seller
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          created_at,
          updated_at,
          buyer_id,
          seller_id,
          listing_id,
          listings ( id, title, images ),
          messages ( id, content, created_at, is_read, sender_id )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Get profiles for the other users
      const otherUserIds = data.map(c => c.buyer_id === user.id ? c.seller_id : c.buyer_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', [...new Set(otherUserIds)]);

      const enriched = data.map(c => {
        const isBuyer = c.buyer_id === user.id;
        const otherUserId = isBuyer ? c.seller_id : c.buyer_id;
        const otherUser = profiles?.find(p => p.id === otherUserId) || { full_name: 'Unknown User' };
        
        // Sort messages manually as Supabase nested select might not order them reliably
        const sortedMsgs = c.messages?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || [];
        const lastMsg = sortedMsgs[0];
        const unreadCount = sortedMsgs.filter(m => !m.is_read && m.sender_id !== user.id).length;

        return {
          ...c,
          otherUser,
          isBuyer,
          lastMsg,
          unreadCount
        };
      });

      setConversations(enriched);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-primary/60 mb-6">
          <MessageSquare className="h-8 w-8" />
        </div>
        <h3 className="font-display text-2xl font-bold mb-2">Login Required</h3>
        <p className="text-muted-foreground mb-8">You need to be logged in to view your messages.</p>
        <Link to="/login" className="rounded-xl gradient-emerald px-6 py-3 text-sm font-semibold text-primary-foreground">Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-card border border-border rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No messages yet</h3>
            <p className="text-muted-foreground">When you contact a seller or a buyer contacts you, the conversation will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map(conv => (
              <Link 
                key={conv.id} 
                to={`/messages/${conv.id}`}
                className="block bg-card border border-border rounded-2xl p-4 sm:p-5 hover:border-primary/50 transition relative"
              >
                <div className="flex gap-4 items-center">
                  {/* Image */}
                  <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-secondary">
                    <img 
                      src={conv.listings?.images?.[0] || 'https://placehold.co/100'} 
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-base truncate pr-4">{conv.otherUser.full_name || 'User'}</h3>
                      <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {timeAgo(conv.updated_at)}
                      </span>
                    </div>
                    
                    <div className="text-sm font-semibold text-foreground truncate mb-1">
                      {conv.listings?.title || 'Deleted Listing'}
                    </div>
                    
                    <div className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                      {conv.lastMsg ? (
                        <>
                          {conv.lastMsg.sender_id === user.id ? 'You: ' : ''}
                          {conv.lastMsg.content}
                        </>
                      ) : (
                        'No messages yet'
                      )}
                    </div>
                  </div>
                  
                  {/* Unread & Arrow */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {conv.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {conv.unreadCount} NEW
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground opacity-50" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
