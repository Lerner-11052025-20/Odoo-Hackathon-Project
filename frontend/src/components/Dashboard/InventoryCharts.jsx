import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="font-semibold text-slate-900 dark:text-white mb-2">{label}</p>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Inwards
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{payload[0].value}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Outwards
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{payload[1]?.value}</span>
          </div>
          {payload[2] && (
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Transfers
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{payload[2].value}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const InventoryCharts = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm col-span-1 lg:col-span-2 flex flex-col min-h-[400px]"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Stock Movement Overview</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total received vs delivered items</p>
        </div>
        
        <select className="auth-input !w-auto !py-1.5 !px-3 font-medium bg-slate-50 dark:bg-slate-800 text-xs">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInternal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} className="dark:stroke-slate-700" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              type="monotone" 
              dataKey="in" 
              stroke="#10b981" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorIn)" 
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="out" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorOut)" 
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="internal" 
              stroke="#f59e0b" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorInternal)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default InventoryCharts;
