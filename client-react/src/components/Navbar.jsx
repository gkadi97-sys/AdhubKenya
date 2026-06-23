import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Search, PlusCircle, MessageSquare, Heart, Bell, User, LogOut, FileText } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/browse?keyword=${encodeURIComponent(search)}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-emerald text-primary-foreground shadow-elevated">
              <span className="font-display text-lg font-bold">A</span>
            </div>
            <div className="leading-none hidden sm:block">
              <div className="font-display text-lg font-bold tracking-tight">
                Ad<span className="text-primary">Hub</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Kenya
              </div>
            </div>
          </Link>

          <div className="hidden min-w-0 md:flex">
            <form onSubmit={handleSearch} className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm transition focus-within:border-primary/50 focus-within:shadow-elevated">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Toyota, iPhone, apartment…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground lg:inline">
                Enter
              </kbd>
            </form>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link to="/post-ad" className="hidden items-center gap-2 rounded-full gradient-emerald px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elevated transition hover:opacity-95 sm:inline-flex">
              <PlusCircle className="h-4 w-4" />
              Post Ad — Free
            </Link>

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/messages" title="Messages" className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                  <MessageSquare className="h-5 w-5" />
                </Link>
                
                <div className="relative">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-2 focus:ring-primary/50"
                  >
                    <User className="h-5 w-5" />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
                      <div className="absolute right-0 top-full mt-2 w-56 z-50 rounded-2xl border border-border bg-card p-2 shadow-elevated">
                        <div className="px-3 py-2 border-b border-border mb-2">
                          <p className="text-sm font-semibold truncate">{user.email}</p>
                        </div>
                        <Link to="/my-ads" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition">
                          <FileText className="h-4 w-4 text-muted-foreground" /> My Ads
                        </Link>
                        <button onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition">
                          <Heart className="h-4 w-4 text-muted-foreground" /> Saved Listings
                        </button>
                        <button onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-secondary/50 transition">
                          <Bell className="h-4 w-4 text-muted-foreground" /> Notifications
                        </button>
                        <div className="h-px bg-border my-2"></div>
                        <button 
                          onClick={() => { setProfileOpen(false); logout(); }} 
                          className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted sm:inline-block">
                  Login
                </Link>
                <Link to="/register" className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
