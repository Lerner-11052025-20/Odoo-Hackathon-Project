import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Hash, FileText, Building2, ChevronDown } from 'lucide-react';

const INITIAL = { name: '', code: '', warehouse: '', description: '' };

const LocationFormModal = ({ isOpen, onClose, onSubmit, initialData = null, warehouses = [] }) => {
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? {
        name:        initialData.name        || '',
        code:        initialData.code        || '',
        warehouse:   initialData.warehouse?._id || initialData.warehouse || '',
        description: initialData.description || '',
      } : INITIAL);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())      e.name      = 'Location name is required.';
    if (!form.code.trim())      e.code      = 'Location code is required.';
    else if (!/^[A-Z0-9\-_]{1,10}$/i.test(form.code.trim())) e.code = 'Code: 1–10 alphanumeric characters.';
    if (!form.warehouse)        e.warehouse = 'Please select a warehouse.';
    return e;
  };

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit({ ...form, code: form.code.toUpperCase().trim() });
      onClose();
    } catch (err) {
      setErrors({ global: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 18 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800"
          >
            {/* Gradient strip */}
            <div className="h-1 rounded-t-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                    {isEdit ? 'Edit Location' : 'Add Location'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isEdit ? 'Update storage location details' : 'Create a new storage location'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errors.global && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                  <span className="font-bold shrink-0">⚠</span>
                  <span>{errors.global}</span>
                </div>
              )}

              {/* Name + Code row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Location Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      className={`auth-input pl-10 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                      placeholder="e.g. Rack A1"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      className={`auth-input pl-10 uppercase font-mono ${errors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                      placeholder="e.g. A1"
                      maxLength={10}
                      value={form.code}
                      onChange={e => handleChange('code', e.target.value.toUpperCase())}
                    />
                  </div>
                  {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
                </div>
              </div>

              {/* Warehouse */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    className={`auth-input pl-10 pr-10 appearance-none cursor-pointer ${errors.warehouse ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                    value={form.warehouse}
                    onChange={e => handleChange('warehouse', e.target.value)}
                  >
                    <option value="">Select a warehouse…</option>
                    {warehouses.map(wh => (
                      <option key={wh._id} value={wh._id}>
                        {wh.name} ({wh.code})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.warehouse && <p className="text-xs text-red-500 mt-1">{errors.warehouse}</p>}
                {!warehouses.length && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">⚠ No warehouses found. Create a warehouse first.</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <div className="relative">
                  <FileText size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <textarea
                    className="auth-input pl-10 resize-none"
                    rows={2}
                    placeholder="e.g. Primary steel rack – Zone B, Row 3"
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  {isEdit ? 'Update Location' : 'Create Location'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LocationFormModal;
