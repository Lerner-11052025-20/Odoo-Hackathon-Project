import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Package, ArrowRight, CornerDownRight } from 'lucide-react';

const TransferKanban = ({ transfers, isManager, onValidate, onUpdateStatus }) => {
  const columns = [
    { id: 'Draft',       label: 'New Drafts',  color: 'bg-slate-200 dark:bg-slate-700/50', ring: 'ring-slate-300 dark:ring-slate-700',   textColor: 'text-slate-600 dark:text-slate-300' },
    { id: 'Ready',       label: 'Checked',     color: 'bg-blue-100 dark:bg-blue-500/10',    ring: 'ring-blue-300 dark:ring-blue-500/30',     textColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'In Progress', label: 'In Transit',  color: 'bg-indigo-100 dark:bg-indigo-500/10',  ring: 'ring-indigo-300 dark:ring-indigo-500/30', textColor: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'Done',        label: 'Delivered',   color: 'bg-emerald-100 dark:bg-emerald-500/10', ring: 'ring-emerald-300 dark:ring-emerald-500/30', textColor: 'text-emerald-700 dark:text-emerald-400' },
    { id: 'Cancelled',   label: 'Halted',      color: 'bg-red-100 dark:bg-red-500/10',     ring: 'ring-red-300 dark:ring-red-500/30',       textColor: 'text-red-600 dark:text-red-400' }
  ];

  const handleDragStart = (e, opId) => {
    e.dataTransfer.setData('text/plain', opId);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('opacity-50', 'scale-95');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50', 'scale-95');
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-slate-100/80', 'dark:bg-slate-800/60', 'ring-4', 'ring-indigo-500/20');
    const opId = e.dataTransfer.getData('text/plain');
    if (opId && isManager && onUpdateStatus) {
      const droppedOp = transfers.find(o => o._id === opId);
      if (droppedOp && droppedOp.status !== columnId) {
        onUpdateStatus(opId, columnId);
      }
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDragEnter = (e) => { e.preventDefault(); e.currentTarget.classList.add('bg-slate-100/80', 'dark:bg-slate-800/60', 'ring-4', 'ring-indigo-500/20'); };
  const handleDragLeave = (e) => { e.currentTarget.classList.remove('bg-slate-100/80', 'dark:bg-slate-800/60', 'ring-4', 'ring-indigo-500/20'); };

  return (
    <div className="flex gap-5 overflow-x-auto pb-8 snap-x min-h-[550px] p-2 custom-scrollbar">
      {columns.map(col => {
        const colTransfers = transfers.filter(t => t.status === col.id);
        
        return (
          <div
            key={col.id}
            onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, col.id)}
            className={`flex-none w-[340px] snap-center flex flex-col bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-800/60 transition-all min-h-[450px]`}
          >
            {/* Column Header */}
            <div className={`p-4 mx-2 mt-2 flex flex-col rounded-2xl ${col.color} border border-white/50 dark:border-slate-700/30 shadow-sm shrink-0`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-md ${col.color.replace('bg-', 'bg-').split(' ')[0]} shadow-inner opacity-80`} />
                  <h3 className={`font-black text-[13px] uppercase tracking-widest ${col.textColor}`}>{col.label}</h3>
                </div>
                <div className={`text-[11px] font-black px-2.5 py-1 rounded-full bg-white/60 dark:bg-slate-900/40 shadow-sm ${col.textColor}`}>
                  {colTransfers.length}
                </div>
              </div>
            </div>

            {/* Column Body */}
            <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[650px] custom-scrollbar mt-1">
              <AnimatePresence>
                {colTransfers.map((tr) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    key={tr._id} 
                    draggable={isManager} 
                    onDragStart={(e) => handleDragStart(e, tr._id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white dark:bg-slate-900 p-4 pt-3.5 rounded-2xl border ${isManager ? `cursor-grab active:cursor-grabbing hover:${col.ring} hover:border-transparent hover:shadow-lg dark:hover:shadow-black/40` : ''} border-slate-200 dark:border-slate-800 shadow-sm transition-all group relative overflow-hidden`}
                  >
                    {/* Top row: Ref and Date */}
                    <div className="flex justify-between items-start mb-2.5">
                      <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{tr.reference}</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700/50">
                        <Clock size={10} /> 
                        {new Date(tr.scheduledDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Product block */}
                    <div className="flex items-start gap-3 mb-3 bg-indigo-50/50 dark:bg-indigo-500/5 p-2.5 rounded-xl border border-indigo-100/50 dark:border-indigo-500/10">
                      <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
                        <Package size={14} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-[13px] truncate mr-2 block">{tr.product?.name}</span>
                        <div className="flex items-center gap-2 mt-0.5 opacity-80">
                          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{tr.product?.sku}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          <span className="font-bold text-[11px] text-indigo-700 dark:text-indigo-300">{tr.quantity} {tr.product?.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Routing block */}
                    <div className="space-y-3 relative pl-1 mb-2">
                      <div className="absolute left-[9px] top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-700 rounded-full" />
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-4 h-4 rounded-full border-[3px] border-amber-500 bg-white dark:bg-slate-900 shadow-sm shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{tr.fromWarehouse}</span>
                          {tr.fromLocation && <span className="text-[10px] text-slate-400 flex items-center gap-1"><CornerDownRight size={10} /> {tr.fromLocation}</span>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-4 h-4 rounded-full border-[3px] border-emerald-500 bg-white dark:bg-slate-900 shadow-sm shrink-0 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{tr.toWarehouse}</span>
                          {tr.toLocation && <span className="text-[10px] text-slate-400 flex items-center gap-1"><CornerDownRight size={10} /> {tr.toLocation}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Validate Action (Floating/Hover or Always Visible based on style) */}
                    {tr.status !== 'Done' && tr.status !== 'Cancelled' && (
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <button
                          onClick={(e) => { e.stopPropagation(); onValidate(tr._id); }}
                          className="w-full py-1.5 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/50 dark:hover:bg-emerald-500/10 text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 text-[11px] font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/20 active:scale-95"
                        >
                           <CheckCircle size={13} className="opacity-50 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all duration-300" /> 
                           Validate
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {colTransfers.length === 0 && (
                <div className="h-32 m-2 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800/50 rounded-2xl text-slate-400/50 text-xs font-bold tracking-widest bg-slate-50/30 dark:bg-slate-900/20 transition-colors">
                  <ArrowRight size={24} className="mb-2 opacity-30" />
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
