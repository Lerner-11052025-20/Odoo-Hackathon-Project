import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Loader2, Save } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const OperationModal = ({ isOpen, onClose, type, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  
  // Dynamic fields
  const [formData, setFormData] = useState({
    partner: '', // supplier (for receipt) or customer (for delivery)
    warehouse: 'Main Warehouse',
    scheduledDate: new Date().toISOString().split('T')[0]
  });
  
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Title configuration
  const config = {
    receipt: { title: 'New Receipt', partnerLabel: 'Supplier Name', action: 'Create Receipt' },
    delivery: { title: 'New Delivery Order', partnerLabel: 'Customer Name', action: 'Create Delivery' },
    adjustment: { title: 'New Inventory Adjustment', action: 'Create Adjustment' }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      // Reset form on open
      setFormData({
        partner: '',
        warehouse: 'Main Warehouse',
        scheduledDate: new Date().toISOString().split('T')[0]
      });
      setSelectedProducts([]);
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setFetchingProducts(true);
    try {
      const { data } = await api.get('/products');
      setAvailableProducts(data.data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setFetchingProducts(false);
    }
  };

  const addProductRow = () => {
    if (availableProducts.length === 0) return toast.error('No products available in the system');
    
    // Auto-select first available product not already in the list if possible
    const unselected = availableProducts.filter(p => !selectedProducts.find(s => s.product === p._id));
    const prod = unselected.length > 0 ? unselected[0] : availableProducts[0];

    setSelectedProducts([...selectedProducts, { 
      product: prod._id, 
      quantity: 1,
      expectedQuantity: type === 'adjustment' ? prod.stock : 0,
      countedQuantity: type === 'adjustment' ? prod.stock : 0
    }]);
  };

  const updateProductRow = (index, field, value) => {
    const newItems = [...selectedProducts];
    newItems[index][field] = value;
    
    // Auto sync expected matching for adjustments
    if (type === 'adjustment' && field === 'product') {
      const selectedItem = availableProducts.find(p => p._id === value);
      if (selectedItem) {
        newItems[index].expectedQuantity = selectedItem.stock;
        newItems[index].countedQuantity = selectedItem.stock;
      }
    }

    setSelectedProducts(newItems);
  };

  const removeProductRow = (index) => {
    const newItems = [...selectedProducts];
    newItems.splice(index, 1);
    setSelectedProducts(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      return toast.error('Please add at least one product');
    }

    setLoading(true);
    
    try {
      // Build Payload based on type
      const payload = {
        warehouse: formData.warehouse
      };

      if (type === 'receipt') {
        payload.supplier = formData.partner;
        payload.scheduledDate = formData.scheduledDate;
        payload.products = selectedProducts.map(p => ({ product: p.product, quantity: Number(p.quantity) }));
      } else if (type === 'delivery') {
        payload.customer = formData.partner;
        payload.scheduledDate = formData.scheduledDate;
        payload.products = selectedProducts.map(p => ({ product: p.product, quantity: Number(p.quantity) }));
      } else if (type === 'adjustment') {
        payload.products = selectedProducts.map(p => {
          const expected = Number(p.expectedQuantity);
          const counted = Number(p.countedQuantity);
          return {
            product: p.product,
            expectedQuantity: expected,
            countedQuantity: counted,
            difference: counted - expected
          };
        });
      }

      await onSubmit(payload);
      onClose(); // Auto close on complete
    } catch (error) {
      // Handled by hook
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {config[type].title}
            </h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <form id="opForm" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Top Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {type !== 'adjustment' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {config[type].partnerLabel} *
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                      placeholder={`Enter ${config[type].partnerLabel.toLowerCase()}...`}
                      value={formData.partner}
                      onChange={(e) => setFormData({...formData, partner: e.target.value})}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Destination Warehouse *
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                    value={formData.warehouse}
                    onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                  >
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="WH-East">WH-East</option>
                    <option value="WH-West">WH-West</option>
                    <option value="WH-South">WH-South</option>
                    <option value="WH-North">WH-North</option>
                  </select>
                </div>

                {type !== 'adjustment' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    />
                  </div>
                )}
              </div>

              {/* Products Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Products List *</h3>
                  <button 
                    type="button" 
                    onClick={addProductRow}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 bg-primary-50 dark:bg-primary-500/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={16} /> Add Product
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="p-3 w-1/2">Product</th>
                        {type === 'adjustment' ? (
                          <>
                            <th className="p-3 text-center">Expected</th>
                            <th className="p-3 text-center">Counted</th>
                          </>
                        ) : (
                          <th className="p-3 text-center">Quantity</th>
                        )}
                        <th className="p-3 text-center w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {fetchingProducts ? (
                        <tr>
                          <td colSpan={type === 'adjustment' ? 4 : 3} className="text-center p-8 text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading inventory...
                          </td>
                        </tr>
                      ) : selectedProducts.length === 0 ? (
                        <tr>
                          <td colSpan={type === 'adjustment' ? 4 : 3} className="text-center p-8 text-slate-400">
                            No products added. Click "Add Product" to begin.
                          </td>
                        </tr>
                      ) : (
                        selectedProducts.map((row, index) => (
                          <tr key={index}>
                            <td className="p-2">
                              <select
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:outline-none"
                                value={row.product}
                                onChange={(e) => updateProductRow(index, 'product', e.target.value)}
                              >
                                {availableProducts.map(p => (
                                  <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                                ))}
                              </select>
                            </td>
                            
                            {type === 'adjustment' ? (
                              <>
                                <td className="p-2">
                                  <input 
                                    type="number" 
                                    disabled
                                    className="w-full p-2 text-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-slate-400 opacity-70"
                                    value={row.expectedQuantity}
                                  />
                                </td>
                                <td className="p-2">
                                  <input 
                                    type="number" 
                                    min="0"
                                    required
                                    className="w-full p-2 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-primary-500"
                                    value={row.countedQuantity}
                                    onChange={(e) => updateProductRow(index, 'countedQuantity', e.target.value)}
                                  />
                                </td>
                              </>
                            ) : (
                              <td className="p-2 text-center">
                                <input 
                                  type="number" 
                                  min="1"
                                  required
                                  className="w-full max-w-[100px] mx-auto p-2 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-primary-500"
                                  value={row.quantity}
                                  onChange={(e) => updateProductRow(index, 'quantity', e.target.value)}
                                />
                              </td>
                            )}

                            <td className="p-2 text-center">
                              <button 
                                type="button" 
                                onClick={() => removeProductRow(index)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="opForm"
              disabled={loading || selectedProducts.length === 0}
              className="px-6 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-primary-500/30"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {config[type].action}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OperationModal;
