import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategoriesTree } from '@/lib/api';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { CATEGORY_ICONS } from '@/lib/categoryData';

// Helper to get fallback icon if none in DB
const getIcon = (slug, dbIcon) => {
  if (dbIcon) return dbIcon;
  const match = CATEGORY_ICONS.find(c => c.slug === slug);
  return match ? match.icon : '📌';
};

export default function HomeCategoryNav() {
  const { data: tree, isLoading } = useQuery({
    queryKey: ['categories-tree'],
    queryFn: getCategoriesTree,
    staleTime: Infinity,
  });

  const [hoveredRoot, setHoveredRoot] = useState(null);
  const [expandedRoot, setExpandedRoot] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (slug) => {
    if (window.innerWidth < 1024) return; // Disable hover on mobile/tablet
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredRoot(slug);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 1024) return;
    timeoutRef.current = setTimeout(() => {
      setHoveredRoot(null);
    }, 100);
  };

  const toggleAccordion = (slug) => {
    setExpandedRoot(prev => prev === slug ? null : slug);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-10 bg-muted/20 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!tree || tree.length === 0) return null;

  return (
    <nav className="relative" onMouseLeave={handleMouseLeave}>
      <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
        Categories
      </h2>
      <ul className="flex flex-col gap-1 relative z-20">
        {tree.map(root => {
          const hasChildren = root.children && root.children.length > 0;
          const isHovered = hoveredRoot === root.slug;
          const isExpanded = expandedRoot === root.slug;

          return (
            <li key={root.id} className="relative" onMouseEnter={() => handleMouseEnter(root.slug)}>
              {/* Mobile Accordion Toggle / Desktop Link */}
              <div className="flex items-center group">
                <Link
                  to={`/${root.path}`}
                  className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isHovered ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <span className="text-xl">{getIcon(root.slug, root.icon)}</span>
                  <span className="truncate">{root.name}</span>
                </Link>
                {hasChildren && (
                  <button
                    className="p-2 text-muted-foreground lg:hidden"
                    onClick={() => toggleAccordion(root.slug)}
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}
                {hasChildren && (
                  <ChevronRight className={`w-4 h-4 text-muted-foreground hidden lg:block transition-transform ${isHovered ? 'translate-x-1 text-primary' : ''}`} />
                )}
              </div>

              {/* Mobile Accordion Children */}
              {hasChildren && isExpanded && (
                <ul className="lg:hidden pl-10 pr-2 pb-2 space-y-2 mt-1">
                  {root.children.map(child => (
                    <li key={child.id}>
                      <Link
                        to={`/${child.path}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* Desktop Hover Panel */}
              {hasChildren && isHovered && (
                <div className="hidden lg:block absolute left-full top-0 ml-2 w-64 bg-card rounded-xl border border-border shadow-elevated z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-4 bg-muted/30 border-b border-border">
                    <h3 className="font-bold text-foreground">{root.name} Categories</h3>
                  </div>
                  <ul className="p-2 max-h-[70vh] overflow-y-auto">
                    {root.children.map(child => (
                      <li key={child.id}>
                        <Link
                          to={`/${child.path}`}
                          className="block px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
