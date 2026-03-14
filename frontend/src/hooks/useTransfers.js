import { useState, useCallback, useRef } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useTransfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [transfer, setTransfer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const debounceRef = useRef(null);

  const fetchTransfers = useCallback(async (search = '', status = '', warehouse = '') => {
    setIsLoading(true);
    try {
      const res = await api.get('/transfers', { params: { search, status, warehouse } });
      setTransfers(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to load transfers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback((search, status, warehouse) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchTransfers(search, status, warehouse), 350);
  }, [fetchTransfers]);

  const fetchTransfer = useCallback(async (id) => {
    setIsDetailLoading(true);
    try {
      const res = await api.get(`/transfers/${id}`);
      setTransfer(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to load transfer');
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const createTransfer = useCallback(async (data) => {
    try {
      const res = await api.post('/transfers', data);
      const created = res.data.data;
      setTransfers(prev => [created, ...prev]);
      toast.success('Transfer created successfully!');
      return created;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create transfer';
      toast.error(msg);
      throw new Error(msg);
    }
  }, []);

  const updateTransfer = useCallback(async (id, data) => {
    try {
      const res = await api.put(`/transfers/${id}`, data);
      const updated = res.data.data;
      setTransfers(prev => prev.map(t => t._id === id ? updated : t));
      if (transfer && transfer._id === id) setTransfer(updated);
      toast.success('Transfer updated successfully!');
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update transfer';
      toast.error(msg);
      throw new Error(msg);
    }
  }, [transfer]);

  const deleteTransfer = useCallback(async (id) => {
    try {
      await api.delete(`/transfers/${id}`);
      setTransfers(prev => prev.filter(t => t._id !== id));
      if (transfer && transfer._id === id) setTransfer(null);
      toast.success('Transfer deleted successfully');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete transfer';
      toast.error(msg);
      throw new Error(msg);
    }
  }, [transfer]);

  const validateTransfer = useCallback(async (id) => {
    try {
      const res = await api.post(`/transfers/validate/${id}`);
      const validated = res.data.data;
      setTransfers(prev => prev.map(t => t._id === id ? validated : t));
      if (transfer && transfer._id === id) setTransfer(validated);
      toast.success('Transfer validated successfully!');
      return validated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to validate transfer';
      toast.error(msg);
      throw new Error(msg);
    }
  }, [transfer]);

  return {
    transfers, transfer,
    isLoading, isDetailLoading,
    fetchTransfers, debouncedFetch, fetchTransfer,
    createTransfer, updateTransfer, deleteTransfer, validateTransfer
  };
};
