import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowForwardOutline, IoFlashOutline, IoTrendingUpOutline, IoStarSharp } from 'react-icons/io5';
import ProductCard from '../components/product/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { productApi } from '../api/productApi';
import { CATEGORIES, BRANDS } from '../utils/constants';

import { DEMO_PRODUCTS } from '../utils/demoData';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flashSaleEnd, setFlashSaleEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set flash sale end time (24 hours from now)
    const end = new Date();
    end.setHours(end.getHours() + 24);
    setFlashSaleEnd(end);

    // Try fetching from API, fallback to demo data
    const fetchData = async () => {
      try {
        const [trendRes, newRes] = await Promise.all([
          productApi.getTrending().catch(() => ({ data: DEMO_PRODUCTS.filter(p => p.trending) })),
          productApi.getNewArrivals().catch(() => ({ data: DEMO_PRODUCTS.slice(10) })),
        ]);
        setTrendingProducts(trendRes.data?.content || trendRes.data || DEMO_PRODUCTS.slice(0, 5));
        setNewArrivals(newRes.data?.content || newRes.data || DEMO_PRODUCTS.slice(10));
      } catch {
        setTrendingProducts(DEMO_PRODUCTS.slice(0, 5));
        setNewArrivals(DEMO_PRODUCTS.slice(10));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Flash sale countdown timer
  useEffect(() => {
    if (!flashSaleEnd) return;
    const timer = setInterval(() => {
      const now = new Date();
      const diff = flashSaleEnd - now;
      if (diff <= 0) { clearInterval(timer); return; }
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [flashSaleEnd]);

  const heroSlides = [
    { title: 'Summer Collection 2026', subtitle: 'Discover the latest trends in fashion', cta: 'Shop Now', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', link: '/products?trending=true' },
    { title: 'Flat 50% Off', subtitle: 'On premium brands this season', cta: 'Explore Deals', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', link: '/products?sort=price_asc' },
    { title: 'Ethnic Elegance', subtitle: 'Traditional wear for every occasion', cta: 'Shop Ethnic', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', link: '/products?category=ethnic-wear' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const TimerBox = ({ value, label }) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, boxShadow: 'var(--shadow-sm)' }}>
        {String(value).padStart(2, '0')}
      </div>
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>{label}</p>
    </div>
  );

  return (
    <div>
      {/* Hero Banner */}
      <section style={{ position: 'relative', overflow: 'hidden', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)' }}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            background: heroSlides[currentSlide].bg,
            minHeight: 520,
            display: 'flex', alignItems: 'center',
            padding: '60px 0',
          }}
        >
          <div className="container-main" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}>
            <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>
              {heroSlides[currentSlide].title}
            </motion.h1>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', maxWidth: 400 }}>
              {heroSlides[currentSlide].subtitle}
            </motion.p>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
              <Link to={heroSlides[currentSlide].link} className="btn" style={{ background: '#fff', color: '#333', fontWeight: 700, padding: '14px 32px', fontSize: 15, gap: 8 }}>
                {heroSlides[currentSlide].cta} <IoArrowForwardOutline size={18} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
        {/* Slide indicators */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 2 }}>
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              style={{ width: i === currentSlide ? 28 : 8, height: 8, borderRadius: 'var(--radius-full)', background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.3s ease' }} />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container-main" style={{ paddingTop: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)' }}>Shop by Category</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>Find your perfect style</p>
          </div>
          <Link to="/products" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
          {CATEGORIES.slice(0, 8).map((cat, i) => (
            <motion.div key={cat.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/products?category=${cat.slug}`} className="card" style={{ padding: 20, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 32 }}>{cat.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="container-main" style={{ paddingTop: 60 }}>
        <div style={{ background: 'linear-gradient(135deg, #FF6B6B, #EE5A24)', borderRadius: 'var(--radius-lg)', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <IoFlashOutline size={36} color="#fff" />
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Flash Sale</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Up to 70% off on selected items</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Ends in:</span>
            <TimerBox value={timeLeft.hours} label="hrs" />
            <span style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>:</span>
            <TimerBox value={timeLeft.minutes} label="min" />
            <span style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>:</span>
            <TimerBox value={timeLeft.seconds} label="sec" />
          </div>
          <Link to="/products?sort=price_asc" className="btn" style={{ background: '#fff', color: '#EE5A24', fontWeight: 700 }}>
            Shop Now <IoArrowForwardOutline />
          </Link>
        </div>
      </section>

      {/* Trending Products */}
      <section className="container-main" style={{ paddingTop: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IoTrendingUpOutline size={28} color="var(--color-primary)" />
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)' }}>Trending Now</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>Most popular this week</p>
            </div>
          </div>
          <Link to="/products?trending=true" className="btn btn-secondary btn-sm">See All</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {loading ? <SkeletonCard count={5} /> : (trendingProducts.length > 0 ? trendingProducts : DEMO_PRODUCTS.slice(0, 5)).map((p, i) => (
            <ProductCard key={p.id || i} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-main" style={{ paddingTop: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)' }}>New Arrivals</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>Just dropped — fresh styles for you</p>
          </div>
          <Link to="/products?newArrivals=true" className="btn btn-secondary btn-sm">Explore</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {loading ? <SkeletonCard count={5} /> : (newArrivals.length > 0 ? newArrivals : DEMO_PRODUCTS.slice(10, 15)).map((p, i) => (
            <ProductCard key={p.id || i} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Featured Brands */}
      <section className="container-main" style={{ paddingTop: 60 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', textAlign: 'center', marginBottom: 8 }}>Featured Brands</h2>
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 32 }}>Shop from the best in the industry</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
          {BRANDS.slice(0, 10).map((brand, i) => (
            <motion.div key={brand} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={`/products?brand=${encodeURIComponent(brand)}`} className="card"
                style={{ padding: '24px 16px', textAlign: 'center', fontWeight: 700, fontSize: 15, letterSpacing: 0.5 }}>
                {brand}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="container-main" style={{ paddingTop: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <motion.div whileHover={{ scale: 1.02 }} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer' }}>
            <Link to="/products?gender=Men">
              <div style={{ background: 'linear-gradient(135deg, #2d3436, #636e72)', padding: '40px 32px', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>Men's Collection</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>Up to 40% off on premium styles</p>
                <span style={{ color: '#fff', fontWeight: 700, marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Shop Now <IoArrowForwardOutline />
                </span>
              </div>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer' }}>
            <Link to="/products?gender=Women">
              <div style={{ background: 'linear-gradient(135deg, #a29bfe, #fd79a8)', padding: '40px 32px', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>Women's Collection</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>New season, new styles — explore now</p>
                <span style={{ color: '#fff', fontWeight: 700, marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Explore <IoArrowForwardOutline />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-main" style={{ paddingTop: 80, paddingBottom: 20 }}>
        <div style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', borderRadius: 'var(--radius-xl)', padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>Stay in Style</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8, marginBottom: 28 }}>Subscribe to get exclusive offers, new arrivals, and style tips.</p>
          <div style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input type="email" placeholder="Enter your email" style={{ flex: 1, minWidth: 200, padding: '14px 20px', borderRadius: 'var(--radius-full)', border: 'none', fontSize: 15, background: 'rgba(255,255,255,0.15)', color: '#fff' }} />
            <button className="btn" style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 700, borderRadius: 'var(--radius-full)', padding: '14px 28px' }}>Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
