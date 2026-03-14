import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Eye, Package } from 'lucide-react';

const ProductTable = ({ products, isManager, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Reset to valid page when products length changes (e.g. searching)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [products.length, totalPages, currentPage]);

  const getStockBadge = (stock) => {
    if (stock > 20) return { label: 'In Stock', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' };
    if (stock > 0 && stock <= 20) return { label: 'Low Stock', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' };
    return { label: 'Out of Stock', classes: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' };
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto min-h-[400px] flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="py-4 px-6">Product & SKU</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6 text-right">Stock</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6">Warehouse</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 relative">
            <AnimatePresence mode="popLayout">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, i) => {
                  const status = getStockBadge(product.stock);
                  return (
                    <motion.tr 
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-white mb-0.5">{product.name}</div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">{product.sku}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {product.category}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-900 dark:text-white text-right">
                        {product.stock} <span className="text-xs font-medium text-slate-500">{product.unit}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${status.classes}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {product.warehouse}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View Details">
                            <Eye size={18} />
                          </button>
                          {isManager && (
                            <>
                              <button 
                                onClick={() => onEdit(product)}
                                className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Edit Product"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => {
                                  if(window.confirm('Are you sure you want to delete this product?')) {
                                    onDelete(product._id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Product"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center w-full">
                      <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-200">No products found</p>
                      <p className="text-sm mt-1">Adjust filters or add a new product.</p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Pagination Bar */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span className="font-medium">
          Showing {products.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} entries
        </span>
        <div className="flex gap-1">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Prev
          </button>
          
          {/* Page Numbers */}
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            const isActive = page === currentPage;
            return (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-bold shadow-sm transition-all ${
                  isActive 
                  ? 'bg-primary-600 text-white border border-primary-600 dark:border-primary-500' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {page}
              </button>
            )
          })}

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
