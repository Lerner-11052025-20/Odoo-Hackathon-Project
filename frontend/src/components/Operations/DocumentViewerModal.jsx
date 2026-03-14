import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, Loader2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { generatePDF } from '../../utils/generatePDF';
import ReceiptDocument from './ReceiptDocument';
import DeliveryDocument from './DeliveryDocument';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const DocumentViewerModal = ({ isOpen, onClose, operationId, type, mode = 'view' }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    if (isOpen && operationId) {
      fetchOperationDetails();
    }
  }, [isOpen, operationId]);

  const fetchOperationDetails = async () => {
    setLoading(true);
    try {
      const endpoint = type === 'receipt' ? `/operations/receipts/${operationId}` : `/operations/deliveries/${operationId}`;
      const { data } = await api.get(endpoint);
      setData(data.data);
    } catch (error) {
      toast.error('Failed to load document details');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data && !loading && isOpen) {
        if (mode === 'print') {
            setTimeout(() => handlePrint(), 1000);
        } else if (mode === 'download') {
            setTimeout(() => handleDownload(), 1000);
        }
    }
  }, [data, loading, mode, isOpen]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: data ? `${data.reference}_Document` : 'Document',
  });

  const handleDownload = async () => {
    if (!data) return;
    toast.loading('Generating PDF...', { id: 'pdf-gen' });
    await generatePDF('printable-document', data.reference);
    toast.success('PDF Downloaded', { id: 'pdf-gen' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl bg-slate-100 dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
        >
          {/* Controls Header */}
          <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
               <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 Document Preview <span className="text-sm font-medium text-slate-400">({data?.reference || 'Loading...'})</span>
               </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrint}
                disabled={!data || loading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-primary-600 hover:text-white transition-all disabled:opacity-50"
              >
                <Printer size={18} /> Print
              </button>
              <button 
                onClick={handleDownload}
                disabled={!data || loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
              >
                <Download size={18} /> Download PDF
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-12 flex justify-center bg-slate-100 dark:bg-slate-800">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20">
                <Loader2 size={40} className="animate-spin text-primary-500 mb-4" />
                <p className="text-slate-500 font-bold">Constructing Document...</p>
              </div>
            ) : (
              <div className="shadow-2xl rounded-sm w-full max-w-[8.5in] bg-white origin-top scale-[0.85] lg:scale-100">
                <div id="printable-document">
                   {type === 'receipt' ? (
                     <ReceiptDocument ref={componentRef} data={data} />
                   ) : (
                     <DeliveryDocument ref={componentRef} data={data} />
                   )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DocumentViewerModal;
