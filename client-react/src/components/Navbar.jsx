import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Search, PlusCircle, MessageSquare, Heart, Bell, User, LogOut, FileText } from 'lucide-react';
import SearchInput from '@/components/SearchInput';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-3 py-2 sm:px-6 sm:py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-emerald text-primary-foreground shadow-elevated">
              <span className="font-display text-xl font-bold">A</span>
            </div>
            <div className="leading-none hidden sm:block">
              <div className="font-display text-xl font-bold tracking-tight">
                Ad<span className="text-primary">Hub</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Kenya
              </div>
            </div>
          </Link>

          {/* Header Search (Hidden on Homepage) */}
          {!isHomepage && (
            <div className="hidden min-w-0 md:flex transition-all duration-300 ease-in-out w-full max-w-xl">
              <SearchInput />
            </div>
          )}
          
          {isHomepage && <div className="hidden md:block flex-1" />}

          <div className="flex shrink-0 items-center gap-2 col-start-3 justify-self-end">
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
                      <div className="absolute right-0 top-full mt-2 w-64 z-50 rounded-2xl border border-border bg-card shadow-elevated overflow-hidden origin-top-right animate-in zoom-in-95 duration-200">
                        
                        <div className="flex flex-col bg-secondary/30 p-4 border-b border-border">
                          <span className="text-sm font-bold truncate text-foreground">{user?.name || 'User'}</span>
                          <span className="text-xs font-medium truncate text-muted-foreground">{user?.email}</span>
                        </div>
                        
                        <div className="p-2 space-y-0.5">
                          <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary/50 transition active:scale-[0.98]">
                            <User className="h-4 w-4 text-muted-foreground" /> My Profile
                          </Link>
                          <Link to="/my-ads" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary/50 transition active:scale-[0.98]">
                            <FileText className="h-4 w-4 text-muted-foreground" /> My Ads
                          </Link>
                          <Link to="/saved-searches" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary/50 transition active:scale-[0.98]">
                            <Heart className="h-4 w-4 text-muted-foreground" /> Saved Ads
                          </Link>
                          <Link to="/messages" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary/50 transition active:scale-[0.98] lg:hidden">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" /> Messages
                          </Link>
                          <button onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary/50 transition active:scale-[0.98]">
                            <Bell className="h-4 w-4 text-muted-foreground" /> Notifications
                          </button>
                        </div>
                        
                        <div className="h-px bg-border"></div>
                        
                        <div className="p-2 space-y-0.5">
                          <button onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition active:scale-[0.98]">
                            <User className="h-4 w-4" /> Settings
                          </button>
                          <button onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition active:scale-[0.98]">
                            <User className="h-4 w-4 opacity-0" /> Help
                          </button>
                        </div>

                        <div className="h-px bg-border"></div>

                        <div className="p-2">
                          <button 
                            onClick={() => { setProfileOpen(false); logout(); }} 
                            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 transition active:scale-[0.98]"
                          >
                            <LogOut className="h-4 w-4" /> Logout
                          </button>
                        </div>
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
                <div className="relative group">
                  <Link to="/register" className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 whitespace-nowrap inline-block">
                    Create Account
                  </Link>
                  {/* Tooltip */}
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-card border border-border shadow-elevated p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Benefits</p>
                    <ul className="text-xs text-foreground space-y-1.5 font-medium">
                      <li className="flex items-center gap-2"><Heart className="w-3 h-3 text-primary" /> Save Listings</li>
                      <li className="flex items-center gap-2"><MessageSquare className="w-3 h-3 text-primary" /> Message Sellers</li>
                      <li className="flex items-center gap-2"><PlusCircle className="w-3 h-3 text-primary" /> Post Ads Faster</li>
                      <li className="flex items-center gap-2"><Bell className="w-3 h-3 text-primary" /> Track Favorites</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
