import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceArea, ReferenceLine, Label
} from 'recharts';

interface PriceChartProps {
    data: any[];
    liquidity: {
        top: { start: number; end: number };
        bottom: { start: number; end: number };
    };
    targets?: { 
        high: number; 
        low: number;
        entryRange: { min: number; max: number };
        stopLoss: number;
    };
    isLoading: boolean;
}

const LoadingState = () => (
  <div className="h-96 w-full flex flex-col items-center justify-center gap-4 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
    <div className="w-10 h-10 border-4 border-black border-t-[#00E5FF] rounded-full animate-spin" />
    <p className="text-black font-black uppercase text-xs md:text-sm tracking-widest animate-pulse">
      [ MEMUAT DATA PASAR ]
    </p>
  </div>
);

const PriceChart: React.FC<PriceChartProps> = ({ data, liquidity, targets, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    return <LoadingState />;
  }

  const prices = data.map(d => d.price);
  let minPrice = Math.min(...prices);
  let maxPrice = Math.max(...prices);

  if (liquidity?.top) maxPrice = Math.max(maxPrice, liquidity.top.end);
  if (liquidity?.bottom) minPrice = Math.min(minPrice, liquidity.bottom.start);

  const range = maxPrice - minPrice;
  const buffer = range * 0.15;

  return (
    <div className="h-[400px] md:h-[500px] w-full bg-white relative p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>

          <XAxis
            dataKey="time"
            stroke="#000"
            tick={{ fill: '#000', fontSize: 10, fontWeight: '900', fontFamily: 'monospace' }}
            tickLine={{ stroke: '#000', strokeWidth: 2 }}
            axisLine={{ stroke: '#000', strokeWidth: 4 }}
            minTickGap={30}
            tickMargin={10}
          />

          <YAxis
            yAxisId="left"
            domain={[minPrice - buffer, maxPrice + buffer]}
            tickFormatter={value => `$${value.toLocaleString()}`}
            stroke="#000"
            tick={{ fill: '#000', fontSize: 10, fontWeight: '900', fontFamily: 'monospace' }}
            tickLine={{ stroke: '#000', strokeWidth: 2 }}
            axisLine={{ stroke: '#000', strokeWidth: 4 }}
            width={70}
            orientation="right"
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
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#000', fontWeight: '900' }}
            formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, 'Price']}
            labelStyle={{ color: '#000', marginBottom: '8px', borderBottom: '2px solid #000', paddingBottom: '4px' }}
          />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="price"
            stroke="#000"
            fill="#F1F5F9"
            fillOpacity={1}
            strokeWidth={4}
            activeDot={{ stroke: '#000', strokeWidth: 4, r: 6, fill: '#FF5722' }}
            animationDuration={1000}
          />

          {/* Liquidity Pools - Highlighted Red Blocks */}
          {liquidity?.top && (
            <ReferenceArea
              yAxisId="left"
              y1={Math.min(liquidity.top.start, liquidity.top.end)}
              y2={Math.max(liquidity.top.start, liquidity.top.end)}
              fill="#FF0000"
              fillOpacity={0.2}
              stroke="#FF0000"
              strokeWidth={2}
            >
              <Label 
                value="LIQUIDITY ZONE (HIGH)" 
                position="insideTopRight" 
                fill="#FF0000" 
                fontSize={10} 
                fontWeight="900" 
                offset={10}
              />
            </ReferenceArea>
          )}

          {liquidity?.bottom && (
            <ReferenceArea
              yAxisId="left"
              y1={Math.min(liquidity.bottom.start, liquidity.bottom.end)}
              y2={Math.max(liquidity.bottom.start, liquidity.bottom.end)}
              fill="#FF0000"
              fillOpacity={0.15}
              stroke="#FF0000"
              strokeWidth={2}
              strokeDasharray="5 5"
            >
              <Label 
                value="LIQUIDITY ZONE (LOW)" 
                position="insideBottomRight" 
                fill="#FF0000" 
                fontSize={10} 
                fontWeight="900" 
                offset={10}
              />
            </ReferenceArea>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
