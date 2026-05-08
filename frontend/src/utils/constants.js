// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Product categories
export const CATEGORIES = [
  { name: 'Top Wear', slug: 'top-wear', icon: '👕' },
  { name: 'Bottom Wear', slug: 'bottom-wear', icon: '👖' },
  { name: 'Sports Wear', slug: 'sports-wear', icon: '🏃' },
  { name: 'Ethnic Wear', slug: 'ethnic-wear', icon: '🥻' },
  { name: 'Winter Wear', slug: 'winter-wear', icon: '🧥' },
  { name: 'Footwear', slug: 'footwear', icon: '👟' },
  { name: 'Accessories', slug: 'accessories', icon: '🕶️' },
  { name: 'Watches', slug: 'watches', icon: '⌚' },
  { name: 'Bags', slug: 'bags', icon: '👜' },
  { name: 'Gym Wear', slug: 'gym-wear', icon: '💪' },
  { name: 'Casual Wear', slug: 'casual-wear', icon: '👔' },
  { name: 'Formal Wear', slug: 'formal-wear', icon: '🤵' },
  { name: 'Party Wear', slug: 'party-wear', icon: '🎉' },
  { name: 'Inner Wear', slug: 'inner-wear', icon: '🩲' },
];

// Gender options
export const GENDERS = ['Men', 'Women', 'Unisex'];

// Sizes
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
export const SHOE_SIZES = ['6', '7', '8', '9', '10', '11', '12'];

// Colors
export const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1B1F3B' },
  { name: 'Red', hex: '#E74C3C' },
  { name: 'Blue', hex: '#3498DB' },
  { name: 'Green', hex: '#27AE60' },
  { name: 'Pink', hex: '#FD79A8' },
  { name: 'Yellow', hex: '#F1C40F' },
  { name: 'Grey', hex: '#95A5A6' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Purple', hex: '#6C5CE7' },
  { name: 'Orange', hex: '#E67E22' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Teal', hex: '#008080' },
];

// Sort options
export const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'New Arrivals', value: 'newest' },
  { label: 'Rating', value: 'rating' },
];

// Order statuses
export const ORDER_STATUSES = {
  PROCESSING: { label: 'Processing', color: '#FDCB6E' },
  SHIPPED: { label: 'Shipped', color: '#74B9FF' },
  DELIVERED: { label: 'Delivered', color: '#00B894' },
  CANCELLED: { label: 'Cancelled', color: '#FF6B6B' },
};

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'credit_card', name: 'Credit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
  { id: 'debit_card', name: 'Debit Card', icon: '💳', desc: 'Visa, Mastercard, Rupay' },
  { id: 'net_banking', name: 'Net Banking', icon: '🏦', desc: 'All major banks' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
];

// Demo coupons
export const DEMO_COUPONS = {
  FLAT10: { discount: 10, type: 'percentage', minOrder: 999, description: '10% off on orders above ₹999' },
  STYLE20: { discount: 20, type: 'percentage', minOrder: 1999, description: '20% off on orders above ₹1,999' },
  SAVE500: { discount: 500, type: 'flat', minOrder: 2999, description: '₹500 off on orders above ₹2,999' },
  FIRST50: { discount: 50, type: 'percentage', minOrder: 499, description: '50% off on your first order' },
  WELCOME: { discount: 200, type: 'flat', minOrder: 799, description: '₹200 off - Welcome offer' },
};

// Brands
export const BRANDS = [
  'Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Levi\'s',
  'Allen Solly', 'Peter England', 'Van Heusen', 'Raymond',
  'UCB', 'Roadster', 'HRX', 'Wrogn', 'Campus Sutra',
  'Mango', 'Forever 21', 'FabIndia', 'W', 'Biba',
];
