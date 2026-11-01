import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = (cart.totalPrice >= 50 || cart.totalItems === 0) ? 0 : 5.99;
  const tax = cart.totalPrice * 0.05;
  const grandTotal = cart.totalPrice + shipping + tax;

  if (cart.items.length === 0) {
    return (
      <div className="container page-wrapper" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <ShoppingBag size={54} color="#cbd5e1" style={{ margin: '0 auto 1.5rem auto' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '2rem' }}>Shopping Cart ({cart.totalItems} items)</h1>

      <div className="checkout-grid">
        {/* Cart Item Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Item Details</span>
              <button onClick={clearCart} style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                Clear Cart
              </button>
            </div>

            <div style={{ padding: '0 1.5rem' }}>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.25rem 0',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <img
                    src={item.product?.primaryImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
                    alt={item.product?.name}
                    style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/products/${item.product?.slug}`}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        {item.product?.name}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Unit: ${item.unitPrice.toFixed(2)}
                    </p>

                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '4px 10px', color: 'var(--text-muted)' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, padding: '0 10px' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '4px 10px', color: 'var(--text-muted)' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                      ${item.subtotal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ color: '#ef4444', padding: '4px' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping</span>
              <span style={{ fontWeight: 600 }}>
                {shipping === 0 ? <span className="badge badge-success">Free</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (5%)</span>
              <span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={() => navigate('/checkout')}
          >
            Checkout Now <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
