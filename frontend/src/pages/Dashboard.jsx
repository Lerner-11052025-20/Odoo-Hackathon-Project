import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Truck, 
  ArrowLeftRight, 
  Clock, 
  Layers, 
  AlertTriangle,
  Zap,
  CheckCircle2,
  Activity,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';

import MainLayout from '../components/layout/MainLayout';
import StatCard from '../components/Charts/StatCard';
import ChartContainer from '../components/Charts/ChartContainer';
import InventoryPieChart from '../components/Charts/InventoryPieChart';
import MovementLineChart from '../components/Charts/MovementLineChart';
import WarehouseBarChart from '../components/Charts/WarehouseBarChart';

const Dashboard = () => {
  const { user } = useAuth();
  const { reportData, loading, fetchAnalytics } = useAnalytics();
  const isManager = user?.role === 'inventory_manager';

  useEffect(() => {
    fetchAnalytics('dashboard');
  }, [fetchAnalytics]);

  // Process movement trends for Recharts format
  // Input: [{ _id: '2023-01-01', movements: [{ type: 'RECEIPT', count: 5 }] }]
  // Output: [{ name: '2023-01-01', RECEIPT: 5, DELIVERY: 2 }]
  const lineChartData = useMemo(() => {
    if (!reportData?.movementTrends) return [];
    return reportData.movementTrends.map(item => {
      const dataPoint = { name: item._id };
      item.movements.forEach(m => {
        dataPoint[m.type] = m.count;
      });
      return dataPoint;
    });
  }, [reportData]);

  if (loading && !reportData) {
    return (
      <MainLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-[5px] border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black tracking-widest uppercase text-xs">Analytics Intelligence Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[1600px] mx-auto space-y-8 pb-12"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Control <span className="text-primary-600">Hub</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Welcome, <span className="text-slate-900 dark:text-slate-200 font-bold">{user?.name}</span>. 
              {isManager ? " Strategic inventory insights and warehouse performance." : " Operational task tracking and warehouse movement stats."}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <div className="px-4 py-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Activity size={14} className="text-primary-500" /> Live Updates
              </div>
          </div>
        </div>

        {/* Global KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Operational Volume" 
            value={reportData?.summary?.todayOperations || 0} 
            icon={Zap} 
            color="blue" 
            trend="up" 
            trendValue={12} 
          />
          <StatCard 
            title="Pending Tasks" 
            value={reportData?.summary?.pendingTasks || 0} 
            icon={Clock} 
            color="amber" 
          />
          <StatCard 
            title="Stock Catalog" 
            value={reportData?.summary?.totalProducts || 0} 
            icon={Layers} 
            color="indigo" 
          />
          <StatCard 
            title="System Status" 
            value="Healthy" 
            icon={CheckCircle2} 
            color="emerald" 
          />
        </div>

        {/* Top Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <ChartContainer 
             title="Stock Status Distribution" 
             subtitle="Inventory Health Analysis"
             className="lg:col-span-1"
           >
             <InventoryPieChart data={reportData?.stockDistribution || []} />
           </ChartContainer>

           <ChartContainer 
             title="Movement Momentum" 
             subtitle="Inbound vs Outbound Flow"
             className="lg:col-span-2"
           >
             <MovementLineChart data={lineChartData} />
           </ChartContainer>
        </div>

        {/* Lower Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <ChartContainer 
             title="Warehouse Distribution" 
             subtitle="Capacity Utilization across nodes"
           >
             <WarehouseBarChart data={reportData?.warehouseDistribution || []} />
           </ChartContainer>

           <ChartContainer 
             title="Top Moving Products" 
             subtitle="Velocity Leaders"
           >
             <div className="space-y-4 mt-6">
               {(reportData?.topProducts || []).map((p, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center font-black text-primary-600 shadow-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Item</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-slate-900 dark:text-white">{p.moves}</p>
                       <p className="text-[10px] font-bold text-emerald-500 uppercase">Total Moves</p>
                    </div>
                 </div>
               ))}
               {!reportData?.topProducts?.length && <p className="text-center py-10 text-slate-400 font-bold">No movement data yet</p>}
             </div>
           </ChartContainer>
        </div>

        {/* Footer Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
           <div className="p-6 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl text-white shadow-xl shadow-primary-500/20">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 size={20} />
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Strategic Goal</span>
              </div>
              <p className="text-xl font-bold">Optimize Stock Buffer</p>
              <p className="text-xs mt-2 opacity-70 leading-relaxed font-medium">Reduce out-of-stock items by 15% using predictive analysis and optimized reorder levels.</p>
           </div>
           
           <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">System Up-time</p>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">99.9%</h4>
           </div>

           <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col justify-center">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Global Accuracy</p>
              <h4 className="text-2xl font-black text-primary-600 mt-1">98.4%</h4>
           </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;
