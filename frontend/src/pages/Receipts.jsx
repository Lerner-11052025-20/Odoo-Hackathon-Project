import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Layers, LayoutList, CheckSquare } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { useOperations } from '../hooks/useOperations';
import { useAuth } from '../context/AuthContext';
import ReceiptsTable from '../components/Operations/ReceiptsTable';
import OperationModal from '../components/Operations/OperationModal';
import OperationKanban from '../components/Operations/OperationKanban';

const Receipts = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'inventory_manager';
  const { operations: receipts, isLoading, fetchOperations, createOperation, validateOperation, updateOperation } = useOperations('receipts');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="text-emerald-500" /> Receipts
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage incoming stock from vendors</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md flex items-center gap-1 ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <LayoutList size={16} /> <span className="text-xs font-bold px-1">List</span>
              </button>
              <button 
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md flex items-center gap-1 ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <Layers size={16} /> <span className="text-xs font-bold px-1">Kanban</span>
              </button>
            </div>
            {isManager && (
              <button 
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-sm shadow-primary-500/30 transition-all active:scale-95"
              >
                <Plus size={18} /> New Receipt
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : viewMode === 'list' ? (
          <ReceiptsTable receipts={receipts} isManager={isManager} onValidate={validateOperation} />
        ) : (
          <OperationKanban 
            operations={receipts} 
            type="receipt" 
            isManager={isManager} 
            onValidate={validateOperation} 
            onUpdateStatus={(id, status) => {
              if (status === 'Done') validateOperation(id);
              else updateOperation(id, { status });
            }}
          />
        )}

        {/* Create Receipt Modal */}
        <OperationModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          type="receipt" 
          onSubmit={createOperation} 
        />
      </motion.div>
    </MainLayout>
  );
};

export default Receipts;
