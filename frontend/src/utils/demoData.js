import { BRANDS, CATEGORIES } from './constants';

const CLOTHING_IMAGES = [
  'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&h=780&fit=crop', // Shirt
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=780&fit=crop', // T-shirt
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=780&fit=crop', // Jeans
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=780&fit=crop', // Dress
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&h=780&fit=crop', // Bag
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=780&fit=crop', // Watch
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=780&fit=crop', // Shoes
  'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&h=780&fit=crop', // Women dress 2
  'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=780&fit=crop', // Denim jacket
  'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=780&fit=crop', // Active wear
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=780&fit=crop', // Sneakers
  'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=780&fit=crop', // Dress 3
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=780&fit=crop', // Leather Jacket
  'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&h=780&fit=crop', // Gym shorts
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=780&fit=crop', // Earrings
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=780&fit=crop', // Puffer jacket
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=780&fit=crop', // Pants
  'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&h=780&fit=crop', // Women Top
  'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=780&fit=crop', // Bag 2
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=780&fit=crop', // Watch 2
];

const NAMES = [
  'Classic Slim Fit Shirt', 'Premium Cotton T-Shirt', 'High Rise Skinny Jeans', 'Floral Wrap Dress', 
  'Leather Crossbody Bag', 'Chronograph Watch', 'Formal Oxford Shoes', 'Silk Embroidered Kurta', 
  'Denim Jacket Vintage', 'Yoga Performance Set', 'Running Sneakers Pro', 'Sequin Party Dress', 
  'Classic Leather Jacket', 'Sports Training Shorts', 'Pearl Drop Earrings', 'Quilted Puffer Jacket', 
  'Chino Stretch Pants', 'Sequin Party Top', 'Canvas Tote Bag', 'Smart Fitness Watch'
];

export const DEMO_PRODUCTS = Array.from({ length: 40 }, (_, i) => {
  const index = i % 20;
  return {
    id: `demo-${i + 1}`,
    name: NAMES[index] + (i >= 20 ? ' V2' : ''),
    brand: BRANDS[i % BRANDS.length],
    price: [2499, 1299, 1999, 3499, 2799, 4999, 5499, 3999, 6999, 1499, 3299, 4499, 2999, 2199, 1799, 5999, 1899, 2599, 1699, 999][index],
    discountedPrice: [1999, 899, 1499, 2799, 1999, 3999, 4499, 2999, 4999, 1099, 2499, 3499, 2299, 1699, 1299, 4499, 1399, 1999, 1199, 699][index],
    discountPercent: [20, 30, 25, 20, 28, 20, 18, 25, 28, 26, 24, 22, 23, 22, 27, 25, 26, 23, 29, 30][index],
    images: [CLOTHING_IMAGES[index], CLOTHING_IMAGES[(index + 1) % 20]],
    ratings: [4.5, 4.2, 4.8, 4.1, 4.6, 4.3, 4.7, 4.4, 4.0, 4.5, 4.2, 4.8, 4.3, 4.6, 4.1, 4.4, 4.7, 4.5, 4.2, 4.8][index],
    reviewCount: [234, 156, 489, 178, 312, 267, 523, 145, 89, 267, 198, 356, 234, 178, 123, 289, 167, 345, 234, 412][index],
    gender: index % 2 === 0 ? 'Men' : 'Women',
    category: CATEGORIES[index % CATEGORIES.length].slug,
    trending: i < 5 || (i >= 20 && i < 25),
    featured: (i >= 5 && i < 10) || (i >= 25 && i < 30),
    description: `Premium quality ${NAMES[index].toLowerCase()} designed for ultimate comfort and style. Made with high-quality materials to ensure durability and a perfect fit for any occasion.`,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy'],
    stock: 50,
  };
});
