import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Send, ArrowLeft, Loader2, MessageSquare, Image as ImageIcon,
  Smile, MoreVertical, ExternalLink, MapPin, CheckCheck,
  Search, X, Archive, Flag, Shield, ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { timeAgo, formatPrice } from '@/lib/api';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useMediaQuery';

// ─── Constants ───────────────────────────────────────────────────────────────

const EMOJIS = ['😀','😂','😍','🥺','😊','😭','😅','🙏','❤️','🔥','👍','👋','😎','🤔','💯','🎉','✅','⭐','🙌','😢','🤝','💸','🚗','🏠','📱'];

const QUICK_REPLIES = [
  'Is this still available?',
  'Can I view it today?',
  "What's your best price?",
  'Where are you located?',
];

const MSG_PAGE = 30;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ user, size = 'md', online = false }) {
  const cls = { sm: 'w-7 h-7 text-[10px]', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const dot = { sm: 'w-2 h-2 border', md: 'w-2.5 h-2.5 border-2', lg: 'w-3 h-3 border-2' };
  const name = user?.full_name || user?.name || '?';
  return (
    <div className="relative shrink-0">
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={name}
          className={`${cls[size]} rounded-full object-cover border border-border`}
        />
      ) : (
        <div className={`${cls[size]} rounded-full bg-primary/10 border border-border/50 flex items-center justify-center font-bold text-primary select-none`}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      {online && (
        <span className={`absolute bottom-0 right-0 ${dot[size]} rounded-full bg-emerald-500 border-card`} />
      )}
    </div>
  );
}

function DateSeparator({ date }) {
  const d = new Date(date);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  let label;
  if (d.toDateString() === now.toDateString()) label = 'Today';
  else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
  else label = d.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <div className="flex items-center gap-3 my-3 select-none" aria-hidden="true">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function ReadReceipt({ isRead }) {
  return isRead
    ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-label="Read" />
    : <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/40 shrink-0" aria-label="Delivered" />;
}

function TypingDots({ name }) {
  return (
    <div className="flex items-end gap-2 mb-2">
      <div className="w-7 shrink-0" />
      <div className="flex flex-col items-start">
        <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '160ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '320ms' }} />
        </div>
        <span className="text-[10px] text-muted-foreground mt-1 ml-1">{name} is typing…</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  // Auth
  const [session, setSession] = useState(null);

  // Sidebar
  const [conversations, setConversations] = useState([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  // Thread
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasOlderMsgs, setHasOlderMsgs] = useState(false);
  const [msgOffset, setMsgOffset] = useState(0);

  // Composer
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Presence / typing
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isTypingLocally, setIsTypingLocally] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const msgSubRef = useRef(null);
  const presenceSubRef = useRef(null);
  const typingTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // ── Session ──────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  // ── Conversations + presence heartbeat ───────────────────────────────────
  useEffect(() => {
    if (!session) return;
    fetchConversations();
    touchPresence();
    const heartbeat = setInterval(touchPresence, 30_000);

    // Listen for conversation updates (triggered when a message is sent, updating updated_at)
    // This refreshes the sidebar for the recipient without needing a per-message global sub.
    const convSub = supabase
      .channel('global-conv-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      clearInterval(heartbeat);
      supabase.removeChannel(convSub);
    };
  }, [session]);

  // ── Messages + realtime when conversation changes ─────────────────────────
  useEffect(() => {
    if (!session || !conversationId) return;
    setMessages([]);
    setMsgOffset(0);
    setHasOlderMsgs(false);
    fetchMessages(conversationId, 0);
    subscribeMessages(conversationId);
    subscribePresence(conversationId);
    markAsRead(conversationId);
    return cleanupSubscriptions;
  }, [session, conversationId]);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers.size]);

  // ── Click-outside emoji picker ────────────────────────────────────────────
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handler = (e) => { if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) setShowEmojiPicker(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showEmojiPicker]);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const cleanupSubscriptions = () => {
    if (msgSubRef.current) { supabase.removeChannel(msgSubRef.current); msgSubRef.current = null; }
    if (presenceSubRef.current) { supabase.removeChannel(presenceSubRef.current); presenceSubRef.current = null; }
  };

  const touchPresence = async () => {
    if (!session?.user?.id) return;
    await supabase.from('profiles').update({ last_seen_at: new Date().toISOString() }).eq('id', session.user.id);
  };

  const getDisplayName = (user) => user?.full_name || user?.name || 'Unknown User';

  const lastSeenLabel = (user) => {
    if (!user?.last_seen_at) return 'Offline';
    const diff = Date.now() - new Date(user.last_seen_at).getTime();
    if (diff < 60_000) return 'Active now';
    if (diff < 3_600_000) return `Active ${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `Active ${Math.floor(diff / 3_600_000)}h ago`;
    return `Last seen ${Math.floor(diff / 86_400_000)}d ago`;
  };

  // ─── Fetchers ─────────────────────────────────────────────────────────────

  const fetchConversations = async () => {
    setLoadingConv(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id, updated_at, is_archived, buyer_id, seller_id,
          listing:listings(id, title, price, images, location, status),
          buyer:profiles!buyer_id(id, name, full_name, avatar_url, last_seen_at, is_phone_verified),
          seller:profiles!seller_id(id, name, full_name, avatar_url, last_seen_at, is_phone_verified),
          messages(id, content, image_url, is_read, sender_id, created_at)
        `)
        .or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map(c => {
        const msgs = Array.isArray(c.messages) ? c.messages : [];
        const sorted = [...msgs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const lastMsg = sorted[0];
        const unreadCount = sorted.filter(m => !m.is_read && m.sender_id !== session.user.id).length;
        const otherUser = c.buyer?.id === session.user.id ? c.seller : c.buyer;
        const role = c.buyer_id === session.user.id ? 'buying' : 'selling';
        return { ...c, otherUser, lastMsg, unreadCount, role };
      });

      setConversations(formatted);
    } catch (err) {
      console.error('[Messages] fetchConversations:', err);
    } finally {
      setLoadingConv(false);
    }
  };

  const fetchMessages = async (cId, offset = 0) => {
    if (offset === 0) setLoadingMsgs(true); else setLoadingOlder(true);
    try {
      const { data, error, count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('conversation_id', cId)
        .order('created_at', { ascending: false })
        .range(offset, offset + MSG_PAGE - 1);

      if (error) throw error;
      const ordered = (data || []).reverse();
      setMessages(prev => offset === 0 ? ordered : [...ordered, ...prev]);
      setHasOlderMsgs((count || 0) > offset + MSG_PAGE);
      setMsgOffset(offset + MSG_PAGE);
    } catch (err) {
      console.error('[Messages] fetchMessages:', err);
    } finally {
      setLoadingMsgs(false);
      setLoadingOlder(false);
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
      fetchConversations();
    } catch (_) { /* non-critical */ }
  };

  // ─── Realtime ─────────────────────────────────────────────────────────────

  const subscribeMessages = (cId) => {
    if (msgSubRef.current) supabase.removeChannel(msgSubRef.current);
    // NOTE: We intentionally do NOT use a server-side `filter` here.
    // With RLS enabled, Supabase Realtime only broadcasts filtered rows to
    // the sender. Dropping the filter and filtering client-side ensures the
    // recipient also receives the event. REPLICA IDENTITY FULL is set on the
    // messages table so all columns are available in the change payload.
    msgSubRef.current = supabase
      .channel(`msgs:${cId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, ({ new: msg }) => {
        // Client-side filter: only process messages for the active conversation
        if (msg.conversation_id !== cId) return;
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          const withoutTemp = prev.filter(m => !String(m.id).startsWith('temp-'));
          return [...withoutTemp, msg];
        });
        if (msg.sender_id !== session?.user?.id) markAsRead(cId);
        fetchConversations();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, ({ new: msg }) => {
        if (msg.conversation_id !== cId) return;
        setMessages(prev => prev.map(m => m.id === msg.id ? msg : m));
      })
      .subscribe();
  };

  const subscribePresence = (cId) => {
    if (presenceSubRef.current) supabase.removeChannel(presenceSubRef.current);
    const ch = supabase.channel(`presence:${cId}`, { config: { presence: { key: session.user.id } } });

    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState();
      setOnlineUsers(new Set(Object.keys(state)));
      const typing = new Set();
      Object.entries(state).forEach(([uid, presences]) => {
        if (uid !== session.user.id && presences.some(p => p.typing)) typing.add(uid);
      });
      setTypingUsers(typing);
    }).subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({ user_id: session.user.id, typing: false });
      }
    });

    presenceSubRef.current = ch;
  };

  // ─── Composer actions ─────────────────────────────────────────────────────

  const broadcastTyping = (typing) => {
    presenceSubRef.current?.track({ user_id: session.user.id, typing });
  };

  const handleTyping = (value) => {
    setNewMessage(value);
    if (!isTypingLocally) {
      setIsTypingLocally(true);
      broadcastTyping(true);
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTypingLocally(false);
      broadcastTyping(false);
    }, 2000);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const content = newMessage.trim();
    if (!content || !conversationId) return;

    setNewMessage('');
    setSending(true);
    setIsTypingLocally(false);
    broadcastTyping(false);

    // Optimistic
    const tempId = `temp-${Date.now()}`;
    const optimistic = { id: tempId, conversation_id: conversationId, sender_id: session.user.id, content, created_at: new Date().toISOString(), is_read: false, image_url: null };
    setMessages(prev => [...prev, optimistic]);

    try {
      const { error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: session.user.id, content });
      if (error) throw error;
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);
    } catch (err) {
      toast.error('Failed to send message');
      setNewMessage(content);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;
    setUploadingImage(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `messages/${conversationId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('listing-images').upload(path, file);
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(path);
      await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: session.user.id, content: '📷 Photo', image_url: publicUrl });
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleQuickReply = (text) => {
    setNewMessage(text);
    textareaRef.current?.focus();
  };

  const handleArchive = async (cId) => {
    try {
      await supabase.from('conversations').update({ is_archived: true }).eq('id', cId);
      fetchConversations();
      if (conversationId === cId) navigate('/messages');
      toast.success('Conversation archived');
    } catch (_) { toast.error('Failed to archive'); }
  };

  // ─── Derived ──────────────────────────────────────────────────────────────

  const activeConv = conversations.find(c => c.id === conversationId);
  const otherUser = activeConv?.otherUser;
  const otherName = getDisplayName(otherUser);
  const isOtherOnline = !!(otherUser && onlineUsers.has(otherUser.id));
  const isOtherTyping = !!(otherUser && typingUsers.has(otherUser.id));

  const totalUnread = conversations.reduce((n, c) => n + (c.unreadCount || 0), 0);

  const filteredConversations = conversations.filter(c => {
    if (c.is_archived) return false;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q
      || getDisplayName(c.otherUser).toLowerCase().includes(q)
      || (c.listing?.title || '').toLowerCase().includes(q)
      || (c.lastMsg?.content || '').toLowerCase().includes(q);
    const matchFilter =
      filterTab === 'all'
      || (filterTab === 'buying' && c.role === 'buying')
      || (filterTab === 'selling' && c.role === 'selling')
      || (filterTab === 'unread' && c.unreadCount > 0);
    return matchSearch && matchFilter;
  });

  // Message grouping helpers
  const needsDateSep = (msg, prev) => !prev || new Date(msg.created_at).toDateString() !== new Date(prev.created_at).toDateString();
  const needsAvatar = (msg, prev) => {
    if (msg.sender_id === session?.user?.id) return false;
    return !prev || prev.sender_id !== msg.sender_id || (new Date(msg.created_at) - new Date(prev.created_at)) > 120_000;
  };
  const isGroupEnd = (msg, next) => !next || next.sender_id !== msg.sender_id || (new Date(next.created_at) - new Date(msg.created_at)) > 120_000;

  // Bubble border radius based on grouping
  const bubbleRadius = (isMe, groupStart, groupEnd) => {
    if (groupStart && groupEnd) return 'rounded-2xl';
    if (isMe) {
      if (groupStart) return 'rounded-t-2xl rounded-bl-2xl rounded-br-md';
      if (groupEnd) return 'rounded-b-2xl rounded-tl-2xl rounded-tr-md';
      return 'rounded-l-2xl rounded-r-md';
    } else {
      if (groupStart) return 'rounded-t-2xl rounded-br-2xl rounded-bl-md';
      if (groupEnd) return 'rounded-b-2xl rounded-tr-2xl rounded-tl-md';
      return 'rounded-r-2xl rounded-l-md';
    }
  };

  // Reactive mobile detection — responds to orientation changes & resizing.
  // Replaces the stale window.innerWidth check that only ran once at render time.
  const isMobile = useIsMobile();
  const showSidebar = !isMobile || !conversationId;
  const showThread = !isMobile || !!conversationId;

  // ─── Not logged in ────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center px-4">
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
        <h2 className="text-2xl font-bold mb-2">Sign in to view messages</h2>
        <p className="text-muted-foreground max-w-sm">You need to be logged in to chat with buyers and sellers.</p>
        <Link to="/login" className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90 transition">Sign In</Link>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4" style={{ height: 'calc(100dvh - 70px)', minHeight: 500 }}>
      <div className="flex h-full rounded-2xl border border-border bg-card overflow-hidden shadow-lg">

        {/* ════════════════════ SIDEBAR ════════════════════ */}
        {showSidebar && (
          <div className={`${conversationId ? 'hidden md:flex' : 'flex'} w-full md:w-[300px] xl:w-[340px] shrink-0 flex-col border-r border-border`}>

            {/* Header */}
            <div className="px-4 pt-4 pb-2 shrink-0 border-b border-border bg-card">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-lg font-bold text-foreground">Messages</h1>
                {totalUnread > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-2 py-0.5">{totalUnread}</span>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search conversations…"
                  aria-label="Search conversations"
                  className="w-full pl-8 pr-8 py-2 text-sm bg-secondary/60 rounded-xl border border-transparent focus:border-primary/40 focus:ring-1 focus:ring-primary/30 outline-none transition"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1" role="tablist" aria-label="Filter conversations">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'buying', label: 'Buying' },
                  { key: 'selling', label: 'Selling' },
                  { key: 'unread', label: 'Unread', count: totalUnread },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={filterTab === key}
                    onClick={() => setFilterTab(key)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold transition ${filterTab === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                  >
                    {label}
                    {count > 0 && (
                      <span className={`text-[9px] font-bold px-1 rounded-full ${filterTab === key ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>{count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto" role="list" aria-label="Conversations">
              {loadingConv ? (
                <div className="flex flex-col items-center justify-center p-10 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mb-2 opacity-50" />
                  <span className="text-sm">Loading…</span>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in zoom-in-95 duration-500">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                    <MessageSquare className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  {searchQuery ? (
                    <p className="text-sm font-semibold">No results for "{searchQuery}"</p>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-foreground mb-2">No conversations yet</h2>
                      <p className="text-sm mb-6 max-w-[200px] text-muted-foreground">When buyers or sellers contact you, your chats will appear here.</p>
                      <Link to="/browse" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all hover:scale-105 active:scale-95 inline-block text-sm">
                        Browse Ads
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                filteredConversations.map(c => (
                  <Link
                    key={c.id}
                    to={`/messages/${c.id}`}
                    role="listitem"
                    aria-current={conversationId === c.id ? 'true' : undefined}
                    className={`flex items-start gap-3 px-3 py-3 border-b border-border/40 transition-colors relative
                      ${conversationId === c.id
                        ? 'bg-primary/5 border-l-[3px] border-l-primary'
                        : 'border-l-[3px] border-l-transparent hover:bg-secondary/30'
                      }`}
                  >
                    <Avatar user={c.otherUser} size="md" online={onlineUsers.has(c.otherUser?.id)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className={`text-sm truncate pr-2 ${c.unreadCount > 0 ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                          {getDisplayName(c.otherUser)}
                        </span>
                        {c.lastMsg && (
                          <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(c.lastMsg.created_at)}</span>
                        )}
                      </div>
                      {/* Listing */}
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {c.listing?.images?.[0] && (
                          <img src={c.listing.images[0]} alt="" className="w-3.5 h-3.5 rounded object-cover shrink-0 opacity-60" aria-hidden="true" />
                        )}
                        <span className="text-[11px] text-primary/80 font-medium truncate">{c.listing?.title}</span>
                      </div>
                      {/* Last message */}
                      <p className={`text-xs truncate ${c.unreadCount > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {c.lastMsg?.image_url ? '📷 Photo' : (c.lastMsg?.content || 'Start the conversation')}
                      </p>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-1">
                        {c.unreadCount > 99 ? '99+' : c.unreadCount}
                      </span>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* ════════════════════ THREAD ════════════════════ */}
        {showThread && (
          <div className={`${showSidebar ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-w-0 bg-background/20`}>

            {conversationId ? (
              <>
                {/* ── Thread Header ── */}
                <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border bg-card shadow-sm z-10">
                  <button
                    onClick={() => navigate('/messages')}
                    className="md:hidden p-1.5 -ml-1.5 rounded-full hover:bg-secondary text-muted-foreground transition"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {activeConv ? (
                    <>
                      <Avatar user={otherUser} size="md" online={isOtherOnline} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h2 className="font-bold text-foreground truncate leading-tight">{otherName}</h2>
                          {otherUser?.is_phone_verified && (
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary shrink-0" aria-label="Verified">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-[11px] leading-tight mt-0.5">
                          {isOtherOnline
                            ? <span className="text-emerald-500 font-semibold">● Online</span>
                            : <span className="text-muted-foreground">{lastSeenLabel(otherUser)}</span>
                          }
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {activeConv.listing && (
                          <Link
                            to={`/listing/${activeConv.listing.id}`}
                            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition"
                            aria-label="View listing"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Listing
                          </Link>
                        )}

                        {/* More menu */}
                        <div className="relative group">
                          <button
                            className="p-2 rounded-full hover:bg-secondary transition text-muted-foreground"
                            aria-label="More options"
                            aria-haspopup="true"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none group-hover:pointer-events-auto">
                            {activeConv.listing && (
                              <Link to={`/listing/${activeConv.listing.id}`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition">
                                <ExternalLink className="w-4 h-4 text-muted-foreground" /> View Listing
                              </Link>
                            )}
                            <button
                              onClick={() => handleArchive(conversationId)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition text-left"
                            >
                              <Archive className="w-4 h-4 text-muted-foreground" /> Archive Chat
                            </button>
                            <div className="border-t border-border" />
                            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-destructive/5 text-destructive transition text-left">
                              <Flag className="w-4 h-4" /> Report User
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-destructive/5 text-destructive transition text-left">
                              <Shield className="w-4 h-4" /> Block User
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Loading…</span>
                    </div>
                  )}
                </div>

                {/* ── Listing Context Bar ── */}
                {activeConv?.listing && (
                  <Link
                    to={`/listing/${activeConv.listing.id}`}
                    className="shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-border/50 bg-secondary/10 hover:bg-secondary/20 transition"
                    aria-label={`View listing: ${activeConv.listing.title}`}
                  >
                    {activeConv.listing.images?.[0] ? (
                      <img
                        src={activeConv.listing.images[0]}
                        alt={activeConv.listing.title}
                        className="w-10 h-10 rounded-xl object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate leading-tight">{activeConv.listing.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span className="font-bold text-primary">{formatPrice(activeConv.listing.price)}</span>
                        {activeConv.listing.location && (
                          <>
                            <span aria-hidden>·</span>
                            <span className="flex items-center gap-0.5 truncate">
                              <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                              {activeConv.listing.location.split(',')[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {activeConv.listing.status && activeConv.listing.status !== 'active' && (
                      <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider bg-destructive/10 text-destructive px-2 py-1 rounded-lg">
                        {activeConv.listing.status}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                  </Link>
                )}

                {/* ── Messages Area ── */}
                <div
                  className="flex-1 overflow-y-auto px-4 py-2"
                  role="log"
                  aria-label="Conversation messages"
                  aria-live="polite"
                  aria-relevant="additions"
                >
                  {/* Load older */}
                  {hasOlderMsgs && (
                    <div className="flex justify-center py-3">
                      <button
                        onClick={() => fetchMessages(conversationId, msgOffset)}
                        disabled={loadingOlder}
                        className="text-xs text-primary font-semibold hover:underline flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {loadingOlder && <Loader2 className="w-3 h-3 animate-spin" />}
                        Load older messages
                      </button>
                    </div>
                  )}

                  {loadingMsgs ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
                      <div className="w-14 h-14 rounded-full bg-secondary/80 flex items-center justify-center mb-3">
                        <MessageSquare className="w-6 h-6 opacity-40" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-medium text-foreground/70">Start the conversation</p>
                      <p className="text-xs mt-1">Ask about the listing or make an offer.</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5 py-2">
                      {messages.map((m, idx) => {
                        const isMe = m.sender_id === session.user.id;
                        const prev = messages[idx - 1];
                        const next = messages[idx + 1];
                        const showDate = needsDateSep(m, prev);
                        const showAv = needsAvatar(m, prev);
                        const groupEnd = isGroupEnd(m, next);
                        const groupStart = !prev || prev.sender_id !== m.sender_id || (new Date(m.created_at) - new Date(prev.created_at)) > 120_000;
                        const isTemp = String(m.id).startsWith('temp-');
                        const isLastFromMe = isMe && (!next || next.sender_id !== session.user.id);

                        return (
                          <div key={m.id}>
                            {showDate && <DateSeparator date={m.created_at} />}
                            <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 ${groupEnd ? 'mb-3' : 'mb-0.5'}`}>
                              {/* Avatar column for other user */}
                              {!isMe && (
                                <div className="w-7 shrink-0 self-end mb-0.5">
                                  {showAv && <Avatar user={otherUser} size="sm" />}
                                </div>
                              )}

                              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`} style={{ maxWidth: '68%' }}>
                                {/* Image */}
                                {m.image_url && (
                                  <a href={m.image_url} target="_blank" rel="noopener noreferrer">
                                    <img
                                      src={m.image_url}
                                      alt="Photo"
                                      className="max-w-[220px] rounded-2xl border border-border mb-1 hover:opacity-90 transition"
                                    />
                                  </a>
                                )}
                                {/* Text bubble */}
                                {m.content && m.content !== '📷 Photo' && (
                                  <div
                                    className={`px-4 py-2.5 text-sm leading-relaxed break-words
                                      ${bubbleRadius(isMe, groupStart, groupEnd)}
                                      ${isMe
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card border border-border text-foreground'}
                                      ${isTemp ? 'opacity-60' : ''}`}
                                  >
                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                  </div>
                                )}
                                {/* Timestamp + read receipt */}
                                {groupEnd && (
                                  <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMe && !isTemp && <ReadReceipt isRead={m.is_read} />}
                                    {isTemp && <span className="text-[10px] text-muted-foreground/60">Sending…</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Typing indicator */}
                      {isOtherTyping && <TypingDots name={otherName.split(' ')[0]} />}

                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* ── Quick Replies (shown when no messages yet) ── */}
                {messages.length === 0 && !loadingMsgs && (
                  <div className="shrink-0 px-4 py-2 border-t border-border/30 bg-card/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Quick replies</p>
                    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                      {QUICK_REPLIES.map(r => (
                        <button
                          key={r}
                          onClick={() => handleQuickReply(r)}
                          className="shrink-0 text-xs border border-border rounded-full px-3 py-1.5 hover:border-primary hover:text-primary hover:bg-primary/5 transition font-medium whitespace-nowrap"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Composer ── */}
                <div className="shrink-0 px-4 py-3 border-t border-border bg-card">
                  <form onSubmit={handleSend} className="flex items-end gap-2">
                    {/* Emoji picker */}
                    <div className="relative shrink-0" ref={emojiPickerRef}>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(p => !p)}
                        aria-label="Open emoji picker"
                        aria-expanded={showEmojiPicker}
                        className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                      {showEmojiPicker && (
                        <div
                          className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-2xl shadow-2xl p-2.5 z-[70] w-[200px]"
                          role="dialog"
                          aria-label="Emoji picker"
                        >
                          <div className="grid grid-cols-5 gap-0.5">
                            {EMOJIS.map(emoji => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  setNewMessage(p => p + emoji);
                                  setShowEmojiPicker(false);
                                  textareaRef.current?.focus();
                                }}
                                className="text-xl p-1.5 hover:bg-secondary rounded-xl transition leading-none"
                                aria-label={emoji}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image upload */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      aria-label="Attach image"
                      className="p-2 shrink-0 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition disabled:opacity-40"
                    >
                      {uploadingImage
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : <ImageIcon className="w-5 h-5" />}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                      aria-label="Choose image"
                    />

                    {/* Message textarea */}
                    <textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={e => handleTyping(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message…"
                      rows={1}
                      aria-label="Message text"
                      className="flex-1 bg-secondary/50 rounded-2xl px-4 py-2.5 text-sm outline-none resize-none transition focus:ring-1 focus:ring-primary/40 leading-relaxed"
                      style={{ minHeight: 44, maxHeight: 120 }}
                      disabled={sending}
                    />

                    {/* Send button */}
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      aria-label="Send message"
                      className="p-2.5 shrink-0 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {sending
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : <Send className="w-5 h-5 translate-x-px" aria-hidden="true" />}
                    </button>
                  </form>
                  <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">Enter to send · Shift+Enter for new line</p>
                </div>
              </>
            ) : (
              /* No conversation selected */
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <div className="w-20 h-20 rounded-full bg-secondary/60 flex items-center justify-center mb-5">
                  <MessageSquare className="w-9 h-9 opacity-30" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Your Messages</h2>
                <p className="text-sm max-w-xs leading-relaxed">Select a conversation from the list to read messages and chat.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
