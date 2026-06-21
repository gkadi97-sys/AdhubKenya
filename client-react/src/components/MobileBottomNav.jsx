import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, PlusCircle, MessageSquare, User } from 'lucide-react';

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Categories', path: '/browse', icon: Grid },
    { label: 'Sell', path: '/post-ad', icon: PlusCircle, isPrimary: true },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`nav-item ${isActive ? 'active' : ''} ${item.isPrimary ? 'primary-item' : ''}`}
          >
            <div className="icon-wrapper">
              <Icon size={item.isPrimary ? 28 : 24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
