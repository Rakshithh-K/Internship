import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute, AdminRoute } from './PrivateRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ProductListing from '../pages/ProductListing';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFailure from '../pages/PaymentFailure';
import Profile from '../pages/Profile';
import OrderHistory from '../pages/OrderHistory';
import NotFound from '../pages/NotFound';
import AdminDashboard from '../pages/admin/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/products" element={<ProductListing />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />

      {/* Protected Routes */}
      <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
      <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
      <Route path="/payment-failure" element={<PrivateRoute><PaymentFailure /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><Navigate to="/admin" replace /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><Navigate to="/admin" replace /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><Navigate to="/admin" replace /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
