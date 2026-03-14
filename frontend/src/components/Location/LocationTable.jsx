import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2, MapPin, Hash, Building2, Clock } from 'lucide-react';

const LocationTable = memo(({ locations, isManager, onView, onEdit, onDelete }) => {
  if (!locations.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600"
      >
        <MapPin size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-semibold">No locations found</p>
        <p className="text-sm mt-1">
          {isManager ? 'Add your first storage location to get started.' : 'No locations exist yet.'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            {['Location', 'Code', 'Warehouse', 'Description', 'Last Updated', 'Actions'].map(h => (
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
          {locations.map((loc, i) => (
            <motion.tr
              key={loc._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.035 }}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
            >
              {/* Name */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                    <MapPin size={15} className="text-white" />
                  </div>
                  <button
                    onClick={() => onView(loc)}
                    className="font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-left"
                  >
                    {loc.name}
                  </button>
                </div>
              </td>

              {/* Code */}
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold font-mono">
                  <Hash size={10} /> {loc.code}
                </span>
              </td>

              {/* Warehouse */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <Building2 size={13} className="text-slate-400 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {loc.warehouse?.name || '—'}
                  </span>
                  {loc.warehouse?.code && (
                    <span className="hidden lg:inline text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded font-mono">
                      {loc.warehouse.code}
                    </span>
                  )}
                </div>
              </td>

              {/* Description */}
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                {loc.description || <span className="italic text-slate-300 dark:text-slate-600">—</span>}
              </td>

              {/* Updated */}
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <span className="flex items-center gap-1.5 text-xs">
                  <Clock size={11} />
                  {new Date(loc.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onView(loc)}
                    title="View Details"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                  >
                    <Eye size={15} />
                  </button>
                  {isManager && (
                    <>
                      <button
                        onClick={() => onEdit(loc)}
                        title="Edit"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(loc)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
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

LocationTable.displayName = 'LocationTable';
export default LocationTable;
