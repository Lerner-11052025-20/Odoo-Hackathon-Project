import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, RefreshCcw, PenTool } from 'lucide-react';

const MoveTable = ({ moves, isLoading }) => {
  const getMoveIcon = (type) => {
    switch (type) {
      case 'RECEIPT': return { icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' };
      case 'DELIVERY': return { icon: ArrowUpRight, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' };
      case 'TRANSFER': return { icon: RefreshCcw, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' };
      case 'ADJUSTMENT': return { icon: PenTool, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' };
      default: return { icon: RefreshCcw, color: 'text-slate-500', bg: 'bg-slate-50' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Done': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Draft': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 flex justify-center border border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 dark:border-slate-800">
              <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">From → To</th>
              <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Qty</th>
              <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {moves.map((move, index) => {
              const { icon: Icon, color, bg } = getMoveIcon(move.movementType);
              const isPositive = move.quantity > 0;
              
              return (
                <motion.tr
                  key={move._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{move.reference}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {format(new Date(move.createdAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {move.product?.name || 'Deleted Product'}
                      </span>
                      <span className="text-[10px] font-bold text-primary-500">{move.product?.sku}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 truncate max-w-[100px]">{move.fromLocation || '-'}</span>
                      <Icon size={12} className={color} />
                      <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                        {move.toLocation || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isPositive ? '+' : ''}{move.quantity}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1 font-bold italic line-through-none">
                       {move.product?.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${bg} ${color}`}>
                      <Icon size={12} />
                      {move.movementType}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(move.status)}`}>
                      {move.status}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {moves.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-500 text-sm">No movements found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveTable;
