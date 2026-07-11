import { Star, StarHalf } from 'lucide-react';

export default function StarRating({ rating = 0, count = 0, size = "md", showCount = true }) {
  const iconSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6"
  }[size];

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5" title={`${rating} out of 5 stars`}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${iconSize} fill-gold text-gold`} />
        ))}
        {hasHalfStar && <StarHalf className={`${iconSize} fill-gold text-gold`} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${iconSize} text-muted-foreground/30`} />
        ))}
      </div>
      {showCount && (
        <span className="text-xs font-medium text-muted-foreground">
          {rating > 0 ? rating.toFixed(1) : "New"} {count > 0 && `(${count})`}
        </span>
      )}
    </div>
  );
}
