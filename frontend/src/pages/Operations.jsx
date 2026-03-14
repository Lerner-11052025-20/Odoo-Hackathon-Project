import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckSquare, RefreshCw, Layers } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ChartContainer from '../components/Charts/ChartContainer';
import InventoryPieChart from '../components/Charts/InventoryPieChart';
import MovementLineChart from '../components/Charts/MovementLineChart';
import { useAnalytics } from '../hooks/useAnalytics';
import { useEffect, useMemo } from 'react';

const Operations = () => {
  const { reportData, fetchAnalytics } = useAnalytics();

  useEffect(() => {
    fetchAnalytics('operations');
  }, [fetchAnalytics]);

  const lineChartData = useMemo(() => {
    if (!reportData?.movementTrends) return [];
    
    // Group trends by date
    const grouped = reportData.movementTrends.reduce((acc, item) => {
      if (!acc[item._id.date]) acc[item._id.date] = { name: item._id.date };
      acc[item._id.date][item._id.type] = item.count;
      return acc;
    }, {});

    return Object.values(grouped);
  }, [reportData]);
  const opCards = [
    { title: 'Receipts', icon: CheckSquare, desc: 'Incoming stock from vendors', color: 'bg-emerald-500', link: '/operations/receipts' },
    { title: 'Delivery Orders', icon: Truck, desc: 'Outgoing stock to customers', color: 'bg-blue-500', link: '/operations/deliveries' },
    { title: 'Inventory Adjustments', icon: RefreshCw, desc: 'Fix mismatch stock quantites', color: 'bg-amber-500', link: '/operations/adjustments' },
    { title: 'Internal Transfers', icon: Layers, desc: 'Move stock between locations', color: 'bg-indigo-500', link: '/operations/transfers' },
  ];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1200px] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Operations Hub</h1>
          <p className="text-slate-500 mt-2">Manage all physical movements of stock through the warehouse.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {opCards.map((card, i) => (
            <Link to={card.link} key={i}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center mb-4 ${card.color} shadow-lg shadow-${card.color.split('-')[1]}-500/30`}>
                  <card.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">{card.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{card.desc}</p>
                <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-primary-500 transition-colors">
                   Go to Operations <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Dash Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ChartContainer title="Global Status Distribution" subtitle="System-wide operation states" className="lg:col-span-1">
                 <InventoryPieChart data={reportData?.statusDistribution || []} />
            </ChartContainer>

            <ChartContainer title="Operational Velocity" subtitle="Transactions processed per day" className="lg:col-span-2">
                 <MovementLineChart data={lineChartData} />
            </ChartContainer>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Operations;
