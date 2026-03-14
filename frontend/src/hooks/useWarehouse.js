import { useState, useCallback, useRef } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useWarehouse = () => {
  const [warehouses, setWarehouses]     = useState([]);
  const [warehouse, setWarehouse]       = useState(null);
  const [locations, setLocations]       = useState([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const debounceRef = useRef(null);

  /* ── Warehouse List ── */
  const fetchWarehouses = useCallback(async (search = '') => {
    setIsLoading(true);
    try {
      const res = await api.get('/warehouses', { params: { search } });
      setWarehouses(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load warehouses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((value) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchWarehouses(value), 350);
  }, [fetchWarehouses]);

  /* ── Warehouse Detail ── */
  const fetchWarehouse = useCallback(async (id) => {
    setIsDetailLoading(true);
    try {
      const res = await api.get(`/warehouses/${id}`);
      const { locations: locs, ...wh } = res.data.data;
      setWarehouse(wh);
      setLocations(locs || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load warehouse');
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  /* ── Warehouse CRUD ── */
  const createWarehouse = useCallback(async (data) => {
    const res = await api.post('/warehouses', data);
    const created = res.data.data;
    setWarehouses(prev => [created, ...prev]);
    toast.success('Warehouse created!');
    return created;
  }, []);

  const updateWarehouse = useCallback(async (id, data) => {
    const res = await api.put(`/warehouses/${id}`, data);
    const updated = res.data.data;
    setWarehouses(prev => prev.map(w => w._id === id ? updated : w));
    setWarehouse(updated);
    toast.success('Warehouse updated!');
    return updated;
  }, []);

  const deleteWarehouse = useCallback(async (id) => {
    await api.delete(`/warehouses/${id}`);
    setWarehouses(prev => prev.filter(w => w._id !== id));
    toast.success('Warehouse deleted.');
  }, []);

  /* ── Location CRUD ── */
  const createLocation = useCallback(async (warehouseId, data) => {
    const res = await api.post(`/warehouses/${warehouseId}/locations`, data);
    const created = res.data.data;
    setLocations(prev => [created, ...prev]);
    toast.success('Location added!');
    return created;
  }, []);

  const updateLocation = useCallback(async (locationId, data) => {
    const res = await api.put(`/warehouses/locations/${locationId}`, data);
    const updated = res.data.data;
    setLocations(prev => prev.map(l => l._id === locationId ? updated : l));
    toast.success('Location updated!');
    return updated;
  }, []);

  const deleteLocation = useCallback(async (locationId) => {
    await api.delete(`/warehouses/locations/${locationId}`);
    setLocations(prev => prev.filter(l => l._id !== locationId));
    toast.success('Location removed.');
  }, []);

  return {
    warehouses, warehouse, locations,
    isLoading, isDetailLoading,
    fetchWarehouses, debouncedSearch,
    fetchWarehouse,
    createWarehouse, updateWarehouse, deleteWarehouse,
    createLocation, updateLocation, deleteLocation,
  };
};
