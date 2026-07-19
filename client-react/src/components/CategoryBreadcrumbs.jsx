import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function CategoryBreadcrumbs({ ancestors, current }) {
  return (
    <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
      <ChevronRight className="w-4 h-4 shrink-0" />
      
      {ancestors && ancestors.map((anc) => (
        <div key={anc.id} className="flex items-center gap-2">
          <Link to={`/${anc.path}`} className="hover:text-foreground transition-colors">
            {anc.name}
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
        </div>
      ))}
      
      <span className="text-foreground font-semibold truncate">
        {current.name}
      </span>
    </nav>
  );
}
