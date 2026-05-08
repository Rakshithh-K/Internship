import { useState } from 'react';
import { IoChevronDownOutline, IoChevronUpOutline, IoCloseCircle } from 'react-icons/io5';
import { CATEGORIES, BRANDS, COLORS, SIZES, GENDERS } from '../../utils/constants';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-text)', padding: '4px 0', marginBottom: open ? 12 : 0 }}>
        {title} {open ? <IoChevronUpOutline size={14} /> : <IoChevronDownOutline size={14} />}
      </button>
      {open && children}
    </div>
  );
};

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

  const setFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const chk = { width: 16, height: 16, accentColor: 'var(--color-primary)', cursor: 'pointer' };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800 }}>Filters</h3>
        {activeFilterCount > 0 && (
          <button onClick={onClearFilters} style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600, background: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <IoCloseCircle size={16} /> Clear All
          </button>
        )}
      </div>

      <FilterSection title="Gender">
        {GENDERS.map(g => (
          <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 14, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
            <input type="radio" name="gender" checked={filters.gender === g} onChange={() => setFilter('gender', filters.gender === g ? '' : g)} style={chk} /> {g}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Category">
        <div style={{ maxHeight: 240, overflowY: 'auto' }}>
          {CATEGORIES.map(cat => (
            <label key={cat.slug} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 14, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
              <input type="radio" name="category" checked={filters.category === cat.slug} onChange={() => setFilter('category', filters.category === cat.slug ? '' : cat.slug)} style={chk} /> {cat.name}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand" defaultOpen={false}>
        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
          {BRANDS.map(brand => (
            <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 14, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
              <input type="checkbox" checked={filters.brand === brand} onChange={() => setFilter('brand', filters.brand === brand ? '' : brand)} style={chk} /> {brand}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={e => setFilter('minPrice', e.target.value)} className="input-field" style={{ padding: '8px 12px', fontSize: 13 }} />
          <span style={{ color: 'var(--color-text-muted)' }}>—</span>
          <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={e => setFilter('maxPrice', e.target.value)} className="input-field" style={{ padding: '8px 12px', fontSize: 13 }} />
        </div>
      </FilterSection>

      <FilterSection title="Size" defaultOpen={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SIZES.map(size => (
            <button key={size} onClick={() => setFilter('size', filters.size === size ? '' : size)}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600,
                background: filters.size === size ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                color: filters.size === size ? '#fff' : 'var(--color-text-secondary)',
                border: '1px solid ' + (filters.size === size ? 'var(--color-primary)' : 'var(--color-border)'),
                transition: 'all var(--transition-fast)',
              }}>
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Color" defaultOpen={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {COLORS.slice(0, 10).map(color => (
            <button key={color.name} onClick={() => setFilter('color', filters.color === color.name ? '' : color.name)} title={color.name}
              style={{
                width: 30, height: 30, borderRadius: '50%', background: color.hex,
                border: filters.color === color.name ? '3px solid var(--color-primary)' : '2px solid var(--color-border)',
                cursor: 'pointer', transition: 'all var(--transition-fast)',
              }} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating" defaultOpen={false}>
        {[4, 3, 2, 1].map(r => (
          <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 14, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
            <input type="radio" name="rating" checked={filters.rating == r} onChange={() => setFilter('rating', filters.rating == r ? '' : r)} style={chk} />
            {'★'.repeat(r)}{'☆'.repeat(5 - r)} & above
          </label>
        ))}
      </FilterSection>
    </div>
  );
};

export default ProductFilters;
