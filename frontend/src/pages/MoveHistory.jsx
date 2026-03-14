import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, List, Kanban, Download, FileJson, Layout } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import MoveTable from '../components/MoveHistory/MoveTable';
import MoveKanban from '../components/MoveHistory/MoveKanban';
import MoveFilters from '../components/MoveHistory/MoveFilters';
import { useMoves } from '../hooks/useMoves';
import api from '../utils/api';

const MoveHistory = () => {
  const { moves, isLoading, filters, setFilters } = useMoves();
  const [viewMode, setViewMode] = useState('list');
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await api.get('/warehouses');
        setWarehouses(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWarehouses();
  }, []);

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(moves));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "move_history_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <History size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Stock Ledger</h1>
              <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400">Track and audit every inventory movement</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm self-start">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <List size={16} /> List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Layout size={16} /> Kanban
            </button>
            <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 mx-1" />
            <button
              onClick={exportData}
              className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-all"
              title="Export JSON"
            >
              <FileJson size={18} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <MoveFilters filters={filters} setFilters={setFilters} warehouses={warehouses} />

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === 'list' ? (
              <MoveTable moves={moves} isLoading={isLoading} />
            ) : (
              <MoveKanban moves={moves} isLoading={isLoading} />
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </MainLayout>
  );
};

export default MoveHistory;
