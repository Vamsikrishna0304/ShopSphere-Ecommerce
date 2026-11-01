import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, count, showCount = true, size = 16 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {stars.map((star) => {
          const filled = rating >= star;
          const half = rating >= star - 0.5 && rating < star;

          return (
            <Star
              key={star}
              size={size}
              fill={filled ? '#f59e0b' : half ? '#fde68a' : 'none'}
              color={filled || half ? '#f59e0b' : '#cbd5e1'}
            />
          );
        })}
      </div>
      {showCount && (
        <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 500, marginLeft: '4px' }}>
          {rating ? rating.toFixed(1) : 'New'} {count !== undefined ? `(${count})` : ''}
        </span>
      )}
    </div>
  );
}
