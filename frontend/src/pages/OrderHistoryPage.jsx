import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { orderApi } from '../api/orderApi';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await orderApi.getMyOrders();
        if (res?.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-success">Delivered</span>;
      case 'SHIPPED':
        return <span className="badge badge-primary">Shipped</span>;
      case 'CONFIRMED':
        return <span className="badge badge-primary">Confirmed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  return (
    <div className="container page-wrapper">
      <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '2rem' }}>My Order History</h1>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[1, 2].map((n) => (
            <div key={n} className="card skeleton" style={{ height: '160px' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Package size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No orders found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't placed any orders with ShopSphere yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '1.05rem', color: 'var(--primary)' }}>
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <Calendar size={13} /> {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</span>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Items in order */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
                      alt=""
                      style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.productName}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> Shipped to: {order.shippingAddressSnapshot}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
