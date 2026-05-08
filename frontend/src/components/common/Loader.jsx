import { motion } from 'framer-motion';

const Loader = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: { width: 24, border: 3 },
    md: { width: 40, border: 4 },
    lg: { width: 60, border: 5 },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 40 }}>
      <motion.div
        style={{
          width: s.width,
          height: s.width,
          border: `${s.border}px solid var(--color-border)`,
          borderTop: `${s.border}px solid var(--color-primary)`,
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 500 }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
