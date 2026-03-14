import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useOperations = (endpoint) => {
  const [operations, setOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOperations = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/${endpoint}`);
      setOperations(data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error('Failed to load operations');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  const createOperation = async (operationData) => {
    try {
      const { data } = await api.post(`/${endpoint}`, operationData);
      setOperations([data.data, ...operations]);
      toast.success('Operation created successfully');
      return data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create operation');
      throw err;
    }
  };

  const updateOperation = async (id, operationData) => {
    try {
      const { data } = await api.put(`/${endpoint}/${id}`, operationData);
      setOperations(operations.map(op => op._id === id ? data.data : op));
      toast.success('Operation updated successfully');
      return data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update operation');
      throw err;
    }
  };

  const validateOperation = async (id) => {
    try {
      const { data } = await api.post(`/${endpoint}/validate/${id}`);
      setOperations(operations.map(op => op._id === id ? data.data : op));
      toast.success('Operation validated successfully! Stock updated.');
      return data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to validate operation');
      throw err;
    }
  };

  const deleteOperation = async (id) => {
    try {
      await api.delete(`/${endpoint}/${id}`);
      setOperations(operations.filter(op => op._id !== id));
      toast.success('Operation deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete operation');
      throw err;
    }
  };

  return {
    operations,
    isLoading,
    error,
    fetchOperations,
    createOperation,
    updateOperation,
    validateOperation,
    deleteOperation
  };
};
