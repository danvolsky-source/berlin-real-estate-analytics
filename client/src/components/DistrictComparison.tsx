import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DistrictComparisonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  districtIds: number[];
  cityName: string;
}

export function DistrictComparison({ open, onOpenChange, districtIds, cityName }: DistrictComparisonProps) {
  // Fetch data for all selected districts
  const districtQueries = districtIds.map(id => 
    trpc.districts.getById.useQuery({ id }, { enabled: open })
  );
  
  const isLoading = districtQueries.some(q => q.isLoading);
  const districts = districtQueries.map(q => q.data).filter(Boolean);
  
  if (!open) return null;
  
  // Prepare comparison data
  const comparisonData = [
    {
      metric: 'Population',
      ...Object.fromEntries(districts.map(d => [d!.nameEn, d!.population])),
    },
    {
      metric: 'Area (km²)',
      ...Object.fromEntries(districts.map(d => [d!.nameEn, d!.area])),
    },
    {
      metric: 'Foreign %',
      ...Object.fromEntries(districts.map(d => [d!.nameEn, d!.foreignerPercentage])),
    },
  ];
  
  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            District Comparison - {cityName}
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Side-by-side cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {districts.map((district, index) => (
                <Card key={district!.id} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: colors[index] }}>
                          {district!.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">{district!.name}</p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Population</span>
                          <span className="font-bold">{district!.population.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Area</span>
                          <span className="font-bold">{district!.area} km²</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Density</span>
                          <span className="font-bold">
                            {Math.round(district!.population / district!.area)} /km²
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Foreign residents</span>
                          <span className="font-bold">{district!.foreignerPercentage}%</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Dominant community</span>
                          <span className="font-bold">{district!.dominantCommunity}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Comparison charts */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Population Comparison</h3>
                <Card className="bg-card border-border p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[comparisonData[0]]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="metric" 
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
                        formatter={(value: number) => [value.toLocaleString(), '']}
                      />
                      <Legend />
                      {districts.map((district, index) => (
                        <Bar 
                          key={district!.id}
                          dataKey={district!.nameEn} 
                          fill={colors[index]}
                          name={district!.nameEn}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Area Comparison</h3>
                <Card className="bg-card border-border p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[comparisonData[1]]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="metric" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => [value + ' km²', '']}
                      />
                      <Legend />
                      {districts.map((district, index) => (
                        <Bar 
                          key={district!.id}
                          dataKey={district!.nameEn} 
                          fill={colors[index]}
                          name={district!.nameEn}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Foreign Residents %</h3>
                <Card className="bg-card border-border p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[comparisonData[2]]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="metric" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => [value + '%', '']}
                      />
                      <Legend />
                      {districts.map((district, index) => (
                        <Bar 
                          key={district!.id}
                          dataKey={district!.nameEn} 
                          fill={colors[index]}
                          name={district!.nameEn}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
            
            {/* Summary table */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Detailed Comparison</h3>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Metric</th>
                          {districts.map((district, index) => (
                            <th 
                              key={district!.id} 
                              className="text-left py-3 px-4 font-semibold"
                              style={{ color: colors[index] }}
                            >
                              {district!.nameEn}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">Population</td>
                          {districts.map(district => (
                            <td key={district!.id} className="py-3 px-4 font-medium">
                              {district!.population.toLocaleString()}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">Area (km²)</td>
                          {districts.map(district => (
                            <td key={district!.id} className="py-3 px-4 font-medium">
                              {district!.area}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">Density (/km²)</td>
                          {districts.map(district => (
                            <td key={district!.id} className="py-3 px-4 font-medium">
                              {Math.round(district!.population / district!.area)}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">Foreign residents %</td>
                          {districts.map(district => (
                            <td key={district!.id} className="py-3 px-4 font-medium">
                              {district!.foreignerPercentage}%
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-muted-foreground">Dominant community</td>
                          {districts.map(district => (
                            <td key={district!.id} className="py-3 px-4 font-medium">
                              {district!.dominantCommunity}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
