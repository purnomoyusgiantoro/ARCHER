import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="h-72 w-full flex items-center justify-center bg-white border-4 border-black text-black font-black uppercase text-xl animate-pulse shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      [ MEMUAT DATA PASAR ]
    </div>
  );

  // Mencari nilai min & max untuk YAxis 
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const buffer = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-96 w-full bg-white relative p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>

          <CartesianGrid
            strokeDasharray="0"
            stroke="#000"
            strokeWidth={2}
          />

          <XAxis
            dataKey="time"
            stroke="#000"
            tick={{ fill: '#000', fontSize: 12, fontWeight: '900', fontFamily: 'monospace' }}
            tickLine={{ stroke: '#000', strokeWidth: 2 }}
            axisLine={{ stroke: '#000', strokeWidth: 4 }}
            minTickGap={40}
            tickMargin={10}
          />

          <YAxis
            domain={[minPrice - buffer, maxPrice + buffer]}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            stroke="#000"
            tick={{ fill: '#000', fontSize: 12, fontWeight: '900', fontFamily: 'monospace' }}
            tickLine={{ stroke: '#000', strokeWidth: 2 }}
            axisLine={{ stroke: '#000', strokeWidth: 4 }}
            width={85}
            tickMargin={10}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#FFD700',
              border: '4px solid #000',
              borderRadius: '0px',
              boxShadow: '8px 8px 0px rgba(0,0,0,1)',
              color: '#000',
              fontWeight: '900',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif'
            }}
            itemStyle={{ color: '#000', fontWeight: '900', fontSize: '18px' }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
            labelStyle={{ color: '#000', marginBottom: '8px', borderBottom: '2px solid #000', paddingBottom: '4px' }}
          />

          <Area
            type="step"
            dataKey="price"
            stroke="#000"
            fill="#00E5FF"
            fillOpacity={1}
            strokeWidth={4}
            activeDot={{ stroke: '#000', strokeWidth: 4, r: 6, fill: '#FF5722' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;