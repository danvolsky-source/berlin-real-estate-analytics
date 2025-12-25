import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrendData {
  year: number;
  population: number;
}

interface TrendChartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityName: string;
  data: TrendData[];
  cityName: string;
}

export function TrendChartModal({ open, onOpenChange, communityName, data, cityName }: TrendChartModalProps) {
  // Calculate statistics
  const firstValue = data[0]?.population || 0;
  const lastValue = data[data.length - 1]?.population || 0;
  const change = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  const maxPopulation = Math.max(...data.map(d => d.population));
  const minPopulation = Math.min(...data.map(d => d.population));
  
  // Format data for recharts
  const chartData = data.map(d => ({
    year: d.year.toString(),
    population: d.population,
  }));
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {communityName} Community Trend in {cityName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Current Population</p>
              <p className="text-2xl font-bold">{lastValue.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">5-Year Change</p>
              <p className={`text-2xl font-bold ${change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Peak Population</p>
              <p className="text-2xl font-bold">{maxPopulation.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [value.toLocaleString(), 'Population']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="population" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Population"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Year-by-Year Breakdown */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Year-by-Year Breakdown</h3>
            <div className="grid grid-cols-5 gap-3">
              {data.map((item, index) => {
                const prevValue = index > 0 ? data[index - 1].population : item.population;
                const yearChange = prevValue > 0 ? ((item.population - prevValue) / prevValue) * 100 : 0;
                
                return (
                  <div key={item.year} className="text-center p-2 bg-accent/20 rounded">
                    <p className="text-xs text-muted-foreground mb-1">{item.year}</p>
                    <p className="font-bold">{item.population.toLocaleString()}</p>
                    {index > 0 && (
                      <p className={`text-xs ${yearChange > 0 ? 'text-green-500' : yearChange < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        {yearChange > 0 ? '+' : ''}{yearChange.toFixed(1)}%
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
