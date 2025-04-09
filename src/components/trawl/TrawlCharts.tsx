
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart3, LineChart as LineChartIcon, Timer } from 'lucide-react';

interface TrawlDataPoint {
  time: string;
  sensor1Depth: number;
  sensor2Depth: number;
  seabedDistance: number;
}

interface TrawlChartsProps {
  data: TrawlDataPoint[];
}

const TrawlCharts = ({ data }: TrawlChartsProps) => {
  const [activeTab, setActiveTab] = useState('depth');

  // Format the timestamp for display
  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  // Configure chart colors
  const chartConfig = {
    sensor1: {
      label: 'Sensor 1',
      color: '#3b82f6', // blue
    },
    sensor2: {
      label: 'Sensor 2',
      color: '#10b981', // green
    },
    seabed: {
      label: 'Seabed Distance',
      color: '#f59e0b', // amber
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[280px]">
      <div className="w-full h-full">
        <h3 className="text-md font-medium mb-2 text-gray-300">Gear Position Trend</h3>
        <div className="h-[240px] bg-slate-800/70 rounded-md p-2">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#6b7280" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatTime} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }} 
                  axisLine={{ stroke: '#6b7280' }}
                  tickLine={{ stroke: '#6b7280' }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}m`} 
                  domain={['dataMin - 20', 'dataMax + 20']} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#6b7280' }}
                  tickLine={{ stroke: '#6b7280' }}
                />
                <Tooltip content={<ChartTooltipContent hideLabel={false} />} />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }} />
                <Line 
                  type="monotone" 
                  dataKey="sensor1Depth" 
                  name="Sensor 1" 
                  stroke={chartConfig.sensor1.color} 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 5 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="sensor2Depth" 
                  name="Sensor 2" 
                  stroke={chartConfig.sensor2.color} 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
      
      <div className="w-full h-full">
        <h3 className="text-md font-medium mb-2 text-gray-300">Distance History</h3>
        <div className="h-[240px] bg-slate-800/70 rounded-md p-2">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#6b7280" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatTime} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#6b7280' }}
                  tickLine={{ stroke: '#6b7280' }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}m`}
                  domain={[0, 'dataMax + 20']}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#6b7280' }}
                  tickLine={{ stroke: '#6b7280' }}
                />
                <Tooltip content={<ChartTooltipContent hideLabel={false} />} />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }} />
                <Line 
                  type="monotone" 
                  dataKey="seabedDistance" 
                  name="Seabed Distance" 
                  stroke={chartConfig.seabed.color} 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default TrawlCharts;
