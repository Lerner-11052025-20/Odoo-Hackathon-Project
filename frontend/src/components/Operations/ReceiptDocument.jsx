import React, { forwardRef } from 'react';
import { Package } from 'lucide-react';

const ReceiptDocument = forwardRef(({ data }, ref) => {
  if (!data) return null;

  const { reference, supplier, warehouse, scheduledDate, status, products, createdBy, createdAt } = data;

  return (
    <div ref={ref} className="p-12 bg-white text-slate-900 font-sans min-h-[11in] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
            <Package className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">CoreInventory</h1>
            <p className="text-xs text-slate-500 font-medium">Professional Inventory Management System</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-300 uppercase leading-none mb-1">Receipt</h2>
          <p className="text-sm font-bold text-slate-600">{reference}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Supplier / Source</label>
            <p className="text-lg font-bold text-slate-800">{supplier}</p>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Destination Warehouse</label>
            <p className="text-base font-semibold text-slate-700">{warehouse}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Date</label>
            <p className="text-sm font-semibold">{new Date(scheduledDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Status</label>
            <p className={`text-sm font-bold uppercase ${status === 'Done' ? 'text-emerald-600' : 'text-amber-600'}`}>{status}</p>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Created By</label>
            <p className="text-sm font-semibold">{createdBy?.loginId || 'System'}</p>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Generation Date</label>
            <p className="text-sm font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="flex-grow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="py-3 px-4 text-left text-[10px] font-bold uppercase text-slate-500">Product Name</th>
              <th className="py-3 px-4 text-left text-[10px] font-bold uppercase text-slate-500">SKU</th>
              <th className="py-3 px-4 text-center text-[10px] font-bold uppercase text-slate-500">Quantity</th>
              <th className="py-3 px-4 text-center text-[10px] font-bold uppercase text-slate-500">Unit</th>
              <th className="py-3 px-4 text-left text-[10px] font-bold uppercase text-slate-500">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((item, idx) => (
              <tr key={idx} className="text-sm">
                <td className="py-4 px-4 font-bold text-slate-800">{item.product?.name || 'Unknown Product'}</td>
                <td className="py-4 px-4 font-mono text-xs text-slate-500">{item.product?.sku || 'N/A'}</td>
                <td className="py-4 px-4 text-center font-black">{item.quantity}</td>
                <td className="py-4 px-4 text-center text-slate-500 uppercase text-xs font-bold">{item.product?.unit || 'Units'}</td>
                <td className="py-4 px-4 text-slate-600">{warehouse} / Stock</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-12 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-24">
          <div className="space-y-4">
            <p className="text-xs text-slate-400 italic">
              "This is a system generated document. All quantities are verified against warehouse log entries."
            </p>
            <div className="pt-8">
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Generated On</p>
              <p className="text-xs font-semibold">{new Date().toLocaleString()}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-end">
            <div className="w-48 border-b border-slate-900 pb-1 mb-2"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-900">Authorized Signature</p>
          </div>
        </div>
      </div>
      
      <div className="mt-auto text-center pt-8">
        <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em] font-medium">CoreInventory System Document Ref: {reference}</p>
      </div>
    </div>
  );
});

ReceiptDocument.displayName = 'ReceiptDocument';

export default ReceiptDocument;
