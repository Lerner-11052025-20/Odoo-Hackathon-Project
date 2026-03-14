import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPICard = ({ title, value, trend, status, icon: Icon, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
    >
      {/* Decorative Blob */}
      <div 
        className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-300`} 
      />
      
      <div className="flex justify-between items-start mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-${color.split('-')[1]}/30`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        <div className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border
          ${status === 'up' ? 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
            status === 'down' ? 'text-red-600 bg-red-50 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : 
            'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'}`}
        >
          {status === 'up' && <TrendingUp size={12} className="mr-1" />}
          {status === 'down' && <TrendingDown size={12} className="mr-1" />}
          {status === 'neutral' && <Minus size={12} className="mr-1" />}
          {Math.abs(trend)}%
        </div>
      </div>
      
      <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
        {value.toLocaleString()}
      </p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
    </motion.div>
  );
};

export default KPICard;
