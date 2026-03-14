import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Hash, Building2, Plus, Pencil, Loader2 } from 'lucide-react';
import { useWarehouse } from '../../hooks/useWarehouse';
import LocationTable from './LocationTable';
import AddLocationModal from './AddLocationModal';

const WarehouseDetails = ({ warehouse: wh, isManager, onEdit, onClose }) => {
  const {
    locations, isDetailLoading,
    fetchWarehouse,
    createLocation, updateLocation, deleteLocation,
  } = useWarehouse();

  const [locModal, setLocModal]     = useState(false);
  const [editLoc, setEditLoc]       = useState(null);

  useEffect(() => {
    if (wh?._id) fetchWarehouse(wh._id);
  }, [wh?._id, fetchWarehouse]);

  const handleAddLoc = async (data) => {
    await createLocation(wh._id, data);
  };

  const handleEditLoc = async (data) => {
    await updateLocation(editLoc._id, data);
    setEditLoc(null);
  };

  const handleDeleteLoc = async (loc) => {
    if (!window.confirm(`Delete location "${loc.name}"?`)) return;
    await deleteLocation(loc._id);
  };

  return (
    <AnimatePresence>
      {wh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.97 }}
            transition={{ type: 'spring', bounce: 0.15 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Gradient header strip */}
            <div className="h-1.5 bg-gradient-to-r from-primary-500 via-violet-500 to-indigo-500 shrink-0" />

            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Building2 size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{wh.name}</h2>
                  <div className="flex items-center flex-wrap gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded font-mono text-xs font-bold">
                      <Hash size={10} />{wh.code}
                    </span>
                    {wh.address && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin size={11} /> {wh.address}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isManager && (
                  <button
                    onClick={() => onEdit(wh)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Info cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Warehouse Code', value: wh.code, mono: true },
                  { label: 'Total Locations', value: locations.length },
                  { label: 'Created', value: new Date(wh.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) },
                ].map(card => (
                  <div key={card.label} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{card.label}</p>
                    <p className={`text-lg font-bold text-slate-900 dark:text-white ${card.mono ? 'font-mono' : ''}`}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Address */}
              {wh.address && (
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Address</p>
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium">{wh.address}</p>
                </div>
              )}

              {/* Locations Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-500" /> Storage Locations
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {locations.length}
                    </span>
                  </h3>
                  {isManager && (
                    <button
                      onClick={() => { setEditLoc(null); setLocModal(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 shadow-sm transition-all active:scale-95"
                    >
                      <Plus size={13} /> Add Location
                    </button>
                  )}
                </div>

                {isDetailLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 size={28} className="text-primary-500 animate-spin" />
                  </div>
                ) : (
                  <LocationTable
                    locations={locations}
                    isManager={isManager}
                    onEdit={(loc) => { setEditLoc(loc); setLocModal(true); }}
                    onDelete={handleDeleteLoc}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Add/Edit Location Modal */}
          <AddLocationModal
            isOpen={locModal}
            onClose={() => { setLocModal(false); setEditLoc(null); }}
            onSubmit={editLoc ? handleEditLoc : handleAddLoc}
            initialData={editLoc}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default WarehouseDetails;
