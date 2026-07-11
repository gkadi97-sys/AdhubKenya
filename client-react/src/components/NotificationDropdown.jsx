import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Bell, MessageSquare, Star, CheckCircle, Info, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { timeAgo } from '@/lib/api';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev].slice(0, 20));
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'review':
        return <Star className="h-4 w-4 text-gold" />;
      case 'listing_approved':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50 rounded-2xl border border-border bg-card shadow-elevated overflow-hidden origin-top-right animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 shrink-0">
            <h3 className="font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto overscroll-contain flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Bell className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-foreground">No notifications yet</p>
                <p className="text-xs text-muted-foreground mt-1">When you get updates, they'll show up here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`relative flex items-start gap-3 p-4 transition-colors ${
                      n.is_read ? 'bg-background' : 'bg-primary/5'
                    } hover:bg-secondary/50`}
                  >
                    <div className="shrink-0 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border shadow-sm">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight mb-0.5">
                        {n.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-snug mb-1.5">
                        {n.message}
                      </p>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    {!n.is_read && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleMarkAsRead(n.id);
                        }}
                        className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        title="Mark as read"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {n.link && (
                      <Link
                        to={n.link}
                        className="absolute inset-0 z-0"
                        onClick={() => {
                          if (!n.is_read) handleMarkAsRead(n.id);
                          setOpen(false);
                        }}
                        aria-label={`View ${n.title}`}
                      ></Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
