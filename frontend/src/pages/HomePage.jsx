import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductCard from '../components/product/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.getFeatured(),
          categoryApi.getAll(),
        ]);
        if (prodRes?.data) setFeaturedProducts(prodRes.data);
        if (catRes?.data) setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          color: 'white',
          padding: '5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '680px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <Sparkles size={16} color="#38bdf8" />
              <span>Next-Generation E-Commerce Experience</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              Elevate Your Daily Lifestyle with Precision.
            </h1>

            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Explore an exclusive selection of studio audio, flagship electronics, contemporary streetwear, and refined home aesthetics.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/products" className="btn btn-primary btn-lg" style={{ backgroundColor: 'white', color: '#1e1b4b', fontWeight: 700 }}>
                Explore Collection <ArrowRight size={18} />
              </Link>
              <Link to="/products?categoryId=1" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
                Flagship Electronics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Curated Collections
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.25rem' }}>
                Shop by Category
              </h2>
            </div>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="card card-hover"
                style={{
                  position: 'relative',
                  height: '180px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'flex-end',
                }}
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.1) 70%)',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 2, padding: '1.25rem', color: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Trending Products */}
      <section style={{ padding: '3rem 0 5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Featured Gear
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.25rem' }}>
                Trending Products
              </h2>
            </div>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>
              See More <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="product-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="card skeleton" style={{ height: '360px' }} />
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
