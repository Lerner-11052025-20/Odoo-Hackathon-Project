import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const WarehouseBarChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center text-slate-400">Loading metrics...</div>;

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
            contentStyle={{ 
              backgroundColor: '#1E293B', 
              borderRadius: '12px', 
              border: 'none',
              color: '#fff',
              fontSize: '12px'
            }}
          />
          <Bar 
            dataKey="value" 
            radius={[6, 6, 0, 0]} 
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WarehouseBarChart;
