
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Data Trends
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="depth" className="flex-1">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Depth Chart
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              <Timer className="h-4 w-4 mr-2" />
              Historical Data
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="depth" className="mt-0">
            <div className="h-[250px] w-full">
              <ChartContainer config={chartConfig} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={formatTime} 
                      tick={{ fontSize: 10 }} 
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}m`} 
                      domain={['dataMin - 20', 'dataMax + 20']} 
                      tick={{ fontSize: 10 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip content={<ChartTooltipContent hideLabel={false} />} />
                    <Legend />
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
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <div className="h-[250px] w-full">
              <ChartContainer config={chartConfig} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={formatTime} 
                      tick={{ fontSize: 10 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}m`}
                      domain={[0, 'dataMax + 20']}
                      tick={{ fontSize: 10 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip content={<ChartTooltipContent hideLabel={false} />} />
                    <Legend />
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrawlCharts;
