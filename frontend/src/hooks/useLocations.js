import { useState, useCallback, useRef } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useLocations = () => {
  const [locations,    setLocations]    = useState([]);
  const [location,     setLocation]     = useState(null);
  const [warehouses,   setWarehouses]   = useState([]);
  const [isLoading,    setIsLoading]    = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const debounceRef = useRef(null);

  /* ── Warehouses (for dropdown) ── */
  const fetchWarehouses = useCallback(async () => {
    try {
      const res = await api.get('/warehouses');
      setWarehouses(res.data.data);
    } catch {
      toast.error('Failed to load warehouses');
    }
  }, []);

  /* ── Location List ── */
  const fetchLocations = useCallback(async (search = '', warehouseId = '') => {
    setIsLoading(true);
    try {
      const res = await api.get('/locations', { params: { search, warehouse: warehouseId } });
      setLocations(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback((search, warehouseId) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchLocations(search, warehouseId), 350);
  }, [fetchLocations]);

  /* ── Single Location ── */
  const fetchLocation = useCallback(async (id) => {
    setIsDetailLoading(true);
    try {
      const res = await api.get(`/locations/${id}`);
      setLocation(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load location');
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  /* ── CRUD ── */
  const createLocation = useCallback(async (data) => {
    const res = await api.post('/locations', data);
    const created = res.data.data;
    setLocations(prev => [created, ...prev]);
    toast.success('Location created!');
    return created;
  }, []);

  const updateLocation = useCallback(async (id, data) => {
    const res = await api.put(`/locations/${id}`, data);
    const updated = res.data.data;
    setLocations(prev => prev.map(l => l._id === id ? updated : l));
    setLocation(updated);
    toast.success('Location updated!');
    return updated;
  }, []);

  const deleteLocation = useCallback(async (id) => {
    await api.delete(`/locations/${id}`);
    setLocations(prev => prev.filter(l => l._id !== id));
    toast.success('Location deleted.');
  }, []);

  return {
    locations, location, warehouses,
    isLoading, isDetailLoading,
    fetchLocations, debouncedFetch,
    fetchWarehouses, fetchLocation,
    createLocation, updateLocation, deleteLocation,
  };
};
