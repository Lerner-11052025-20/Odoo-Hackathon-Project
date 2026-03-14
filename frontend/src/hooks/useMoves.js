import { useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export const useMoves = () => {
  const [moves, setMoves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    warehouse: ''
  });

  const fetchMoves = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.warehouse) params.append('warehouse', filters.warehouse);

      const res = await api.get(`/moves?${params.toString()}`);
      setMoves(res.data.data);
    } catch (error) {
      toast.error('Failed to load move history');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMoves();
  }, [fetchMoves]);

  return {
    moves,
    isLoading,
    filters,
    setFilters,
    refresh: fetchMoves
  };
};
