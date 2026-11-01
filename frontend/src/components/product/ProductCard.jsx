import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const activePrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const savings = hasDiscount ? (product.price - product.discountPrice).toFixed(2) : null;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden' }}>
      {/* Product Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
        <Link to={`/products/${product.slug}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <img
            src={product.primaryImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </Link>

        {hasDiscount && (
          <span
            className="badge badge-danger"
            style={{ position: 'absolute', top: '12px', left: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            Save ${savings}
          </span>
        )}

        {product.category && (
          <span
            className="badge badge-neutral"
            style={{ position: 'absolute', top: '12px', right: '12px', backdropFilter: 'blur(4px)', background: 'rgba(255,255,255,0.85)' }}
          >
            {product.category.name}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '0.4rem' }}>
          <RatingStars rating={product.ratingAvg} count={product.reviewsCount} />
        </div>

        <Link to={`/products/${product.slug}`} style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '0.75rem 0' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            ${activePrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={() => addToCart(product.id, 1)}
          disabled={product.stockQuantity <= 0}
          style={{ marginTop: 'auto' }}
        >
          <ShoppingBag size={16} />
          {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
