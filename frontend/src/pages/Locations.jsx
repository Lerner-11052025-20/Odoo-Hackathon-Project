import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Plus, Search, X, Loader2,
  Building2, MapPin, AlertTriangle, Trash2, ChevronDown
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useLocations } from '../hooks/useLocations';
import LocationTable from '../components/Location/LocationTable';
import LocationFormModal from '../components/Location/LocationFormModal';
import LocationDetails from '../components/Location/LocationDetails';

/* ── Delete Confirm ─────────────────────── */
const DeleteConfirm = ({ location, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
      className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', bounce: 0.25 }}
      className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
    >
      <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Delete Location?</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        <strong className="text-slate-700 dark:text-slate-200">{location?.name}</strong> will be permanently removed.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1 !py-2.5">Cancel</button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 px-6 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </motion.div>
  </div>
);

/* ── Main Page ───────────────────────────── */
const Locations = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'inventory_manager';

  const {
    locations, location, warehouses,
    isLoading, isDetailLoading,
    fetchLocations, debouncedFetch,
    fetchWarehouses, fetchLocation,
    createLocation, updateLocation, deleteLocation,
  } = useLocations();

  const [search,        setSearch]        = useState('');
  const [whFilter,      setWhFilter]      = useState('');
  const [formModal,     setFormModal]     = useState(false);
  const [editTarget,    setEditTarget]    = useState(null);
  const [viewId,        setViewId]        = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleting,      setDeleting]      = useState(false);

  /* Initial data fetch */
  useEffect(() => {
    fetchWarehouses();
    fetchLocations();
  }, [fetchWarehouses, fetchLocations]);

  /* Fetch detail whenever viewId changes */
  useEffect(() => {
    if (viewId) fetchLocation(viewId);
  }, [viewId, fetchLocation]);

  const handleSearchChange = useCallback((val) => {
    setSearch(val);
    debouncedFetch(val, whFilter);
  }, [debouncedFetch, whFilter]);

  const handleWarehouseFilter = useCallback((val) => {
    setWhFilter(val);
    fetchLocations(search, val);
  }, [fetchLocations, search]);

  const handleCreate = useCallback(async (data) => {
    await createLocation(data);
  }, [createLocation]);

  const handleUpdate = useCallback(async (data) => {
    await updateLocation(editTarget._id, data);
    setEditTarget(null);
    if (viewId === editTarget._id) fetchLocation(editTarget._id);
  }, [updateLocation, editTarget, viewId, fetchLocation]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLocation(deleteTarget._id);
      if (viewId === deleteTarget._id) setViewId(null);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }, [deleteLocation, deleteTarget, viewId]);

  /* Stat counts */
  const uniqueWarehouses = new Set(locations.map(l => l.warehouse?._id)).size;

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-[1600px] mx-auto space-y-6"
      >
        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
              <Layers size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Location Management</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {isManager
                  ? 'Manage all storage areas across your warehouses.'
                  : 'Browse storage locations across facilities.'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="auth-input !py-2 pl-9 pr-8 !w-[200px] focus:!w-[260px] transition-all duration-300"
                placeholder="Search locations…"
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
              />
              {search && (
                <button onClick={() => handleSearchChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Warehouse filter */}
            <div className="relative">
              <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                className="auth-input !py-2 pl-9 pr-8 !w-auto min-w-[180px] appearance-none cursor-pointer"
                value={whFilter}
                onChange={e => handleWarehouseFilter(e.target.value)}
              >
                <option value="">All Warehouses</option>
                {warehouses.map(wh => (
                  <option key={wh._id} value={wh._id}>{wh.name} ({wh.code})</option>
                ))}
              </select>
            </div>

            {/* Add button (Manager only) */}
            {isManager && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setEditTarget(null); setFormModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-500/25 transition-all text-sm whitespace-nowrap"
              >
                <Plus size={16} /> Add Location
              </motion.button>
            )}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Locations',  value: locations.length,   color: 'from-emerald-500 to-teal-600',   icon: MapPin },
            { label: 'Warehouses Used',  value: uniqueWarehouses,   color: 'from-primary-500 to-violet-600', icon: Building2 },
            { label: 'Active Locations', value: locations.length,   color: 'from-blue-500 to-cyan-600',      icon: Layers },
            { label: 'Avg per Warehouse',value: uniqueWarehouses ? Math.round(locations.length / uniqueWarehouses) : 0, color: 'from-amber-500 to-orange-600', icon: MapPin },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden"
            >
              <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-10 blur-xl`} />
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow mb-3`}>
                <s.icon size={16} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={16} className="text-emerald-500" /> All Locations
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ml-1">
                {locations.length}
              </span>
            </h2>
            {(search || whFilter) && (
              <button
                onClick={() => { handleSearchChange(''); handleWarehouseFilter(''); }}
                className="text-xs text-slate-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 size={32} className="text-emerald-500 animate-spin" />
            </div>
          ) : (
            <LocationTable
              locations={locations}
              isManager={isManager}
              onView={loc  => setViewId(loc._id)}
              onEdit={loc  => { setEditTarget(loc); setFormModal(true); }}
              onDelete={loc => setDeleteTarget(loc)}
            />
          )}
        </div>
      </motion.div>

      {/* ── Modals ── */}

      <LocationFormModal
        isOpen={formModal}
        onClose={() => { setFormModal(false); setEditTarget(null); }}
        onSubmit={editTarget ? handleUpdate : handleCreate}
        initialData={editTarget}
        warehouses={warehouses}
      />

      <AnimatePresence>
        {viewId && (
          <LocationDetails
            location={location}
            isLoading={isDetailLoading}
            isManager={isManager}
            onClose={() => setViewId(null)}
            onEdit={loc => { setViewId(null); setEditTarget(loc); setFormModal(true); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirm
            location={deleteTarget}
            loading={deleting}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default Locations;
