import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from 'recharts';

const MovementLineChart = ({ data }) => {
  // Process data for the chart if needed
  // Data format expected: [{ name: '2023-01-01', RECEIPT: 10, DELIVERY: 5, ADJUSTMENT: 2 }]
  
  if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center text-slate-400 font-bold">Waiting for operations data...</div>;

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
            contentStyle={{ 
              backgroundColor: '#1E293B', 
              borderRadius: '12px', 
              border: 'none',
              color: '#fff',
              fontSize: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="RECEIPT" 
            name="Incoming"
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRec)" 
            animationDuration={2000}
          />
          <Area 
            type="monotone" 
            dataKey="DELIVERY" 
            name="Outgoing"
            stroke="#ef4444" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorDel)" 
            animationDuration={2000}
            animationBegin={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MovementLineChart;
