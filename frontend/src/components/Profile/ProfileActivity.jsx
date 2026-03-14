import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, FileText, ArrowRightLeft, PenTool } from 'lucide-react';

const ProfileActivity = memo(({ activity }) => {
  if (!activity) return null;

  const data = [
    { label: 'Total Receipts Made', value: activity.receipts || 0, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Total Deliveries', value: activity.deliveries || 0, icon: ArrowRightLeft, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Adjustments Logged', value: activity.adjustments || 0, icon: PenTool, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-100 dark:border-purple-500/20">
          <Activity size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Activity</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total operational output</p>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:border-slate-200 dark:hover:border-slate-700">
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${item.bg} ${item.color}`}>
                <item.icon size={20} />
             </div>
             <div className="flex-1">
               <span className="block text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{item.value}</span>
               <span className="block text-[11px] uppercase tracking-wider font-bold text-slate-500">{item.label}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
         <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> Last Login:</span>
         <span className="font-bold text-slate-700 dark:text-slate-300">
           {new Date(activity.lastLogin).toLocaleString(undefined, {
             year: 'numeric',
             month: 'short',
             day: 'numeric',
             hour: '2-digit',
             minute: '2-digit'
           })}
         </span>
      </div>
    </motion.div>
  );
});

ProfileActivity.displayName = 'ProfileActivity';
export default ProfileActivity;
