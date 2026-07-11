export default function ListingCardSkeleton() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/50 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-4 gap-3">
        {/* Title */}
        <div className="h-4 w-3/4 bg-secondary/50 rounded animate-pulse" />
        
        {/* Price */}
        <div className="h-5 w-1/2 bg-secondary/50 rounded animate-pulse mt-1" />
        
        <div className="flex-1" />
        
        {/* Location & Time */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/50">
          <div className="h-3 w-1/3 bg-secondary/50 rounded animate-pulse" />
          <div className="h-3 w-1/4 bg-secondary/50 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
