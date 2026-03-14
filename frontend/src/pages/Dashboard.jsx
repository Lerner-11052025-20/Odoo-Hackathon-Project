import React from 'react';
import { Package, LogOut, User, BarChart3, Truck, ArrowLeftRight, Settings, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isManager = user?.role === 'inventory_manager';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-inter">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col shadow-sm"
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-sm">CoreInventory</h1>
              <p className="text-slate-400 text-xs">{isManager ? 'Manager Portal' : 'Staff Portal'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: BarChart3, label: 'Dashboard', active: true },
            { icon: Package, label: 'Products' },
            { icon: Truck, label: 'Operations' },
            { icon: ArrowLeftRight, label: 'Transfers' },
            { icon: History, label: 'Move History' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Profile/Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.loginId}</p>
              <p className="text-xs text-slate-400 truncate capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, <span className="gradient-text">{user?.loginId}</span>! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {isManager ? 'Here\'s your inventory overview for today.' : 'Here\'s your warehouse tasks for today.'}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Products', value: '—', icon: Package, color: 'from-blue-500 to-cyan-500' },
              { label: 'Low Stock Items', value: '—', icon: BarChart3, color: 'from-amber-500 to-orange-500' },
              { label: 'Pending Receipts', value: '—', icon: Truck, color: 'from-emerald-500 to-green-500' },
              { label: 'Int. Transfers', value: '—', icon: ArrowLeftRight, color: 'from-violet-500 to-purple-500' },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-3`}>
                  <kpi.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{kpi.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{kpi.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-8 text-center text-white">
            <div className="text-4xl mb-3">🚧</div>
            <h3 className="text-xl font-bold mb-2">Dashboard Coming Soon</h3>
            <p className="text-indigo-200 text-sm">
              Authentication is working! The full inventory dashboard is being built next.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
