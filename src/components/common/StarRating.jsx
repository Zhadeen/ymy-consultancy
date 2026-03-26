import { Star } from 'lucide-react';

export default function StarRating({ rating, maxStars = 5, size = 16, showValue = true, className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;
          return (
            <Star
              key={i}
              size={size}
              className={`${filled ? 'fill-gold text-gold' : partial ? 'fill-gold/50 text-gold' : 'fill-none text-dark-500'} transition-colors`}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-cream ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
