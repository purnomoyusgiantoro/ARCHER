import React from 'react'; // TAMBAHKAN INI
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data }) => {
  // Pastikan data ada sebelum render chart
  if (!data || data.length === 0) return <div className="text-white">Loading Chart...</div>;

  return (
    <div className="h-72 w-full bg-slate-900/50 rounded-3xl p-4 backdrop-blur-sm border border-slate-800">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
            itemStyle={{ color: '#eab308' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#eab308" 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;