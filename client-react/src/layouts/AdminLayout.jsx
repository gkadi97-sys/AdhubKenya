import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LayoutList, Settings, LogOut, Menu, X, ShieldAlert, FileText, Bell, CreditCard, Activity, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSEO } from '@/lib/useSEO';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'User Management', icon: Users, path: '/admin/users' },
  { label: 'Ad Management', icon: LayoutList, path: '/admin/ads' },
  { label: 'CV Marketplace', icon: Briefcase, path: '/admin/cvs' },
  { label: 'Payments & Revenue', icon: CreditCard, path: '/admin/payments' },
  { label: 'Listing Moderation', icon: ShieldAlert, path: '/admin/moderation' },
  { label: 'Reports & Actions', icon: ShieldAlert, path: '/admin/reports' },
  { label: 'CMS & Content', icon: FileText, path: '/admin/cms' },
  { label: 'Analytics', icon: Activity, path: '/admin/analytics' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set Admin SEO
  useSEO({
    title: 'AdHub Admin Panel',
    description: 'AdHub Kenya Secure Admin Panel',
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-secondary/20 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ShieldAlert className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              AdHub<span className="text-primary">Admin</span>
            </span>
          </Link>
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between pb-6">
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <div className="mb-4 px-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Main Menu
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Widget */}
          <div className="px-4">
            <div className="rounded-2xl bg-secondary/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{user?.name || 'Administrator'}</p>
                  <p className="truncate text-xs font-medium text-muted-foreground">Super Admin</p>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-destructive transition" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-foreground hidden sm:block">
              {NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary transition">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card"></span>
            </button>
            <Link to="/" target="_blank" className="text-sm font-semibold text-primary hover:underline hidden sm:block">
              View Live Site ↗
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
