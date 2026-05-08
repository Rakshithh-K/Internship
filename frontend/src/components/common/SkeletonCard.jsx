const SkeletonCard = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ overflow: 'hidden' }}>
          <div className="skeleton" style={{ width: '100%', height: 280, borderRadius: 0 }} />
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="skeleton" style={{ width: '60%', height: 14 }} />
            <div className="skeleton" style={{ width: '90%', height: 16 }} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="skeleton" style={{ width: 70, height: 18 }} />
              <div className="skeleton" style={{ width: 50, height: 14 }} />
              <div className="skeleton" style={{ width: 40, height: 14 }} />
            </div>
            <div className="skeleton" style={{ width: '40%', height: 12 }} />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
