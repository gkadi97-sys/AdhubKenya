import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Search, PlusCircle, MessageSquare, Heart, Bell } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
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
              <div className="flex items-center gap-4 ml-2">
                <button title="Saved" className="text-muted-foreground hover:text-foreground hidden lg:block"><Heart className="h-5 w-5" /></button>
                <button title="Messages" className="text-muted-foreground hover:text-foreground hidden lg:block"><MessageSquare className="h-5 w-5" /></button>
                <button title="Notifications" className="text-muted-foreground hover:text-foreground hidden lg:block"><Bell className="h-5 w-5" /></button>
                <div className="h-6 w-px bg-border hidden lg:block"></div>
                <Link to="/my-ads" className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted sm:inline-block">
                  My Ads
                </Link>
                <button onClick={logout} className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
                  Logout
                </button>
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
