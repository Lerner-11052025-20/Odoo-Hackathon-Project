import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2, ArrowRightLeft, Clock, CheckCircle } from 'lucide-react';

const statusBadge = (status) => {
  const styles = {
    'Draft':       'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    'Ready':       'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
    'In Progress': 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400',
    'Done':        'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    'Cancelled':   'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
  };
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${styles[status]}`}>{status}</span>;
};

const TransferTable = memo(({ transfers, isManager, onView, onEdit, onDelete, onValidate }) => {
  if (!transfers.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
        <ArrowRightLeft size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-semibold">No internal transfers found</p>
        <p className="text-sm mt-1">{isManager ? 'Create your first internal transfer.' : 'No transfers have been created yet.'}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            {['Ref', 'Status', 'Product', 'Quantity', 'From', 'To', 'Scheduled', 'Actions'].map(h => (
              <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-50 dark:divide-slate-800">
          {transfers.map((tr, i) => (
            <motion.tr
              key={tr._id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.035 }}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
            >
              <td className="px-5 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">{tr.reference}</td>
              <td className="px-5 py-4 whitespace-nowrap">{statusBadge(tr.status)}</td>
              <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                {tr.product?.name} <span className="text-slate-400 dark:text-slate-500 text-xs font-mono ml-1">({tr.product?.sku})</span>
              </td>
              <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                {tr.quantity} <span className="text-xs font-normal text-slate-500">{tr.product?.unit}</span>
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-400 text-xs">
                <span className="font-semibold block">{tr.fromWarehouse}</span>
                <span className="text-slate-400">{tr.fromLocation || '—'}</span>
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-400 text-xs">
                <span className="font-semibold block">{tr.toWarehouse}</span>
                <span className="text-slate-400">{tr.toLocation || '—'}</span>
              </td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                <span className="flex items-center gap-1.5">
                  <Clock size={11} /> {new Date(tr.scheduledDate).toLocaleDateString()}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => onView(tr)} title="View" className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                    <Eye size={15} />
                  </button>
                  {/* Both roles can validate (execute) */}
                  {tr.status !== 'Done' && tr.status !== 'Cancelled' && (
                    <button onClick={() => onValidate(tr)} title="Validate" className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
                      <CheckCircle size={15} />
                    </button>
                  )}
                  {isManager && (
                    <>
                      {['Draft', 'Ready', 'In Progress'].includes(tr.status) && (
                        <button onClick={() => onEdit(tr)} title="Edit" className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10">
                          <Pencil size={15} />
                        </button>
                      )}
                      {['Draft', 'Cancelled'].includes(tr.status) && (
                        <button onClick={() => onDelete(tr)} title="Delete" className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                          <Trash2 size={15} />
                        </button>
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
