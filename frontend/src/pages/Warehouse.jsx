import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Plus, Search, X, Loader2,
  MapPin, Trash2, AlertTriangle
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useWarehouse } from '../hooks/useWarehouse';
import WarehouseTable from '../components/Warehouse/WarehouseTable';
import AddWarehouseModal from '../components/Warehouse/AddWarehouseModal';
import WarehouseDetails from '../components/Warehouse/WarehouseDetails';
import { AnimatePresence } from 'framer-motion';

/* ── Delete Confirm Dialog ─────────────────── */
const DeleteConfirm = ({ warehouse, onConfirm, onCancel, loading }) => (
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
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Delete Warehouse?</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        <strong className="text-slate-700 dark:text-slate-200">{warehouse?.name}</strong> and all its locations will be permanently removed. This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1 !py-2.5">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 px-6 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </motion.div>
  </div>
);

/* ── Main Page ─────────────────────────────── */
const Warehouse = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'inventory_manager';

  const {
    warehouses, isLoading,
    fetchWarehouses, debouncedSearch,
    createWarehouse, updateWarehouse, deleteWarehouse,
  } = useWarehouse();

  const [search, setSearch]             = useState('');
  const [addModal, setAddModal]         = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [viewTarget, setViewTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => { fetchWarehouses(); }, [fetchWarehouses]);

  const handleSearch = useCallback((val) => {
    setSearch(val);
    debouncedSearch(val);
  }, [debouncedSearch]);

  const handleCreate = useCallback(async (data) => {
    await createWarehouse(data);
  }, [createWarehouse]);

  const handleUpdate = useCallback(async (data) => {
    await updateWarehouse(editTarget._id, data);
    setEditTarget(null);
  }, [updateWarehouse, editTarget]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteWarehouse(deleteTarget._id);
      setDeleteTarget(null);
      // if the deleted one is the currently viewed one, close details
      if (viewTarget?._id === deleteTarget._id) setViewTarget(null);
    } finally {
      setDeleting(false);
    }
  }, [deleteWarehouse, deleteTarget, viewTarget]);

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
            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/25 shrink-0">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Warehouse Management</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {isManager ? 'Create, manage, and organise your storage facilities.' : 'View warehouse locations and storage information.'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="auth-input !py-2 pl-9 pr-8 !w-[240px] focus:!w-[300px] transition-all duration-300"
                placeholder="Search warehouses..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => handleSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Add Warehouse (Manager only) */}
            {isManager && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setEditTarget(null); setAddModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/25 transition-all text-sm whitespace-nowrap"
              >
                <Plus size={16} /> Add Warehouse
              </motion.button>
            )}
          </div>
        </div>

        {/* ── Stats Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Warehouses', value: warehouses.length, color: 'from-primary-500 to-violet-600', icon: Building2 },
            { label: 'Total Locations', value: warehouses.reduce((a, w) => a + (w.locationCount || 0), 0), color: 'from-emerald-500 to-teal-600', icon: MapPin },
            { label: 'Active', value: warehouses.length, color: 'from-blue-500 to-cyan-600', icon: Building2 },
            { label: 'Avg. Locations', value: warehouses.length ? Math.round(warehouses.reduce((a, w) => a + (w.locationCount || 0), 0) / warehouses.length) : 0, color: 'from-amber-500 to-orange-600', icon: MapPin },
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

        {/* ── Warehouse Table ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 size={16} className="text-primary-500" /> All Warehouses
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ml-1">
                {warehouses.length}
              </span>
            </h2>
            {search && (
              <p className="text-xs text-slate-500">
                Showing results for <strong>"{search}"</strong>
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 size={32} className="text-primary-500 animate-spin" />
            </div>
          ) : (
            <WarehouseTable
              warehouses={warehouses}
              isManager={isManager}
              onView={(w) => setViewTarget(w)}
              onEdit={(w) => { setEditTarget(w); setAddModal(true); }}
              onDelete={(w) => setDeleteTarget(w)}
            />
          )}
        </div>
      </motion.div>

      {/* ── Modals ── */}

      {/* Add / Edit Warehouse Modal */}
      <AddWarehouseModal
        isOpen={addModal}
        onClose={() => { setAddModal(false); setEditTarget(null); }}
        onSubmit={editTarget ? handleUpdate : handleCreate}
        initialData={editTarget}
      />

      {/* Warehouse Detail Panel */}
      <AnimatePresence>
        {viewTarget && (
          <WarehouseDetails
            warehouse={viewTarget}
            isManager={isManager}
            onEdit={(w) => { setEditTarget(w); setAddModal(true); }}
            onClose={() => setViewTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirm
            warehouse={deleteTarget}
            loading={deleting}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default Warehouse;
