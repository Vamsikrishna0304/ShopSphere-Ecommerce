import React from 'react';
import { ShoppingBag, Shield, Truck, RefreshCw, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'white', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
      {/* Trust Badges */}
      <div style={{ borderBottom: '1px solid var(--border-color)', padding: '2.5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Free Express Delivery</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On all orders over $50</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Secure Checkout</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Encrypted & simulated safely</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>30-Day Returns</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hassle-free guarantee</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>24/7 Dedicated Support</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Always here to assist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <ShoppingBag size={22} color="var(--primary)" />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>ShopSphere</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Curated, high-performance electronics, contemporary fashion, and modern home essentials designed for elevated everyday living.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><a href="/products">All Products</a></li>
              <li><a href="/products?categoryId=1">Electronics</a></li>
              <li><a href="/products?categoryId=2">Audio & Gadgets</a></li>
              <li><a href="/products?categoryId=3">Fashion</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Account</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><a href="/orders">Order Tracking</a></li>
              <li><a href="/cart">Shopping Cart</a></li>
              <li><a href="/login">Customer Login</a></li>
              <li><a href="/register">Create Account</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Tech Stack</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Built with Java 21, Spring Boot 3, Spring Security 6, JWT, Spring Data JPA, MySQL 8, React, and Vite.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-light)' }}>
          © {new Date().getFullYear()} ShopSphere E-Commerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
