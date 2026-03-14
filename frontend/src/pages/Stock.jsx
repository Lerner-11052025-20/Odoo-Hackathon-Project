import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';

import MainLayout from '../components/layout/MainLayout';
import ProductFilters from '../components/Stock/ProductFilters';
import ProductTable from '../components/Stock/ProductTable';
import AddProductModal from '../components/Stock/AddProductModal';
import EditProductModal from '../components/Stock/EditProductModal';

const Stock = () => {
  const { user } = useAuth();
  const { products, isLoading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  const isManager = user?.role === 'inventory_manager';

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [warehouse, setWarehouse] = useState('All');
  const [stockStatus, setStockStatus] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = category === 'All' ? true : p.category === category;
      const matchWarehouse = warehouse === 'All' ? true : p.warehouse === warehouse;
      let matchStatus = true;
      if (stockStatus === 'In Stock') matchStatus = p.stock > 20;
      if (stockStatus === 'Low Stock') matchStatus = p.stock > 0 && p.stock <= 20;
      if (stockStatus === 'Out of Stock') matchStatus = p.stock === 0;

      return matchSearch && matchCategory && matchWarehouse && matchStatus;
    });
  }, [products, searchTerm, category, warehouse, stockStatus]);

  const handleAddSubmit = async (data) => {
    const res = await createProduct(data);
    return res.success;
  };

  const handleEditSubmit = async (id, data) => {
    const res = await updateProduct(id, data);
    return res.success;
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1600px] mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Stock Management</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
              Manage your inventory, pricing, and operational stock levels.
            </p>
          </div>
          
          {isManager && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Product
            </button>
          )}
        </div>

        {/* Filters Bar */}
        <ProductFilters 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          category={category} setCategory={setCategory}
          warehouse={warehouse} setWarehouse={setWarehouse}
          stockStatus={stockStatus} setStockStatus={setStockStatus}
        />

        {/* Loading State or Table */}
        {isLoading ? (
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-12 flex justify-center items-center">
             <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : (
          <ProductTable 
            products={filteredProducts} 
            isManager={isManager} 
            onEdit={setEditingProduct}
            onDelete={handleDelete}
          />
        )}
      </motion.div>

      {/* Modals */}
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddSubmit}
        isManager={isManager}
      />

      <EditProductModal 
        isOpen={!!editingProduct} 
        onClose={() => setEditingProduct(null)} 
        product={editingProduct}
        onSubmit={handleEditSubmit}
        isManager={isManager}
      />
    </MainLayout>
  );
};

export default Stock;
