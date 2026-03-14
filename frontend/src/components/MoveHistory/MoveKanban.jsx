import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Layout, Calendar, MapPin, Package } from 'lucide-react';

const MoveKanban = ({ moves, isLoading }) => {
  const columns = ['Draft', 'Ready', 'Done', 'Cancelled'];

  const getFilteredMoves = (status) => moves.filter(m => m.status === status);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px]">
      {columns.map((status) => (
        <div key={status} className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                status === 'Done' ? 'bg-emerald-500' : 
                status === 'Draft' ? 'bg-slate-400' : 
                status === 'Cancelled' ? 'bg-rose-500' : 'bg-blue-500'
              }`}></span>
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">{status}</h3>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
              {getFilteredMoves(status).length}
            </span>
          </div>

          <div className="flex-1 space-y-3 bg-slate-50/50 dark:bg-slate-800/20 p-2 rounded-2xl min-h-[500px] border border-dashed border-slate-200 dark:border-slate-800">
            {getFilteredMoves(status).map((move) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={move._id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-black text-primary-600 dark:text-primary-400">{move.reference}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    move.movementType === 'RECEIPT' ? 'bg-emerald-50 text-emerald-600' :
                    move.movementType === 'DELIVERY' ? 'bg-rose-50 text-rose-600' :
                    move.movementType === 'TRANSFER' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {move.movementType}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {move.product?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Layout size={14} className="text-slate-400" />
                        <span className={`text-xs font-black ${move.quantity > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {move.quantity > 0 ? '+' : ''}{move.quantity} {move.product?.unit}
                        </span>
                     </div>
                     <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar size={10} /> {format(new Date(move.createdAt), 'MMM dd')}
                     </span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-800 flex flex-col gap-1">
                     <div className="flex items-center gap-1.5 text-[10px]">
                        <MapPin size={10} className="text-slate-300" />
                        <span className="text-slate-500 truncate">{move.fromLocation || 'Vendor'}</span>
                        <span className="text-slate-300">&rarr;</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{move.toLocation || 'Customer'}</span>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoveKanban;
