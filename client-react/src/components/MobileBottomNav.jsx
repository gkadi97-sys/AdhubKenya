import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const [ripple, setRipple] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip on first ever visit
  useEffect(() => {
    if (!localStorage.getItem('adhub_sell_tooltip_seen')) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        localStorage.setItem('adhub_sell_tooltip_seen', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Dismiss tooltip after 4 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const handleSellClick = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/browse', icon: Search },
    null, // placeholder for center sell button
    { label: 'Messages', path: '/messages', icon: MessageSquare, badge: true },
    { label: 'Account', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-background/95 backdrop-blur-md border-t border-border pb-safe pt-2 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}>
      {navItems.map((item, idx) => {
        // Center Sell Button
        if (item === null) {
          return (
            <div key="sell" className="relative flex flex-col items-center">
              {/* First-time tooltip */}
              {showTooltip && (
                <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                  Post your first ad
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                </div>
              )}
              <Link
                to="/post-ad"
                onClick={handleSellClick}
                className="relative -mt-8 flex items-center justify-center w-16 h-16 rounded-full gradient-emerald text-primary-foreground shadow-[0_8px_25px_rgba(0,0,0,0.25)] ring-4 ring-background transition-transform active:scale-90 overflow-hidden"
                aria-label="Post Ad"
              >
                {/* Ripple */}
                {ripple && (
                  <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                )}
                <PlusCircle size={28} strokeWidth={2} />
              </Link>
              <span className="text-[10px] mt-1 font-semibold text-primary">Sell</span>
            </div>
          );
        }

        const Icon = item.icon;
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

        return (
          <Link
            key={item.label}
            to={item.path}
            className={`relative flex flex-col items-center justify-center p-2 min-w-[56px] min-h-[44px] transition-all active:scale-90 ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all ${isActive ? 'bg-primary/10' : ''}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {/* Unread badge for Messages */}
              {item.badge && user && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
              )}
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
