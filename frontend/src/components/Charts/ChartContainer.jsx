import React from 'react';
import { motion } from 'framer-motion';

const ChartContainer = ({ title, subtitle, children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm overflow-hidden ${className}`}
    >
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
        {subtitle && <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{subtitle}</p>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartContainer;
