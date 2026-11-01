import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }}>
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Slide-over panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'white',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          animation: 'slideLeft 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Shopping Cart</h2>
            <span className="badge badge-primary">{cart.totalItems}</span>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '2rem 1rem' }}>
              <ShoppingBag size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Your cart is empty</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Discover our curated catalog of electronics, fashion, and lifestyle items.</p>
              <button className="btn btn-primary btn-sm" onClick={() => { setIsDrawerOpen(false); navigate('/products'); }}>
                Start Shopping
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                <img
                  src={item.product?.primaryImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
                  alt={item.product?.name}
                  style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.product?.name}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                    ${item.unitPrice?.toFixed(2)}
                  </p>

                  {/* Quantity controls */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', marginTop: '6px' }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ padding: '2px 6px', color: 'var(--text-muted)' }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 8px' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: '2px 6px', color: 'var(--text-muted)' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  style={{ color: '#ef4444', padding: '6px' }}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {cart.items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>Subtotal</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
                ${cart.totalPrice?.toFixed(2)}
              </span>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <Link
                to="/cart"
                onClick={() => setIsDrawerOpen(false)}
                style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
