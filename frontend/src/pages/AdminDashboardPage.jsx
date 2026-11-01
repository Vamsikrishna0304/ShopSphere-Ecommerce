import React, { useState, useEffect } from 'react';
import { DollarSign, Package, ShoppingBag, Users, Plus, Edit, Trash2, Check, RefreshCw } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import { useToast } from '../context/ToastContext';

export default function AdminDashboardPage() {
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    sku: '',
    categoryId: '',
    featured: false,
    imageUrls: [''],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getOrders({ size: 50 }),
        productApi.getAll({ size: 50 }),
        categoryApi.getAll(),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (ordersRes?.data) setOrders(ordersRes.data.content);
      if (productsRes?.data) setProducts(productsRes.data.content);
      if (categoriesRes?.data) setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
      toastError('Could not load administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      success(`Order updated to ${newStatus}`);
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to update order status');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      success('Product deleted');
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to delete product');
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      stockQuantity: '',
      sku: '',
      categoryId: categories[0]?.id || '',
      featured: false,
      imageUrls: [''],
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice || '',
      stockQuantity: p.stockQuantity,
      sku: p.sku,
      categoryId: p.category?.id || '',
      featured: p.featured,
      imageUrls: p.images?.length ? p.images.map(i => i.imageUrl) : [''],
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity, 10),
        sku: formData.sku,
        categoryId: parseInt(formData.categoryId, 10),
        featured: formData.featured,
        imageUrls: formData.imageUrls.filter(u => u.trim() !== ''),
      };

      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
        success('Product updated successfully');
      } else {
        await adminApi.createProduct(payload);
        success('Product created successfully');
      }

      setShowProductModal(false);
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to save product');
    }
  };

  return (
    <div className="container page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Admin Operations Portal</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Store analytics, order fulfillment, and product catalog controls</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalOrders || 0}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Products</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalProducts || 0}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Registered Users</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalUsers || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'orders' ? '2.5px solid var(--primary)' : 'none',
            color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)',
          }}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'products' ? '2.5px solid var(--primary)' : 'none',
            color: activeTab === 'products' ? 'var(--primary)' : 'var(--text-muted)',
          }}
        >
          Product Inventory ({products.length})
        </button>
      </div>

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Order #</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Customer</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Total</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Payment</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                    {o.orderNumber}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontWeight: 600 }}>{o.customerName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customerEmail}</p>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>${o.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-neutral">{o.paymentMethod}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${o.status === 'DELIVERED' ? 'badge-success' : o.status === 'CANCELLED' ? 'badge-danger' : 'badge-primary'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      className="form-select"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={18} /> Add New Product
            </button>
          </div>

          <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Product</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Price</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Stock</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.primaryImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
                        alt=""
                        style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ fontWeight: 600 }}>{p.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>SKU: {p.sku}</p>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{p.category?.name}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${p.stockQuantity > 10 ? 'badge-success' : p.stockQuantity > 0 ? 'badge-warning' : 'badge-danger'}`}>
                        {p.stockQuantity} in stock
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          style={{ color: 'var(--primary)', padding: '4px' }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ color: '#ef4444', padding: '4px' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setShowProductModal(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
          <div className="card" style={{ position: 'relative', width: '90%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', zIndex: 10 }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrls[0] || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrls: [e.target.value] })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
