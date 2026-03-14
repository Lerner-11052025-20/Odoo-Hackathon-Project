import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Package, User, MapPin } from 'lucide-react';

const OperationKanban = ({ operations, type, isManager, onValidate, onUpdateStatus }) => {
  // Define columns based on type
  let columns = [];
  if (type === 'receipt') {
    columns = [
      { id: 'Draft', label: 'Draft', color: 'bg-slate-200 dark:bg-slate-800', textColor: 'text-slate-600 dark:text-slate-400' },
      { id: 'Ready', label: 'Ready', color: 'bg-blue-100 dark:bg-blue-500/20', textColor: 'text-blue-600 dark:text-blue-400' },
      { id: 'Done', label: 'Done', color: 'bg-emerald-100 dark:bg-emerald-500/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
      { id: 'Cancelled', label: 'Cancelled', color: 'bg-red-100 dark:bg-red-500/20', textColor: 'text-red-600 dark:text-red-400' }
    ];
  } else if (type === 'delivery') {
    columns = [
      { id: 'Draft', label: 'Draft', color: 'bg-slate-200 dark:bg-slate-800', textColor: 'text-slate-600 dark:text-slate-400' },
      { id: 'Waiting', label: 'Waiting', color: 'bg-amber-100 dark:bg-amber-500/20', textColor: 'text-amber-600 dark:text-amber-400' },
      { id: 'Ready', label: 'Ready', color: 'bg-blue-100 dark:bg-blue-500/20', textColor: 'text-blue-600 dark:text-blue-400' },
      { id: 'Done', label: 'Done', color: 'bg-emerald-100 dark:bg-emerald-500/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
      { id: 'Cancelled', label: 'Cancelled', color: 'bg-red-100 dark:bg-red-500/20', textColor: 'text-red-600 dark:text-red-400' }
    ];
  } else if (type === 'adjustment') {
    columns = [
      { id: 'Draft', label: 'Draft', color: 'bg-slate-200 dark:bg-slate-800', textColor: 'text-slate-600 dark:text-slate-400' },
      { id: 'Validated', label: 'Validated', color: 'bg-amber-100 dark:bg-amber-500/20', textColor: 'text-amber-600 dark:text-amber-400' },
      { id: 'Done', label: 'Done', color: 'bg-emerald-100 dark:bg-emerald-500/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
      { id: 'Cancelled', label: 'Cancelled', color: 'bg-red-100 dark:bg-red-500/20', textColor: 'text-red-600 dark:text-red-400' }
    ];
  }

  // Find all unique statuses from operations not in predefined columns to avoid losing items
  const knownStatuses = columns.map(c => c.id);
  const extraStatuses = [...new Set(operations.map(op => op.status))].filter(Boolean).filter(s => !knownStatuses.includes(s));
  extraStatuses.forEach(s => {
    columns.push({ id: s, label: s, color: 'bg-slate-200 dark:bg-slate-800', textColor: 'text-slate-600 dark:text-slate-400' });
  });

  const getPartnerName = (op) => {
    if (type === 'receipt') return op.supplier || 'No Supplier';
    if (type === 'delivery') return op.customer || 'No Customer';
    return null;
  };

  const handleDragStart = (e, opId) => {
    e.dataTransfer.setData('text/plain', opId);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-slate-200/50', 'dark:bg-slate-800/40', 'ring-2', 'ring-primary-500/20');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-slate-200/50', 'dark:bg-slate-800/40', 'ring-2', 'ring-primary-500/20');
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-slate-200/50', 'dark:bg-slate-800/40', 'ring-2', 'ring-primary-500/20');
    const opId = e.dataTransfer.getData('text/plain');
    if (opId && isManager && onUpdateStatus) {
      const droppedOp = operations.find(o => o._id === opId);
      if (droppedOp && droppedOp.status !== columnId) {
        onUpdateStatus(opId, columnId);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {columns.map(column => {
          const columnOps = operations.filter(op => op.status === column.id);
          
          return (
            <div 
              key={column.id} 
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className="group flex flex-col bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all min-h-[350px]"
            >
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-800/30 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color.replace('bg-', 'bg-').split(' ')[0]}`}></div>
                  <h3 className={`font-bold text-xs uppercase tracking-widest ${column.textColor}`}>
                    {column.label}
                  </h3>
                </div>
                <span className="text-[10px] font-black bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                  {columnOps.length}
                </span>
              </div>

              {/* Column Body */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                {columnOps.map((op, i) => (
                  <motion.div
                    layout
                    key={op._id}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, op._id)}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all group relative select-none ${isManager ? 'cursor-grab active:cursor-grabbing hover:border-primary-500/50 hover:shadow-md active:scale-[0.98]' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{op.reference}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${column.textColor} ${column.color}`}>
                        {op.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                      {getPartnerName(op) && (
                        <div className="flex items-center gap-2">
                          <User size={13} className="opacity-40" />
                          <span className="truncate font-medium">{getPartnerName(op)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="opacity-40" />
                        <span className="truncate">{op.warehouse}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="opacity-40" />
                        <span>{new Date(op.scheduledDate || op.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      {op.products && (
                        <div className="flex items-center gap-2">
                          <Package size={13} className="opacity-40" />
                          <span className="font-semibold">{op.products.length} Products</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Validate for Managers */}
                    {isManager && op.status !== 'Done' && op.status !== 'Cancelled' && (
                      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/50 flex justify-end">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onValidate(op._id);
                          }}
                          className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle size={12} /> Validate Operation
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}

                {columnOps.length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/10 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/40 transition-colors">
                    Drop Here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OperationKanban;
