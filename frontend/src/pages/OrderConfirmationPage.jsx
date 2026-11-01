import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Home } from 'lucide-react';
import { orderApi } from '../api/orderApi';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await orderApi.getByOrderNumber(orderNumber);
        if (res?.data) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error('Failed to load order confirmation', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderNumber]);

  return (
    <div className="container page-wrapper" style={{ maxWidth: '720px' }}>
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
          <CheckCircle2 size={36} />
        </div>

        <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Order Placed Successfully</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Thank You For Your Order!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          We've received your order and our fulfillment team is preparing your package.
        </p>

        {order && (
          <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Order Number</span>
                <p style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--primary)' }}>{order.orderNumber}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Paid</span>
                <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>${order.totalAmount?.toFixed(2)}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Status</span>
                <p><span className="badge badge-primary">{order.status}</span></p>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Shipping Destination</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>{order.shippingAddressSnapshot}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-secondary">
            <Package size={18} /> View All Orders
          </Link>
          <Link to="/products" className="btn btn-primary">
            <Home size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
