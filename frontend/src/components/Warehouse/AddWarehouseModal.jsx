import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Hash, Building2 } from 'lucide-react';

const INITIAL = { name: '', code: '', address: '' };

const AddWarehouseModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { name: initialData.name, code: initialData.code, address: initialData.address || '' } : INITIAL);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Warehouse name is required.';
    if (!form.code.trim()) e.code = 'Short code is required.';
    else if (!/^[A-Z0-9-_]{2,10}$/i.test(form.code.trim())) e.code = 'Code must be 2–10 alphanumeric characters.';
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <Building2 size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                    {isEdit ? 'Edit Warehouse' : 'Add Warehouse'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isEdit ? 'Update warehouse details' : 'Create a new storage facility'}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {errors.global && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                  {errors.global}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Warehouse Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className={`auth-input pl-10 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                    placeholder="e.g. Main Warehouse"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Short Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className={`auth-input pl-10 uppercase font-mono ${errors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                    placeholder="e.g. WH01"
                    value={form.code}
                    maxLength={10}
                    onChange={e => handleChange('code', e.target.value.toUpperCase())}
                  />
                </div>
                {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
                <p className="text-xs text-slate-400 mt-1">2–10 characters, unique identifier. Cannot be changed later.</p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
                <textarea
                  className="auth-input resize-none"
                  rows={3}
                  placeholder="e.g. Industrial Zone, Sector 5, Ahmedabad"
                  value={form.address}
                  onChange={e => handleChange('address', e.target.value)}
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {isEdit ? 'Update Warehouse' : 'Create Warehouse'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddWarehouseModal;
