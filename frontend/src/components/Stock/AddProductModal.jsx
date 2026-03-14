import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Hash, Layers, Scale, MapPin } from 'lucide-react';

const AddProductModal = ({ isOpen, onClose, onSubmit, isManager }) => {
  if (!isManager || !isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unit: 'Pieces',
    stock: 0,
    warehouse: 'Main Warehouse',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSubmit(formData);
    if (success) {
      setFormData({ name: '', sku: '', category: '', unit: 'Pieces', stock: 0, warehouse: 'Main Warehouse' });
      onClose();
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-10 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Product</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Register a new item into the inventory</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                  <Package size={14}/> Product Name *
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
                  placeholder="e.g. Logitech MX Master 3S"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                    <Hash size={14}/> SKU Code *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.sku} 
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium uppercase"
                    placeholder="e.g. LOG-MX-3S"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                    <Layers size={14}/> Category *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
                    placeholder="e.g. Electronics"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                    <Scale size={14}/> Unit *
                  </label>
                  <select 
                    value={formData.unit} 
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Pieces">Pieces</option>
                    <option value="KG">Kilograms (KG)</option>
                    <option value="Liters">Liters</option>
                    <option value="Meters">Meters</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Pallets">Pallets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                    <Package size={14}/> Initial Stock
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.stock} 
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                  <MapPin size={14}/> Primary Warehouse *
                </label>
                 <select 
                    value={formData.warehouse} 
                    onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="WH-East">WH-East</option>
                    <option value="WH-West">WH-West</option>
                  </select>
              </div>

            </div>

            <div className="pt-6 flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-primary-600 to-violet-600 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary-500/30"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddProductModal;
