import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2, MapPin, Clock, Hash } from 'lucide-react';

const WarehouseTable = memo(({ warehouses, isManager, onView, onEdit, onDelete }) => {
  if (!warehouses.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600"
      >
        <MapPin size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-semibold">No warehouses found</p>
        <p className="text-sm mt-1">
          {isManager ? 'Create your first warehouse to get started.' : 'No warehouses have been added yet.'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            {['Warehouse', 'Code', 'Address', 'Locations', 'Last Updated', 'Actions'].map(h => (
              <th
                key={h}
                className="px-5 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-50 dark:divide-slate-800">
          {warehouses.map((w, i) => (
            <motion.tr
              key={w._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
            >
              {/* Name */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-md shadow-primary-500/20 shrink-0">
                    <MapPin size={15} className="text-white" />
                  </div>
                  <button
                    onClick={() => onView(w)}
                    className="font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-left"
                  >
                    {w.name}
                  </button>
                </div>
              </td>

              {/* Code */}
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg text-xs font-bold">
                  <Hash size={10} /> {w.code}
                </span>
              </td>

              {/* Address */}
              <td className="px-5 py-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                {w.address || <span className="text-slate-300 dark:text-slate-600 italic">—</span>}
              </td>

              {/* Locations */}
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                  <MapPin size={10} /> {w.locationCount} location{w.locationCount !== 1 ? 's' : ''}
                </span>
              </td>

              {/* Updated */}
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <span className="flex items-center gap-1.5 text-xs">
                  <Clock size={12} />
                  {new Date(w.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onView(w)}
                    title="View Details"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                  >
                    <Eye size={15} />
                  </button>
                  {isManager && (
                    <>
                      <button
                        onClick={() => onEdit(w)}
                        title="Edit"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(w)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
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

WarehouseTable.displayName = 'WarehouseTable';
export default WarehouseTable;
