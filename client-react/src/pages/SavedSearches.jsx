import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSavedSearches, deleteSavedSearch } from '@/lib/api';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { Bell, Search, X, Lock, ExternalLink, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const LAST_RUN_KEY = 'adhub_saved_search_last_run';

function getLastRunMap() {
  try { return JSON.parse(localStorage.getItem(LAST_RUN_KEY) || '{}'); }
  catch { return {}; }
}

function setLastRun(id) {
  const map = getLastRunMap();
  map[id] = new Date().toISOString();
  // eslint-disable-next-line no-empty
  try { localStorage.setItem(LAST_RUN_KEY, JSON.stringify(map)); } catch {}
}

function isStale(id, thresholdMs = 24 * 60 * 60 * 1000) {
  const map = getLastRunMap();
  if (!map[id]) return true;
  return Date.now() - new Date(map[id]).getTime() > thresholdMs;
}

function timeAgo(isoString) {
  if (!isoString) return 'Never run';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const PARAM_LABELS = {
  county: 'County', minPrice: 'Min Price', maxPrice: 'Max Price',
  make: 'Brand', model: 'Model', subcategory: 'Type',
  fuel: 'Fuel', transmission: 'Gearbox', condition: 'Condition',
  category: 'Category', bedrooms: 'Beds', bathrooms: 'Baths',
  brand: 'Brand', storage: 'Storage', ram: 'RAM',
};

export default function SavedSearchesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [lastRunMap, setLastRunMap] = useState({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastRunMap(getLastRunMap());
  }, []);

  useEffect(() => {
    if (user?.id) {
      getSavedSearches()
        .then(setSearches)
        .catch(() => setSearches([]))
        .finally(() => setLoading(false));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteSavedSearch(id);
      setSearches((prev) => prev.filter((s) => s.id !== id));
      toast.success('Saved search removed.');
    } catch {
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

  const handleRun = (s) => {
    setLastRun(s.id);
    setLastRunMap(getLastRunMap());
    navigate(constructUrl(s.keyword, s.filters));
  };

  const handleRunAll = () => {
    if (searches.length === 0) return;
    searches.forEach((s) => {
      setLastRun(s.id);
      window.open(constructUrl(s.keyword, s.filters), '_blank', 'noopener');
    });
    setLastRunMap(getLastRunMap());
    toast.success(`Opened ${searches.length} searches in new tabs.`);
  };

  if (user === undefined) return null;

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center animate-in fade-in duration-500">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/50 shadow-inner border border-border">
          <Lock className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3 tracking-tight text-foreground">Login Required</h1>
        <p className="mb-8 text-muted-foreground max-w-sm text-lg">Log in to view and manage your saved searches.</p>
        <Link to="/login" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold shadow-sm transition-all hover:scale-105 active:scale-95">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" /> Saved Searches
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {searches.length > 0
                ? `${searches.length} saved search${searches.length !== 1 ? 'es' : ''}. Searches with a 🔔 badge have new potential matches.`
                : 'Save searches while browsing to return to them instantly and get alerts.'}
            </p>
          </div>
          {searches.length > 1 && (
            <button
              onClick={handleRunAll}
              className="shrink-0 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm"
              title="Open all saved searches in new tabs"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Run All</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 w-full animate-pulse rounded-2xl bg-secondary/50" />
            ))}
          </div>
        ) : searches.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {searches.map((s) => {
              const stale = isStale(s.id);
              const lastRunIso = lastRunMap[s.id];
              const filterEntries = Object.entries(s.filters || {}).filter(([, v]) => v);
              const url = constructUrl(s.keyword, s.filters);

              return (
                <div
                  key={s.id}
                  className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-primary/20 group"
                >
                  {/* Stale / new results badge */}
                  {stale && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-md ring-2 ring-background" title="May have new results">
                      🔔
                    </span>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition disabled:opacity-50"
                    aria-label="Remove saved search"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {/* Content */}
                  <div className="mb-4 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Search className="h-4 w-4 text-primary shrink-0" />
                      <h3 className="font-bold text-foreground text-base truncate">
                        {s.keyword && s.keyword !== 'All' ? `"${s.keyword}"` : 'All listings'}
                      </h3>
                    </div>

                    {/* Filter tags */}
                    {filterEntries.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {filterEntries.slice(0, 4).map(([k, v]) => (
                          <span
                            key={k}
                            className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                          >
                            {PARAM_LABELS[k] || k.replace(/_/g, ' ')}: {v}
                          </span>
                        ))}
                        {filterEntries.length > 4 && (
                          <span className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            +{filterEntries.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Last run time */}
                    <p className="mt-3 text-[11px] text-muted-foreground">
                      Last viewed: <span className="font-semibold">{timeAgo(lastRunIso)}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRun(s)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                      <Search className="h-3.5 w-3.5" /> Run Search
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { setLastRun(s.id); setLastRunMap(getLastRunMap()); }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition"
                      title="Open in new tab"
                      aria-label="Open search in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card shadow-sm py-24 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 shadow-inner">
              <Bell className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">No saved searches yet</h2>
            <p className="mb-8 max-w-md text-muted-foreground text-lg">
              When browsing, click <strong>Save Search</strong> to save your filters and get notified when matching listings appear.
            </p>
            <Link to="/browse" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold shadow-sm transition-all hover:scale-105 active:scale-95 inline-block">
              Browse & Save a Search
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
