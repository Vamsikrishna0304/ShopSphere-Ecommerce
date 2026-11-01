import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderApi } from '../api/orderApi';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Address form
  const [street, setStreet] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Springfield');
  const [state, setState] = useState('OR');
  const [postalCode, setPostalCode] = useState('97477');
  const [country, setCountry] = useState('United States');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('CARD_MOCK');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [submitting, setSubmitting] = useState(false);

  const shipping = cart.totalPrice >= 50 ? 0 : 5.99;
  const tax = cart.totalPrice * 0.05;
  const grandTotal = cart.totalPrice + shipping + tax;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cart.items.length === 0) {
      toastError('Your cart is empty');
      navigate('/products');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        street,
        city,
        state,
        postalCode,
        country,
        paymentMethod,
      };

      const res = await orderApi.createOrder(orderPayload);
      if (res?.data) {
        success('Order placed successfully!');
        navigate(`/order-confirmation/${res.data.orderNumber}`);
      }
    } catch (err) {
      toastError(err.message || 'Failed to complete order checkout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '2rem' }}>Complete Your Checkout</h1>

      <form onSubmit={handleSubmitOrder} className="checkout-grid">
        {/* Left Column: Delivery & Payment Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Shipping Address */}
          <div className="card">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>1. Shipping Address</h2>

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-input"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">State / Province</label>
                <input
                  type="text"
                  className="form-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Postal / Zip Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-input"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="card">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>2. Payment Method (Simulated)</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {/* Credit Card */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'CARD_MOCK' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: paymentMethod === 'CARD_MOCK' ? 'var(--primary-light)' : 'white',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD_MOCK"
                  checked={paymentMethod === 'CARD_MOCK'}
                  onChange={() => setPaymentMethod('CARD_MOCK')}
                />
                <CreditCard size={20} color="var(--primary)" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Credit / Debit Card</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Simulated instant card authorization</p>
                </div>
              </label>

              {/* UPI */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'UPI_MOCK' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: paymentMethod === 'UPI_MOCK' ? 'var(--primary-light)' : 'white',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI_MOCK"
                  checked={paymentMethod === 'UPI_MOCK'}
                  onChange={() => setPaymentMethod('UPI_MOCK')}
                />
                <QrCode size={20} color="var(--primary)" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>UPI / QR Payment</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant simulated VPA verification</p>
                </div>
              </label>

              {/* COD */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'COD' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: paymentMethod === 'COD' ? 'var(--primary-light)' : 'white',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <Banknote size={20} color="var(--primary)" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash on Delivery (COD)</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay upon delivery of your package</p>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: '#10b981' }}>
              <ShieldCheck size={16} /> 100% Free Sandbox Simulation (No credit card or live charges)
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Review & Place Order</h2>

          {/* Items breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem' }}>
            {cart.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-main)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.quantity}x {item.product?.name}
                </span>
                <span style={{ fontWeight: 600 }}>${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ fontWeight: 600 }}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Tax</span>
              <span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={submitting}
          >
            {submitting ? 'Processing Order...' : 'Confirm & Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
