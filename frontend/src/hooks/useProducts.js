import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../api/productApi';
import { CATEGORIES, BRANDS } from '../utils/constants';

import { DEMO_PRODUCTS } from '../utils/demoData';

/**
 * Custom hook for fetching products with filters, sorting, and pagination.
 */
export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [params, setParams] = useState({
    page: 0,
    limit: 12,
    ...initialParams,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const cleanParams = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val !== '' && val !== null && val !== undefined) {
        cleanParams[key] = val;
      }
    });
    
    try {
      const res = await productApi.getProducts(cleanParams);
      const data = res.data;
      setProducts(data.content || data.products || data || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalElements || data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Using offline demo mode');
      
      // Fallback local filtering logic
      let filtered = [...DEMO_PRODUCTS];
      if (cleanParams.category) filtered = filtered.filter(p => p.category === cleanParams.category);
      if (cleanParams.gender) filtered = filtered.filter(p => p.gender === cleanParams.gender);
      if (cleanParams.brand) filtered = filtered.filter(p => p.brand === cleanParams.brand);
      if (cleanParams.minPrice) filtered = filtered.filter(p => (p.discountedPrice || p.price) >= cleanParams.minPrice);
      if (cleanParams.maxPrice) filtered = filtered.filter(p => (p.discountedPrice || p.price) <= cleanParams.maxPrice);
      if (cleanParams.rating) filtered = filtered.filter(p => p.ratings >= cleanParams.rating);
      if (cleanParams.search) filtered = filtered.filter(p => p.name.toLowerCase().includes(cleanParams.search.toLowerCase()) || p.brand.toLowerCase().includes(cleanParams.search.toLowerCase()));
      if (cleanParams.trending) filtered = filtered.filter(p => p.trending);
      
      // Sort
      if (cleanParams.sort === 'price_asc') filtered.sort((a,b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
      else if (cleanParams.sort === 'price_desc') filtered.sort((a,b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
      else if (cleanParams.sort === 'rating') filtered.sort((a,b) => b.ratings - a.ratings);
      else if (cleanParams.sort === 'popularity') filtered.sort((a,b) => b.reviewCount - a.reviewCount);
      
      // Pagination
      const page = cleanParams.page || 0;
      const limit = cleanParams.limit || 12;
      const start = page * limit;
      
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / limit));
      setProducts(filtered.slice(start, start + limit));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 0 }));
  }, []);

  const setPage = useCallback((page) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  return {
    products,
    loading,
    error,
    totalPages,
    totalItems,
    params,
    updateParams,
    setPage,
    refetch: fetchProducts,
  };
};
