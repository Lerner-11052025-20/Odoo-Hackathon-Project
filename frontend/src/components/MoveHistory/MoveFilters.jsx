import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const MoveFilters = ({ filters, setFilters, warehouses }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      warehouse: ''
    });
  };

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            name="search"
            placeholder="Search reference, product..."
            value={filters.search}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
          />
        </div>

        {/* Type Filter */}
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all dark:text-white appearance-none cursor-pointer"
        >
          <option value="">All Movement Types</option>
          <option value="RECEIPT">Receipts</option>
          <option value="DELIVERY">Deliveries</option>
          <option value="ADJUSTMENT">Adjustments</option>
          <option value="TRANSFER">Internal Transfers</option>
        </select>

        {/* Warehouse Filter */}
        <select
          name="warehouse"
          value={filters.warehouse}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all dark:text-white appearance-none cursor-pointer"
        >
          <option value="">All Warehouses</option>
          {warehouses?.map(w => (
            <option key={w._id} value={w.name}>{w.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all dark:text-white appearance-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Ready">Ready</option>
          <option value="Done">Done</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
        >
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );
};

export default MoveFilters;
