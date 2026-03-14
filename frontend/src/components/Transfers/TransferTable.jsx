import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2, ArrowRightLeft, Clock, CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react';

const statusBadge = (status) => {
  const styles = {
    'Draft':       'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    'Ready':       'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    'In Progress': 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20',
    'Done':        'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    'Cancelled':   'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${styles[status] || styles['Draft']} flex items-center justify-center gap-1.5 w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles[status]?.split(' ')[1] || 'bg-slate-400'} opacity-75`} />
      {status}
    </span>
  );
};

const TransferTable = memo(({ transfers, isManager, onView, onEdit, onDelete, onValidate }) => {
  if (!transfers.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/80 rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
          <ArrowRightLeft size={36} className="text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Transfers Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          {isManager 
            ? "You haven't added any stock movements yet. Click 'New Transfer' to schedule one." 
            : "No active or recorded transfers to display."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Transfer ID</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Product</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Routing</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          {transfers.map((tr, i) => (
            <motion.tr
              key={tr._id}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.04, ease: "easeOut" }}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
            >
              {/* Reference */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-900 dark:text-white text-[13px] tracking-tight">{tr.reference}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                    <Clock size={10} className="opacity-70" /> 
                    {new Date(tr.scheduledDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </td>

              {/* Product */}
              <td className="px-6 py-4 min-w-[220px]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                    <Package size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px] truncate max-w-[180px]">{tr.product?.name}</span>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                      <span className="text-slate-400 font-mono tracking-wider">{tr.product?.sku}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="font-bold text-slate-600 dark:text-slate-300">
                        {tr.quantity} <span className="text-slate-400 dark:text-slate-500 font-medium ml-0.5">{tr.product?.unit}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Route */}
              <td className="px-6 py-4">
                <div className="flex flex-col gap-[3px] min-w-[200px] bg-slate-50/50 dark:bg-slate-800/20 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2.5 text-xs group/route">
                    <div className="w-4 flex justify-center shadow-sm">
                      <div className="w-2 h-2 rounded-full border border-amber-500 bg-amber-400 dark:bg-amber-500" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                      {tr.fromWarehouse} <span className="text-slate-400 text-[11px] font-normal">{tr.fromLocation && `(${tr.fromLocation})`}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2.5 text-xs relative">
                    <div className="absolute left-[7.5px] -top-3 w-[1px] h-3.5 bg-slate-300 dark:bg-slate-700" />
                    <div className="w-4 flex justify-center z-10">
                      <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm"></span>
                      </div>
                    </div>
                    <span className="text-slate-900 dark:text-white font-semibold truncate">
                      {tr.toWarehouse} <span className="text-slate-500 text-[11px] font-normal">{tr.toLocation && `(${tr.toLocation})`}</span>
                    </span>
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex justify-center">
                  {statusBadge(tr.status)}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button 
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    onClick={() => onView(tr)} 
                    title="View Details" 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                  >
                    <Eye size={16} />
                  </motion.button>
                  
                  {tr.status !== 'Done' && tr.status !== 'Cancelled' && (
                    <motion.button 
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                      onClick={() => onValidate(tr)} 
                      title="Validate Transfer" 
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                    >
                      <CheckCircle size={16} />
                    </motion.button>
                  )}
                  
                  {isManager && (
                    <>
                      {['Draft', 'Ready', 'In Progress'].includes(tr.status) && (
                        <motion.button 
                          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                          onClick={() => onEdit(tr)} 
                          title="Edit Transfer" 
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                        >
                          <Pencil size={16} />
                        </motion.button>
                      )}
                      
                      {['Draft', 'Cancelled'].includes(tr.status) && (
                        <motion.button 
                          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                          onClick={() => onDelete(tr)} 
                          title="Delete Transfer" 
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

TransferTable.displayName = 'TransferTable';
export default TransferTable;
