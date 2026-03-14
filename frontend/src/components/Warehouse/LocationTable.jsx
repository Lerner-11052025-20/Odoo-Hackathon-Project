import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Hash, MapPin } from 'lucide-react';

const LocationTable = memo(({ locations, isManager, onEdit, onDelete }) => {
  if (!locations.length) {
    return (
      <div className="text-center py-12 text-slate-400 dark:text-slate-600">
        <MapPin size={36} className="mx-auto mb-3 opacity-30" />
        <p className="font-semibold">No locations yet</p>
        {isManager && <p className="text-sm mt-1">Click <strong>"Add Location"</strong> to create the first one.</p>}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
            <th className="pb-3 pr-4">Location</th>
            <th className="pb-3 pr-4">Code</th>
            <th className="pb-3 pr-4">Description</th>
            {isManager && <th className="pb-3">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
          {locations.map((loc, i) => (
            <motion.tr
              key={loc._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <MapPin size={13} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{loc.name}</span>
                </div>
              </td>
              <td className="py-3 pr-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono text-xs font-bold">
                  <Hash size={10} />{loc.code}
                </span>
              </td>
              <td className="py-3 pr-4 text-slate-500 dark:text-slate-400 max-w-[240px] truncate">
                {loc.description || <span className="italic text-slate-300 dark:text-slate-600">—</span>}
              </td>
              {isManager && (
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(loc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(loc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

LocationTable.displayName = 'LocationTable';
export default LocationTable;
