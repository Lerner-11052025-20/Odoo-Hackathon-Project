import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Package } from 'lucide-react';

const TransferKanban = ({ transfers, isManager, onValidate, onUpdateStatus }) => {
  const columns = [
    { id: 'Draft',       label: 'Draft',       color: 'bg-slate-200 dark:bg-slate-800', textColor: 'text-slate-600 dark:text-slate-400' },
    { id: 'Ready',       label: 'Ready',       color: 'bg-blue-100 dark:bg-blue-500/20', textColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'In Progress', label: 'In Progress', color: 'bg-primary-100 dark:bg-primary-500/20', textColor: 'text-primary-600 dark:text-primary-400' },
    { id: 'Done',        label: 'Done',        color: 'bg-emerald-100 dark:bg-emerald-500/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'Cancelled',   label: 'Cancelled',   color: 'bg-red-100 dark:bg-red-500/20', textColor: 'text-red-600 dark:text-red-400' }
  ];

  const handleDragStart = (e, opId) => {
    e.dataTransfer.setData('text/plain', opId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-slate-200/50', 'dark:bg-slate-800/40', 'ring-2', 'ring-primary-500/20');
    const opId = e.dataTransfer.getData('text/plain');
    if (opId && isManager && onUpdateStatus) {
      const droppedOp = transfers.find(o => o._id === opId);
      if (droppedOp && droppedOp.status !== columnId) {
        onUpdateStatus(opId, columnId);
      }
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDragEnter = (e) => { e.preventDefault(); e.currentTarget.classList.add('bg-slate-200/50', 'dark:bg-slate-800/40', 'ring-2', 'ring-primary-500/20'); };
  const handleDragLeave = (e) => { e.currentTarget.classList.remove('bg-slate-200/50', 'dark:bg-slate-800/40', 'ring-2', 'ring-primary-500/20'); };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 snap-x min-h-[500px]">
      {columns.map(col => {
        const colTransfers = transfers.filter(t => t.status === col.id);
        
        return (
          <div
            key={col.id}
            onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, col.id)}
            className="flex-none w-[320px] snap-center flex flex-col bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[400px]"
          >
            <div className="p-4 flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/30 rounded-t-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color.replace('bg-', 'bg-').split(' ')[0]}`} />
                  <h3 className={`font-bold text-xs uppercase tracking-widest ${col.textColor}`}>{col.label}</h3>
                </div>
                <span className="text-[10px] font-black bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                  {colTransfers.length}
                </span>
              </div>
            </div>

            <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
              {colTransfers.map((tr) => (
                <motion.div
                  layoutId={tr._id} key={tr._id} draggable={isManager} onDragStart={(e) => handleDragStart(e, tr._id)}
                  className={`bg-white dark:bg-slate-900 p-4 pt-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all group relative ${isManager ? 'cursor-grab active:cursor-grabbing hover:border-primary-500/50 hover:shadow-md' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{tr.reference}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Package size={13} className="shrink-0 mt-0.5 opacity-50" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{tr.product?.name}</span>
                        <span className="opacity-80">Vol: {tr.quantity} {tr.product?.unit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-2.5 space-y-2 text-xs border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate flex-1 font-medium">{tr.fromWarehouse} {tr.fromLocation && `(${tr.fromLocation})`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-500">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate flex-1 font-medium">{tr.toWarehouse} {tr.toLocation && `(${tr.toLocation})`}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Clock size={11} /> {new Date(tr.scheduledDate).toLocaleDateString()}</span>
                  </div>

                  {/* Validate Action */}
                  {tr.status !== 'Done' && tr.status !== 'Cancelled' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); onValidate(tr._id); }}
                        className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
                      >
                         <CheckCircle size={13} /> Validate Transfer
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}

              {colTransfers.length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/10 transition-colors">
                  Drop Here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransferKanban;
