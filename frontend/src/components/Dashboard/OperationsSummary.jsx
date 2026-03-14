import React from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, AlertCircle, ArrowRight } from 'lucide-react';

import { Link } from 'react-router-dom';

const OperationsSummary = ({ receiptData, deliveryData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full"
    >
      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6">Operations Summary</h3>
      
      <div className="space-y-4 flex-1">
        
        {/* Receipts Card */}
        <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 group hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Download size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Receipts</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Incoming Stock</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{receiptData?.value || 0}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Waiting</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-2xl font-bold text-emerald-500">{receiptData?.completed || 0}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                Completed <ArrowRight size={10} />
              </p>
            </div>
          </div>
          
          <Link to="/operations/receipts" className="w-full py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700/50 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-sm">
            View Receipts <ArrowRight size={14} />
          </Link>
        </div>

        {/* Deliveries Card */}
        <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 group hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Upload size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Delivery Orders</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Outgoing Stock</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{deliveryData?.value || 0}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">To Deliver</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-2xl font-bold text-amber-500">{deliveryData?.late || 0}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                Late <AlertCircle size={10} />
              </p>
            </div>
          </div>
          
          <Link to="/operations/deliveries" className="w-full py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700/50 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-sm">
            View Deliveries <ArrowRight size={14} />
          </Link>
        </div>
        
      </div>
    </motion.div>
  );
};

export default OperationsSummary;
