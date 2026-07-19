import { useLocation, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategoryContext } from '@/lib/api';
import Category from '@/pages/Category.jsx';

export default function CategoryRouter() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/|\/$/g, '');

  const { data: context, isLoading, isError } = useQuery({
    queryKey: ['category-context', path],
    queryFn: () => getCategoryContext(path),
    staleTime: Infinity,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If path doesn't match any category, 404 by redirecting to home (or a dedicated 404 page)
  if (isError || !context || !context.current) {
    return <Navigate to="/" replace />;
  }

  return <Category context={context} />;
}
