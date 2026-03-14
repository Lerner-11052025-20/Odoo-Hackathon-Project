import React from 'react';
import { motion } from 'framer-motion';
import { Package, AlertCircle, TrendingDown, Truck, ArrowLeftRight, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';

import MainLayout from '../components/layout/MainLayout';
import KPICard from '../components/Dashboard/KPICard';
import OperationsSummary from '../components/Dashboard/OperationsSummary';
import InventoryCharts from '../components/Dashboard/InventoryCharts';
import RecentActivityTable from '../components/Dashboard/RecentActivityTable';

const Dashboard = () => {
  const { user } = useAuth();
  const { kpis, activity, recentOperations, isLoading } = useDashboardData();

  const isManager = user?.role === 'inventory_manager';

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading Dashboard Data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1600px] mx-auto space-y-8"
      >
        {/* Header Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Hello, <span className="gradient-text capitalize">{user?.loginId}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {isManager
              ? "Here's your inventory status and analytics for today."
              : 'Here are your pending warehouse tasks and latest operations.'}
          </p>
        </div>

        {/* KPI Cards Row (Role Based - Manager sees all) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <KPICard
            title="Total Products"
            value={kpis?.totalProducts.value || 0}
            trend={kpis?.totalProducts.trend || 0}
            status={kpis?.totalProducts.status || 'up'}
            icon={Package}
            color="from-blue-500 to-cyan-500"
            delay={0.1}
          />
          <KPICard
            title="Low Stock"
            value={kpis?.lowStock.value || 0}
            trend={kpis?.lowStock.trend || 0}
            status={kpis?.lowStock.status || 'down'}
            icon={TrendingDown}
            color="from-amber-500 to-orange-500"
            delay={0.2}
          />
          <KPICard
            title="Out of Stock"
            value={kpis?.outOfStock.value || 0}
            trend={kpis?.outOfStock.trend || 0}
            status={kpis?.outOfStock.status || 'neutral'}
            icon={AlertCircle}
            color="from-red-500 to-rose-500"
            delay={0.3}
          />
          <KPICard
            title="Pending Receipts"
            value={kpis?.pendingReceipts.value || 0}
            trend={kpis?.pendingReceipts.trend || 0}
            status={kpis?.pendingReceipts.status || 'up'}
            icon={Truck}
            color="from-emerald-500 to-green-500"
            delay={0.4}
          />
          <KPICard
            title="Internal Transfers"
            value={kpis?.internalTransfers.value || 0}
            trend={kpis?.internalTransfers.trend || 0}
            status={kpis?.internalTransfers.status || 'neutral'}
            icon={ArrowLeftRight}
            color="from-violet-500 to-purple-500"
            delay={0.5}
          />
          <KPICard
            title="Waiting Delivery"
            value={kpis?.pendingDeliveries.value || 0}
            trend={kpis?.pendingDeliveries.trend || 0}
            status={kpis?.pendingDeliveries.status || 'up'}
            icon={Clock}
            color="from-indigo-500 to-blue-500"
            delay={0.6}
          />
        </div>

        {/* Charts & Operations Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InventoryCharts data={activity || []} />
          <OperationsSummary 
            receiptData={kpis?.pendingReceipts} 
            deliveryData={kpis?.pendingDeliveries} 
          />
        </div>

        {/* Recent Operations Table Row */}
        <div className="pb-8">
          <RecentActivityTable operations={recentOperations || []} />
        </div>

      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;
