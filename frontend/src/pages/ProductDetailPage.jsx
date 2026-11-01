import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, CheckCircle, AlertTriangle, Truck, ArrowLeft, Send } from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RatingStars from '../components/common/RatingStars';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchProductData() {
      setLoading(true);
      try {
        const res = await productApi.getBySlug(slug);
        if (res?.data) {
          setProduct(res.data);
          setSelectedImage(res.data.primaryImageUrl);
          // Fetch reviews
          const reviewRes = await productApi.getReviews(res.data.id);
          if (reviewRes?.data) setReviews(reviewRes.data);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [slug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toastError('Please log in to submit a review');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await productApi.addReview(product.id, {
        rating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res?.data) {
        setReviews([res.data, ...reviews]);
        success('Review submitted successfully!');
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container page-wrapper">
        <div className="product-detail-grid">
          <div className="skeleton" style={{ height: '480px', borderRadius: 'var(--radius-lg)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '36px', width: '70%' }} />
            <div className="skeleton" style={{ height: '24px', width: '40%' }} />
            <div className="skeleton" style={{ height: '80px', width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container page-wrapper" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>The product you are looking for does not exist.</p>
        <Link to="/products" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  const activePrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="container page-wrapper">
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="product-detail-grid">
        {/* Gallery */}
        <div>
          <div style={{ width: '100%', height: '460px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'white', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <img
              src={selectedImage || product.primaryImageUrl}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: selectedImage === img.imageUrl ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    padding: 0,
                  }}
                >
                  <img src={img.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Purchasing */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            {product.category && <span className="badge badge-primary">{product.category.name}</span>}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>SKU: {product.sku}</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.75rem' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <RatingStars rating={product.ratingAvg} count={product.reviewsCount} size={18} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ${activePrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  ${product.price.toFixed(2)}
                </span>
                <span className="badge badge-danger">
                  Save ${(product.price - product.discountPrice).toFixed(2)}
                </span>
              </>
            )}
          </div>

          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Stock status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {product.stockQuantity > 0 ? (
              <>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ color: '#10b981', fontWeight: 600 }}>In Stock</span>
                <span style={{ color: 'var(--text-muted)' }}>({product.stockQuantity} units available)</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} color="#ef4444" />
                <span style={{ color: '#ef4444', fontWeight: 600 }}>Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity & Add to Cart button */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'white' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '0.65rem 1rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}
              >
                -
              </button>
              <span style={{ padding: '0 0.8rem', fontWeight: 700, fontSize: '1rem' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                style={{ padding: '0.65rem 1rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}
              >
                +
              </button>
            </div>

            <button
              className="btn btn-primary btn-lg"
              disabled={product.stockQuantity <= 0}
              onClick={() => addToCart(product.id, quantity)}
              style={{ flex: 1 }}
            >
              <ShoppingBag size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section style={{ marginTop: '4.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Customer Reviews</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No customer reviews yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.reviewerName}</span>
                    <RatingStars rating={rev.rating} showCount={false} size={14} />
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{rev.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Write a Review</h3>
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select
                    className="form-select"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terribly Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Headline</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g., Exceptional audio clarity"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Review Details</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Share your experience with this item..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={submittingReview}
                >
                  <Send size={16} /> Submit Review
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Please sign in to write an authentic review for this product.
                </p>
                <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
