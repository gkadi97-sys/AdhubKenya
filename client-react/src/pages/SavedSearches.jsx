import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSavedSearches, deleteSavedSearch } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Heart, Search, X, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SavedSearchesPage() {
  const { user } = useAuth();
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getSavedSearches()
        .then(setSearches)
        .catch(() => setSearches([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteSavedSearch(id);
      setSearches((prev) => prev.filter((s) => s.id !== id));
      toast.success('Saved search removed.');
    } catch (e) {
      toast.error('Failed to remove saved search.');
    } finally {
      setDeleting(null);
    }
  };

  const constructUrl = (keyword, filters) => {
    const params = new URLSearchParams();
    if (keyword && keyword !== 'All') params.set('keyword', keyword);
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
    }
    return `/browse?${params.toString()}`;
  };

  if (user === undefined) return null; // Hydrating

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary shadow-inner">
          <Lock className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Login Required</h3>
        <p className="mb-8 text-muted-foreground max-w-sm">Log in to view your saved searches.</p>
        <Link to="/login" className="rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" /> Saved Searches
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Quickly return to your favorite filters.</p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-secondary/50"></div>
            ))}
          </div>
        ) : searches.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {searches.map((s) => (
              <div key={s.id} className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-elevated">
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={deleting === s.id}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition disabled:opacity-50"
                  title="Remove search"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mb-4 pr-6">
                  <h3 className="font-bold text-foreground text-lg truncate">
                    {s.keyword === 'All' ? 'All Keywords' : `"${s.keyword}"`}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(s.filters || {}).map(([k, v]) => (
                      <span key={k} className="rounded border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  to={constructUrl(s.keyword, s.filters)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                >
                  <Search className="h-4 w-4" /> Run Search
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/30 py-20 text-center">
            <Heart className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-xl font-bold">No saved searches</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              You haven't saved any searches yet. When browsing, click "Save Search" to keep track of your favorite filters.
            </p>
            <Link to="/browse" className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
              Go Browse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
