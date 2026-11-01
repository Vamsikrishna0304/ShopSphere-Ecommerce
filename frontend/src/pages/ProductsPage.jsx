import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, Search } from 'lucide-react';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/common/Pagination';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters state from query parameters or default
  const categoryId = searchParams.get('categoryId') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'id';
  const direction = searchParams.get('direction') || 'desc';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await categoryApi.getAll();
        if (res?.data) setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await productApi.getAll({
          categoryId: categoryId || undefined,
          search: search || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sortBy,
          direction,
          page,
          size: 12,
        });

        if (res?.data) {
          setProducts(res.data.content);
          setTotalPages(res.data.totalPages);
          setTotalElements(res.data.totalElements);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId, search, minPrice, maxPrice, sortBy, direction, page]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== null && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '0'); // Reset to first page
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="page-wrapper container">
      {/* Top Header / Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Explore Catalog</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing {totalElements} {totalElements === 1 ? 'product' : 'products'}
            {search && ` matching "${search}"`}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn btn-secondary btn-sm mobile-menu-btn"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <Filter size={16} /> Filters
          </button>

          {/* Sort By Dropdown */}
          <select
            className="form-select"
            value={`${sortBy}-${direction}`}
            onChange={(e) => {
              const [s, d] = e.target.value.split('-');
              const newParams = new URLSearchParams(searchParams);
              newParams.set('sortBy', s);
              newParams.set('direction', d);
              newParams.set('page', '0');
              setSearchParams(newParams);
            }}
            style={{ padding: '0.55rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 600, width: 'auto' }}
          >
            <option value="id-desc">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="ratingAvg-desc">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="catalog-layout">
        {/* Filters Sidebar */}
        <aside className={`card filters-sidebar ${mobileFilterOpen ? 'active' : ''}`} style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} /> Filters
            </h3>
            <button
              onClick={handleClearFilters}
              style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Category
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                onClick={() => updateParam('categoryId', '')}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: !categoryId ? 700 : 500,
                  backgroundColor: !categoryId ? 'var(--primary-light)' : 'transparent',
                  color: !categoryId ? 'var(--primary)' : 'var(--text-main)',
                }}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateParam('categoryId', c.id.toString())}
                  style={{
                    textAlign: 'left',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: categoryId === c.id.toString() ? 700 : 500,
                    backgroundColor: categoryId === c.id.toString() ? 'var(--primary-light)' : 'transparent',
                    color: categoryId === c.id.toString() ? 'var(--primary)' : 'var(--text-main)',
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Price Range ($)
            </h4>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min"
                className="form-input"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input
                type="number"
                placeholder="Max"
                className="form-input"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {mobileFilterOpen && (
            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: '1.5rem' }}
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters
            </button>
          )}
        </aside>

        {/* Product Catalog Grid */}
        <section>
          {loading ? (
            <div className="product-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="card skeleton" style={{ height: '360px' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Search size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>
                We couldn't find any products matching your selected filters.
              </p>
              <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => updateParam('page', p.toString())}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
