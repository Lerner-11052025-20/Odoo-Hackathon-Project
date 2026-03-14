import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Hash, Building2, FileText, Calendar, Loader2 } from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value, mono }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={14} className="text-slate-500 dark:text-slate-400" />
    </div>
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
      <p className={`text-slate-900 dark:text-white font-semibold mt-0.5 ${mono ? 'font-mono' : ''}`}>
        {value || <span className="italic text-slate-300 dark:text-slate-600 font-normal">—</span>}
      </p>
    </div>
  </div>
);

const LocationDetails = ({ location, isLoading, onClose, onEdit, isManager }) => {
  return (
    <AnimatePresence>
      {(location || isLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/65 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.97 }}
            transition={{ type: 'spring', bounce: 0.15 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Gradient strip */}
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 shrink-0" />

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 size={32} className="text-emerald-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
                      <MapPin size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{location?.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded font-mono text-xs font-bold">
                          <Hash size={10} /> {location?.code}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Building2 size={11} /> {location?.warehouse?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isManager && (
                      <button
                        onClick={() => onEdit(location)}
                        className="px-3 py-1.5 rounded-xl text-sm font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
                      >
                        Edit
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
                  
                  {/* Info Cards */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Location Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <InfoRow icon={MapPin}    label="Location Name" value={location?.name} />
                        <InfoRow icon={Hash}      label="Code"          value={location?.code} mono />
                        <InfoRow icon={FileText}  label="Description"   value={location?.description} />
                        <InfoRow icon={Calendar}  label="Created"       value={location?.createdAt ? new Date(location.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null} />
                      </div>
                    </div>

                    {/* Warehouse Info */}
                    {location?.warehouse && (
                      <div className="bg-primary-50 dark:bg-primary-900/10 rounded-2xl p-5 border border-primary-100 dark:border-primary-500/20">
                        <h3 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Building2 size={12} /> Warehouse
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <InfoRow icon={Building2} label="Warehouse Name" value={location.warehouse.name} />
                          <InfoRow icon={Hash}      label="Warehouse Code" value={location.warehouse.code} mono />
                          {location.warehouse.address && (
                            <div className="col-span-2">
                              <InfoRow icon={MapPin} label="Address" value={location.warehouse.address} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LocationDetails;
