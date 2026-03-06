import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceArea
} from 'recharts';

const LoadingState = () => (
  <div className="h-96 w-full flex flex-col items-center justify-center gap-4 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
    <div className="w-10 h-10 border-4 border-black border-t-[#00E5FF] rounded-full animate-spin" />
    <p className="text-black font-black uppercase text-sm tracking-widest animate-pulse">
      [ MEMUAT DATA PASAR ]
    </p>
  </div>
);

const PriceChart = ({ data, liquidity, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    return <LoadingState />;
  }

  const prices = data.map(d => d.price);
  let minPrice = Math.min(...prices);
  let maxPrice = Math.max(...prices);

  if (liquidity?.top) maxPrice = Math.max(maxPrice, liquidity.top.end);
  if (liquidity?.bottom) minPrice = Math.min(minPrice, liquidity.bottom.start);

  const buffer = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-96 w-full bg-white relative p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" stroke="#000" strokeWidth={2} />

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
            yAxisId="left"
            domain={[minPrice - buffer, maxPrice + buffer]}
            tickFormatter={value => `$${value.toLocaleString()}`}
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
              fontFamily: 'sans-serif',
            }}
            itemStyle={{ color: '#000', fontWeight: '900', fontSize: '18px' }}
            formatter={value => [`$${value.toLocaleString()}`, 'Price']}
            labelStyle={{ color: '#000', marginBottom: '8px', borderBottom: '2px solid #000', paddingBottom: '4px' }}
          />

          <Area
            yAxisId="left"
            type="step"
            dataKey="price"
            stroke="#000"
            fill="#00E5FF"
            fillOpacity={1}
            strokeWidth={4}
            activeDot={{ stroke: '#000', strokeWidth: 4, r: 6, fill: '#FF5722' }}
          />

          {liquidity?.top && (
            <ReferenceArea
              yAxisId="left"
              y1={Math.min(liquidity.top.start, liquidity.top.end)}
              y2={Math.max(liquidity.top.start, liquidity.top.end)}
              fill="#FF5722"
              fillOpacity={0.15}
              stroke="#FF5722"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                position: 'insideTopLeft',
                value: `SELL LIQ [ $${Math.round(liquidity.top.start).toLocaleString()} - $${Math.round(liquidity.top.end).toLocaleString()} ]`,
                fill: '#000', fontSize: 11, fontWeight: 900, fontFamily: 'monospace', textShadow: '1px 1px 0 #fff',
              }}
            />
          )}

          {liquidity?.bottom && (
            <ReferenceArea
              yAxisId="left"
              y1={Math.min(liquidity.bottom.start, liquidity.bottom.end)}
              y2={Math.max(liquidity.bottom.start, liquidity.bottom.end)}
              fill="#b4e636"
              fillOpacity={0.3}
              stroke="#8cb818"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                position: 'insideBottomLeft',
                value: `BUY LIQ [ $${Math.round(liquidity.bottom.start).toLocaleString()} - $${Math.round(liquidity.bottom.end).toLocaleString()} ]`,
                fill: '#000', fontSize: 11, fontWeight: 900, fontFamily: 'monospace', textShadow: '1px 1px 0 #fff',
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;