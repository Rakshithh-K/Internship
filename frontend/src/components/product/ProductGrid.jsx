import ProductCard from './ProductCard';
import SkeletonCard from '../common/SkeletonCard';

const ProductGrid = ({ products, loading, columns = 4 }) => {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 20,
      }}>
        <SkeletonCard count={columns * 2} />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>😕</p>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No products found</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 20,
    }}>
      {products.map((product, index) => (
        <ProductCard key={product.id || product._id || index} product={product} index={index} />
      ))}
      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid"] { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          div[style*="grid"] { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductGrid;
