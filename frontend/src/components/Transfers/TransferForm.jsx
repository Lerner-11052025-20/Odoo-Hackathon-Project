import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Package, MapPin, Calendar, FileText, Building2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const INITIAL = {
  product: '', quantity: 1,
  fromWarehouse: '', fromLocation: '',
  toWarehouse: '', toLocation: '',
  status: 'Draft', scheduledDate: new Date().toISOString().split('T')[0], notes: ''
};

const TransferForm = ({ isOpen, onClose, onSubmit, isEdit = false, initialData = null }) => {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Data for dropdowns
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setErrorMsg('');
      if (initialData) {
        setForm({
          product:       initialData.product?._id || initialData.product || '',
          quantity:      initialData.quantity || 1,
          fromWarehouse: initialData.fromWarehouse || '',
          fromLocation:  initialData.fromLocation || '',
          toWarehouse:   initialData.toWarehouse || '',
          toLocation:    initialData.toLocation || '',
          status:        initialData.status || 'Draft',
          scheduledDate: initialData.scheduledDate ? new Date(initialData.scheduledDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          notes:         initialData.notes || ''
        });
      } else {
        setForm(INITIAL);
      }
    }
  }, [isOpen, initialData]);

  const fetchData = async () => {
    try {
      const [pRes, wRes, lRes] = await Promise.all([
        api.get('/products'),
        api.get('/warehouses'),
        api.get('/locations')
      ]);
      setProducts(pRes.data.data || []);
      setWarehouses(wRes.data.data || []);
      setLocations(lRes.data.data || []);
    } catch {
      toast.error('Failed to load dependency data.');
    }
  };

  const handleChange = (f, v) => {
    setForm(p => ({ ...p, [f]: v }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.fromWarehouse === form.toWarehouse && form.fromLocation === form.toLocation) {
      setErrorMsg('Source and Destination cannot be identical.');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit({ ...form, quantity: Number(form.quantity) });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error saving transfer.');
    } finally {
      setLoading(false);
    }
  };

  // Filter locations based on selected warehouse
  const fromLocOptions = locations.filter(l => l.warehouse?.name === form.fromWarehouse || l.warehouse?._id === form.fromWarehouse || l.warehouse === form.fromWarehouse);
  const toLocOptions   = locations.filter(l => l.warehouse?.name === form.toWarehouse || l.warehouse?._id === form.toWarehouse || l.warehouse === form.toWarehouse);
  const selectedProd   = products.find(p => p._id === form.product);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 18 }} transition={{ type: 'spring', bounce: 0.2 }} className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <ArrowRight size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-lg">{isEdit ? 'Edit Transfer' : 'New Internal Transfer'}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Move stock between warehouses & locations</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="transferForm" onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                    <span className="font-bold shrink-0">⚠</span><span>{errorMsg}</span>
                  </div>
                )}

                {/* Status (Edit only) */}
                {isEdit && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Transfer Status</label>
                    <select required className="auth-input pl-4" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                      {['Draft', 'Ready', 'In Progress', 'Done', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                {/* Product & Quantity */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Product <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Package size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select required className="auth-input pl-10" value={form.product} onChange={e => handleChange('product', e.target.value)}>
                        <option value="">Select a product…</option>
                        {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
                      </select>
                    </div>
                    {selectedProd && <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 font-medium">Available Stock: {selectedProd.stock} {selectedProd.unit}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quantity <span className="text-red-500">*</span></label>
                    <input required type="number" min="1" max={selectedProd?.stock || undefined} className="auth-input pl-4 font-mono font-bold text-center" value={form.quantity} onChange={e => handleChange('quantity', e.target.value)} />
                  </div>
                </div>

                {/* Source & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {/* Source */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> Source</h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Warehouse <span className="text-red-500">*</span></label>
                      <select required className="auth-input pl-4 text-sm" value={form.fromWarehouse} onChange={e => handleChange('fromWarehouse', e.target.value)}>
                        <option value="">Select source...</option>
                        {warehouses.map(w => <option key={w._id} value={w.name}>{w.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Location</label>
                      <select className="auth-input pl-4 text-sm" value={form.fromLocation} onChange={e => handleChange('fromLocation', e.target.value)} disabled={!form.fromWarehouse}>
                        <option value="">Any / General</option>
                        {fromLocOptions.map(l => <option key={l._id} value={l.name}>{l.name} ({l.code})</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} className="text-emerald-500" /> Destination</h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Warehouse <span className="text-red-500">*</span></label>
                      <select required className="auth-input pl-4 text-sm" value={form.toWarehouse} onChange={e => handleChange('toWarehouse', e.target.value)}>
                        <option value="">Select destination...</option>
                        {warehouses.map(w => <option key={w._id} value={w.name}>{w.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Location</label>
                      <select className="auth-input pl-4 text-sm" value={form.toLocation} onChange={e => handleChange('toLocation', e.target.value)} disabled={!form.toWarehouse}>
                        <option value="">Any / General</option>
                        {toLocOptions.map(l => <option key={l._id} value={l.name}>{l.name} ({l.code})</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Schedule & Notes */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Scheduled Date</label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input type="date" required className="auth-input pl-10 text-sm" value={form.scheduledDate} onChange={e => handleChange('scheduledDate', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
                    <div className="relative">
                      <FileText size={15} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                      <textarea rows={1} className="auth-input pl-10 text-sm resize-none" placeholder="Optional notes..." value={form.notes} onChange={e => handleChange('notes', e.target.value)} />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 shrink-0">
              <button type="button" onClick={onClose} className="btn-secondary px-6">Cancel</button>
              <button type="submit" form="transferForm" disabled={loading} className="btn-primary px-6 flex items-center gap-2">
                {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {isEdit ? 'Save Changes' : 'Create Transfer'}
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransferForm;
