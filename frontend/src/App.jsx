import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ flex: 1 }}>
                  <AppRoutes />
                </main>
                <Footer />
                <MobileNav />
              </div>
              <Toaster
                position="bottom-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    fontWeight: 600,
                    fontSize: 14,
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
