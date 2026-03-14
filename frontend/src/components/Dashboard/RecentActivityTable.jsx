import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

const RecentActivityTable = ({ operations }) => {
  const [filter, setFilter] = useState('All');

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Done': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Ready': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Waiting': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
      case 'Draft': return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400';
    }
  };

  const filteredOps = filter === 'All' ? operations : operations.filter(op => op.type === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recent Operations</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Latest inventory activity log</p>
        </div>
        
        <div className="flex gap-2">
          {['All', 'Receipt', 'Delivery', 'Transfer'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border
                ${filter === f ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-500/20 dark:border-primary-500/30 dark:text-primary-400' : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}
              `}
            >
              {f}
            </button>
          ))}
          <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
            <Filter size={14} className="mr-1" /> More
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <th className="py-4 px-6">Operation ID</th>
              <th className="py-4 px-6">Type</th>
              <th className="py-4 px-6">Product & Details</th>
              <th className="py-4 px-6 text-right">Quantity</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredOps.map((op, i) => (
              <motion.tr 
                key={op.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer group"
              >
                <td className="py-4 px-6 text-sm font-semibold text-primary-600 dark:text-primary-400">{op.id}</td>
                <td className="py-4 px-6 text-sm text-slate-900 dark:text-white font-medium">{op.type}</td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-900 dark:text-white">{op.product}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{op.warehouse}</div>
                </td>
                <td className="py-4 px-6 text-sm font-bold text-slate-900 dark:text-white text-right">
                  {op.quantity > 0 ? `+${op.quantity}` : op.quantity}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${getStatusBadge(op.status)}`}>
                    {op.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400 text-right">
                  {new Date(op.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </motion.tr>
            ))}
            {filteredOps.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                  No operations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentActivityTable;
