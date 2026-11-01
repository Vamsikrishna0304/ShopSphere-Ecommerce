import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, ShieldCheck, Menu, X, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart, setIsDrawerOpen } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: 'var(--shadow-sm)' }}>
            <ShoppingBag size={22} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Shop<span style={{ color: 'var(--primary)' }}>Sphere</span>
          </span>
        </Link>

        {/* Global Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="search-bar-wrapper">
          <input
            type="text"
            className="form-input"
            placeholder="Search electronics, fashion, lifestyle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-main)' }}
          />
          <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        </form>

        {/* Desktop Nav Links & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.95rem', fontWeight: 600 }}>
            <Link to="/products" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary)')} onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
              Explore
            </Link>
            {isAdmin && (
              <Link to="/admin" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={16} /> Admin Portal
              </Link>
            )}
          </nav>

          {/* Cart Icon & Badge */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            style={{ position: 'relative', padding: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
            aria-label="View Cart"
          >
            <ShoppingBag size={22} />
            {cart.totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 2px white',
                }}
              >
                {cart.totalItems}
              </span>
            )}
          </button>

          {/* User Auth Menu */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--border-light)' }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  {user.firstName[0]}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.firstName}</span>
              </button>

              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '200px',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 0',
                    zIndex: 100,
                  }}
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-light)', marginBottom: '4px' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.firstName} {user.lastName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                  <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <Package size={16} /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
                      <ShieldCheck size={16} /> Admin Portal
                    </Link>
                  )}
                  <button
                    onClick={() => logout(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 16px', fontSize: '0.9rem', color: '#ef4444', textAlign: 'left' }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <User size={16} /> Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--text-main)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'white', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="form-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>All Products</Link>
          {isAuthenticated && (
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>My Orders</Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--primary)' }}>Admin Dashboard</Link>
          )}
        </div>
      )}
    </header>
  );
}
