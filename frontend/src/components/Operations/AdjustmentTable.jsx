import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, CheckCircle, Trash2, Eye, GitPullRequest } from 'lucide-react';

const AdjustmentTable = ({ adjustments, isManager, onEdit, onValidate, onDelete }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      case 'Validated': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
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
              <th className="py-4 px-6">Warehouse</th>
              <th className="py-4 px-6">Created</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {adjustments.length > 0 ? adjustments.map((adjustment, i) => (
              <motion.tr 
                key={adjustment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
              >
                <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{adjustment.reference}</td>
                <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{adjustment.warehouse}</td>
                <td className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {new Date(adjustment.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(adjustment.status)}`}>
                    {adjustment.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg">
                      <Eye size={18} />
                    </button>
                    {isManager && adjustment.status !== 'Done' && (
                      <button onClick={() => onValidate(adjustment._id)} className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg">
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan={5} className="py-24 text-center text-slate-500 dark:text-slate-400">
                  <GitPullRequest className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-lg font-bold">No Adjustments Found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdjustmentTable;
