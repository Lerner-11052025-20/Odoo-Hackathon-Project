import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const res = await api.get('/products');
      setProducts(res.data.data);
    } catch (error) {
      setIsError(true);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create product
  const createProduct = async (productData) => {
    try {
      const res = await api.post('/products', productData);
      setProducts((prev) => [res.data.data, ...prev]);
      toast.success('Product created successfully');
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
      return { success: false, error };
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      const res = await api.put(`/products/${id}`, productData);
      setProducts((prev) => prev.map((p) => (p._id === id ? res.data.data : p)));
      toast.success('Product updated successfully');
      return { success: true, data: res.data.data };
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
      return { success: false, error };
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
      return { success: false, error };
    }
  };

  return {
    products,
    isLoading,
    isError,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
