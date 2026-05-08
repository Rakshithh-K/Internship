import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoFilterOutline, IoCloseOutline } from 'react-icons/io5';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { SORT_OPTIONS } from '../utils/constants';

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const initialFilters = {
    gender: searchParams.get('gender') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    rating: searchParams.get('rating') || '',
    search: searchParams.get('search') || '',
    trending: searchParams.get('trending') || '',
    newArrivals: searchParams.get('newArrivals') || '',
  };

  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance');

  const { products, loading, totalPages, totalItems, params, updateParams, setPage } = useProducts({
    ...filters, sort,
  });

  useEffect(() => {
    updateParams({ ...filters, sort });
  }, [filters, sort]);

  useEffect(() => {
    setFilters({
      gender: searchParams.get('gender') || '',
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      search: searchParams.get('search') || '',
      trending: searchParams.get('trending') || '',
      newArrivals: searchParams.get('newArrivals') || '',
      minPrice: '', maxPrice: '', size: '', color: '', rating: '',
    });
  }, [searchParams]);

  const clearFilters = () => setFilters({ gender: '', category: '', brand: '', minPrice: '', maxPrice: '', size: '', color: '', rating: '', search: '', trending: '', newArrivals: '' });

  const pageTitle = filters.search ? `Results for "${filters.search}"` : filters.gender ? `${filters.gender}'s Fashion` : filters.category ? filters.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : filters.trending ? 'Trending Now' : filters.newArrivals ? 'New Arrivals' : 'All Products';

  return (
    <div className="container-main" style={{ paddingTop: 24, paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{pageTitle}</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 4, fontSize: 14 }}>
          {loading ? 'Loading...' : `${totalItems || products.length} products found`}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Sidebar Filters - Desktop */}
        <div className="filter-sidebar" style={{ width: 280, flexShrink: 0, background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', alignSelf: 'flex-start', position: 'sticky', top: 84, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          <ProductFilters filters={filters} onFilterChange={setFilters} onClearFilters={clearFilters} />
        </div>

        {/* Products Area */}
        <div style={{ flex: 1 }}>
          {/* Sort & Mobile Filter Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button onClick={() => setFiltersOpen(true)} className="mobile-filter-btn"
              style={{ display: 'none', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: 14, fontWeight: 600 }}>
              <IoFilterOutline size={18} /> Filters
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>Sort by:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          <ProductGrid products={products} loading={loading} columns={3} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                    background: params.page === i ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: params.page === i ? '#fff' : 'var(--color-text)',
                    border: '1px solid ' + (params.page === i ? 'var(--color-primary)' : 'var(--color-border)'),
                    fontWeight: 700, fontSize: 14,
                  }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {filtersOpen && (
        <>
          <div className="overlay" onClick={() => setFiltersOpen(false)} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 320, background: 'var(--color-surface)', zIndex: 200, overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Filters</h3>
              <button onClick={() => setFiltersOpen(false)} style={{ background: 'none', color: 'var(--color-text)' }}><IoCloseOutline size={24} /></button>
            </div>
            <ProductFilters filters={filters} onFilterChange={setFilters} onClearFilters={clearFilters} />
            <div style={{ padding: 20 }}>
              <button onClick={() => setFiltersOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>Apply Filters</button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .filter-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductListing;
