import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Plus, Search, Layers, LayoutList, X, AlertTriangle, Trash2, Building2, ChevronDown, Loader2 } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useTransfers } from '../hooks/useTransfers';
import TransferTable from '../components/Transfers/TransferTable';
import TransferKanban from '../components/Transfers/TransferKanban';
import TransferForm from '../components/Transfers/TransferForm';
import api from '../utils/api';

/* ── Delete Confirm ─────────────────────── */
const DeleteConfirm = ({ transfer, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel} className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', bounce: 0.25 }}
      className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
    >
      <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Delete Transfer?</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Transfer <strong className="text-slate-700 dark:text-slate-200">{transfer?.reference}</strong> will be permanently removed.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1 !py-2.5">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 px-6 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </motion.div>
  </div>
);

const InternalTransfers = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'inventory_manager';

  const {
    transfers, isLoading,
    fetchTransfers, debouncedFetch,
    createTransfer, updateTransfer, deleteTransfer, validateTransfer
  } = useTransfers();

  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch]     = useState('');
  const [whFilter, setWhFilter] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  
  const [formModal, setFormModal]       = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => {
    fetchTransfers();
    // Fetch warehouses for filter dropdown
    api.get('/warehouses').then(res => setWarehouses(res.data.data)).catch(() => {});
  }, [fetchTransfers]);

  const handleSearch = useCallback((val) => {
    setSearch(val);
    debouncedFetch(val, '', whFilter);
  }, [debouncedFetch, whFilter]);

  const handleWarehouseFilter = useCallback((val) => {
    setWhFilter(val);
    fetchTransfers(search, '', val);
  }, [fetchTransfers, search]);

  const handleCreate = async (data) => { await createTransfer(data); };
  const handleUpdate = async (data) => { await updateTransfer(editTarget._id, data); };
  
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTransfer(deleteTarget._id);
      setDeleteTarget(null);
    } finally { setDeleting(false); }
  };

  const pendingCount = transfers.filter(t => ['Draft', 'Ready', 'In Progress'].includes(t.status)).length;
  const doneCount = transfers.filter(t => t.status === 'Done').length;

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
              <ArrowRightLeft size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Internal Transfers</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Move stock between warehouses and locations.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold px-3 ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <LayoutList size={14} /> List
              </button>
              <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold px-3 ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <Layers size={14} /> Kanban
              </button>
            </div>

            {/* Filter */}
            <div className="relative">
              <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select className="auth-input !py-2 pl-9 pr-8 !w-auto min-w-[160px] text-sm appearance-none cursor-pointer" value={whFilter} onChange={e => handleWarehouseFilter(e.target.value)}>
                <option value="">All Warehouses</option>
                {warehouses.map(w => <option key={w._id} value={w.name}>{w.name}</option>)}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="auth-input !py-2 pl-9 pr-8 !w-[180px] focus:!w-[240px] transition-all duration-300 text-sm" placeholder="Search..." value={search} onChange={e => handleSearch(e.target.value)} />
              {search && <button onClick={() => handleSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={12} /></button>}
            </div>

            {/* Manager Create */}
            {isManager && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => { setEditTarget(null); setFormModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-500/25 transition-all text-sm whitespace-nowrap">
                <Plus size={16} /> New Transfer
              </motion.button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Transfers', value: transfers.length, color: 'from-slate-500 to-slate-600' },
            { label: 'Pending Processing', value: pendingCount, color: 'from-amber-500 to-orange-600' },
            { label: 'Completed Moves', value: doneCount, color: 'from-emerald-500 to-teal-600' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
               <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-10 blur-xl`} />
               <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px]">
          {isLoading ? (
            <div className="flex justify-center items-center py-32"><Loader2 size={32} className="text-indigo-500 animate-spin" /></div>
          ) : viewMode === 'list' ? (
            <TransferTable 
              transfers={transfers} isManager={isManager} 
              onView={(tr) => { setEditTarget(tr); setFormModal(true); /* Simplified: view opens edit modal for now, or just read-only if staff */ }} 
              onEdit={(tr) => { setEditTarget(tr); setFormModal(true); }} 
              onDelete={(tr) => setDeleteTarget(tr)} 
              onValidate={(tr) => validateTransfer(tr._id)}
            />
          ) : (
            <div className="p-6">
              <TransferKanban 
                transfers={transfers} isManager={isManager} 
                onValidate={(id) => validateTransfer(id)} 
                onUpdateStatus={(id, status) => {
                  if (status === 'Done') validateTransfer(id);
                  else updateTransfer(id, { status });
                }}
              />
            </div>
          )}
        </div>

      </motion.div>

      {/* Modals */}
      <TransferForm 
        isOpen={formModal} 
        onClose={() => { setFormModal(false); setEditTarget(null); }} 
        onSubmit={editTarget ? handleUpdate : handleCreate} 
        isEdit={!!editTarget}
        initialData={editTarget} 
      />

      <AnimatePresence>
        {deleteTarget && <DeleteConfirm transfer={deleteTarget} loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      </AnimatePresence>

    </MainLayout>
  );
};

export default InternalTransfers;
