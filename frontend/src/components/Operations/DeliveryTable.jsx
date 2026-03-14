import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, CheckCircle, Trash2, Eye, Truck, Printer, Download } from 'lucide-react';

const DeliveryTable = ({ deliveries, isManager, onEdit, onValidate, onDelete, onView }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      case 'Waiting': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
      case 'Ready': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Done': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="py-4 px-6">Reference</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Warehouse</th>
              <th className="py-4 px-6">Schedule Date</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {deliveries.length > 0 ? deliveries.map((delivery, i) => (
              <motion.tr 
                key={delivery._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
              >
                <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{delivery.reference}</td>
                <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{delivery.customer}</td>
                <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{delivery.warehouse}</td>
                <td className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {new Date(delivery.scheduledDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onView(delivery, 'view')}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg"
                      title="View Document"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onView(delivery, 'print')}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                      title="Print"
                    >
                      <Printer size={18} />
                    </button>
                    <button 
                      onClick={() => onView(delivery, 'download')}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                    {isManager && delivery.status !== 'Done' && (
                      <>
                        <button onClick={() => onValidate(delivery._id)} className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg" title="Validate">
                          <CheckCircle size={18} />
                        </button>
                        <button onClick={() => onEdit(delivery)} className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg" title="Edit">
                          <Edit2 size={18} />
                        </button>
                      </>
                    )}
                    {isManager && delivery.status !== 'Done' && onDelete && (
                      <button onClick={() => onDelete(delivery._id)} className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan={6} className="py-24 text-center text-slate-500 dark:text-slate-400">
                  <Truck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-lg font-bold">No Deliveries Found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryTable;
