import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/browse', icon: Search },
    { label: 'Post', path: '/post-ad', icon: PlusCircle, isPrimary: true },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-background border-t border-border pb-safe pt-2 px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`flex flex-col items-center justify-center p-2 min-w-[64px] transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            } ${item.isPrimary ? '-mt-6' : ''}`}
          >
            <div className={`flex items-center justify-center rounded-full ${
              item.isPrimary 
                ? 'bg-primary text-primary-foreground w-14 h-14 shadow-lg shadow-primary/30 ring-4 ring-background' 
                : 'w-8 h-8'
            }`}>
              <Icon size={item.isPrimary ? 28 : 24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {!item.isPrimary && (
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
