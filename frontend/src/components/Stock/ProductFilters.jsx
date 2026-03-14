import React from 'react';
import { Search, Filter, Warehouse } from 'lucide-react';

const ProductFilters = ({ searchTerm, setSearchTerm, category, setCategory, warehouse, setWarehouse, stockStatus, setStockStatus }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center shadow-sm">
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products by Name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
        />
      </div>

      <div className="flex flex-wrap gap-3 w-full lg:w-auto">
        <div className="relative flex-1 lg:flex-none">
          <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <select 
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="w-full md:w-48 pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
          >
            <option value="All">All Locs</option>
            <option value="Main Warehouse">Main Warehouse</option>
            <option value="WH-East">WH-East</option>
            <option value="WH-West">WH-West</option>
          </select>
        </div>

        <div className="relative flex-1 lg:flex-none">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-48 pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Furniture">Furniture</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <select 
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
          className="flex-1 lg:flex-none px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
        >
          <option value="All">All Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
