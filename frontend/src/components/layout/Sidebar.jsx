import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, BarChart3, Truck, ArrowLeftRight, Settings, History, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isDesktopOpen = true }) => {
  const { user } = useAuth();
  const isManager = user?.role === 'inventory_manager';

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: `/dashboard/${isManager ? 'manager' : 'staff'}`, show: true },
    { icon: Package, label: 'Stock', path: '/products', show: true },
    { icon: Truck, label: 'Operations', path: '/operations', show: true },
    { icon: ArrowLeftRight, label: 'Internal Transfers', path: '/transfers', show: true },
    { icon: History, label: 'Move History', path: '/history', show: true },
    { icon: MapPin, label: 'Warehouses', path: '/warehouses', show: true },
    { icon: Settings, label: 'Settings', path: '/settings', show: true },
  ];

  const SidebarContent = () => (
    <>
      <div className={`p-6 border-b border-slate-100 dark:border-slate-800 flex items-center transition-all ${isDesktopOpen ? 'gap-3' : 'justify-center'}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/30 shrink-0">
          <Package className="w-6 h-6 text-white" />
        </div>
        {isDesktopOpen && (
          <div className="min-w-0">
            <h1 className="font-bold text-slate-900 dark:text-white text-base tracking-tight truncate">CoreInventory</h1>
            <p className="text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-wider">
              {isManager ? 'Manager Portal' : 'Staff Portal'}
            </p>
          </div>
        )}
      </div>

      <nav className={`flex-1 ${isDesktopOpen ? 'p-4' : 'px-3 py-4'} space-y-1.5 overflow-y-auto custom-scrollbar`}>
        {menuItems.filter(i => i.show).map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            onClick={() => setIsMobileOpen?.(false)}
            title={!isDesktopOpen ? item.label : undefined}
            className={({ isActive }) =>
              `w-full flex items-center ${isDesktopOpen ? 'gap-3 px-3.5' : 'justify-center px-0'} py-3 rounded-xl text-sm font-semibold transition-all group relative overflow-hidden
                ${isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div layoutId="nav-pill" className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
                )}
                <item.icon size={18} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                {isDesktopOpen && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Storage usage widget */}
      {isDesktopOpen && (
        <div className="p-4 mx-4 mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Storage Capacity</p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-1.5">
            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">45% used across warehouses</p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isDesktopOpen ? 260 : 80 }}
        transition={{ duration: 0.3, type: 'spring', bounce: 0 }}
        className="hidden md:flex bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col fixed h-screen z-20 shadow-sm overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
