import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft, LayoutGrid } from 'lucide-react';
import { CATEGORY_ICONS } from '@/lib/categoryData';

const getIcon = (slug, dbIcon) => {
  if (dbIcon) return dbIcon;
  const match = CATEGORY_ICONS.find(c => c.slug === slug);
  return match ? match.icon : '📌';
};

export default function CategorySidebar({ context }) {
  const { current, parent, children, siblings } = context;

  // We only show the current category (and its children) to keep the sidebar compact.
  // This ensures the filters are always visible near the top without excessive scrolling.
  // The user can navigate to siblings by using the parent/root back links.
  const allItems = [current];

  return (
    <div className="p-4">

      {/* Root level: "All Categories" back link */}
      {!parent && (
        <div className="mb-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
          <div className="mt-2 border-t border-border" />
        </div>
      )}

      {/* Sub-category level: back arrow to parent */}
      {parent && (
        <div className="mb-3">
          <Link
            to={`/${parent.path}`}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span>{getIcon(parent.slug, parent.icon)}</span>
            <span className="truncate">{parent.name}</span>
          </Link>
          <div className="mt-2 border-t border-border" />
        </div>
      )}

      {/* Full sorted list: siblings + current interleaved */}
      <ul className="space-y-0.5">
        {allItems.map(item => {
          const isCurrent = item.id === current.id;

          return (
            <li key={item.id}>
              {isCurrent ? (
                /* Current category — highlighted, expanded */
                <div>
                  <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                    <div className="flex items-center gap-3 truncate min-w-0">
                      {!parent && (
                        <span className="text-xl shrink-0">{getIcon(item.slug, item.icon)}</span>
                      )}
                      <span className="truncate">{item.name}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  </div>

                  {/* Children of current */}
                  {children && children.length > 0 && (
                    <ul className="mt-0.5 ml-4 pl-3 border-l border-border space-y-0.5 pb-1">
                      {children.map(child => (
                        <li key={child.id}>
                          <Link
                            to={`/${child.path}`}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {child.icon && <span className="text-base">{child.icon}</span>}
                            <span className="truncate">{child.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                /* Sibling category */
                <Link
                  to={`/${item.path}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {!parent && (
                    <span className="text-xl shrink-0">{getIcon(item.slug, item.icon)}</span>
                  )}
                  <span className="truncate">{item.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-auto text-muted-foreground/50" />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

