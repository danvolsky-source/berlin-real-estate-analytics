import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, Church, Building2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportCityDataToCSV } from "@/lib/csvExport";
import { toast } from "sonner";
import { Link } from "wouter";
import { useCity } from "@/contexts/CityContext";
import CitySelector from "@/components/CitySelector";
import { TrendChartModal } from "@/components/TrendChartModal";
import { useState } from "react";

interface CommunityData {
  name: string;
  latestPercentage: number;
  progression: Array<{ year: number; population: number }>;
}

function SparklineGraph({ data, onClick }: { data: Array<{ year: number; population: number }>; onClick?: () => void }) {
  if (data.length === 0) return null;
  
  const values = data.map(d => d.population);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  
  // Create SVG path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.population - min) / range) * 100;
    return `${x},${y}`;
  });
  
  const pathData = `M ${points.join(" L ")}`;
  
  // Determine color based on trend
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const isIncreasing = lastValue > firstValue;
  const isDecreasing = lastValue < firstValue;
  
  const strokeColor = isIncreasing 
    ? "rgb(34 197 94)" // green
    : isDecreasing 
    ? "rgb(239 68 68)" // red
    : "rgb(156 163 175)"; // gray
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-24 h-8 cursor-pointer hover:opacity-80 transition-opacity" 
      preserveAspectRatio="none"
      onClick={onClick}
      role="button"
      aria-label="Click to view detailed chart"
    >
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function ProgressionIndicator({ data }: { data: Array<{ year: number; population: number }> }) {
  if (data.length < 2) return null;
  
  const firstValue = data[0].population;
  const lastValue = data[data.length - 1].population;
  const change = ((lastValue - firstValue) / firstValue) * 100;
  
  const isIncreasing = change > 0.5;
  const isDecreasing = change < -0.5;
  
  const Icon = isIncreasing ? TrendingUp : isDecreasing ? TrendingDown : Minus;
  const colorClass = isIncreasing 
    ? "text-green-500" 
    : isDecreasing 
    ? "text-red-500" 
    : "text-gray-400";
  
  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">
        {change > 0 ? "+" : ""}{change.toFixed(1)}% in {data.length} years
      </span>
    </div>
  );
}

export default function Home() {
  const { selectedCity } = useCity();
  const currentYear = 2024;
  const [selectedCommunity, setSelectedCommunity] = useState<{ name: string; data: Array<{ year: number; population: number }> } | null>(null);
  
  const { data: summaryData, isLoading: summaryLoading } = trpc.demographics.citySummary.useQuery({
    city: selectedCity,
    year: currentYear,
  });
  
  const { data: communityData, isLoading: communityLoading } = trpc.demographics.communityComposition.useQuery({ city: selectedCity });
  
  const handleExportCSV = () => {
    if (!summaryData || !communityData) {
      toast.error("Data not loaded yet. Please wait.");
      return;
    }
    
    exportCityDataToCSV({
      cityName: selectedCity,
      population: summaryData.current?.totalPopulation || 0,
      communities: communityData.map(c => {
        const firstYear = c.progression[0]?.population || 0;
        const lastYear = c.progression[c.progression.length - 1]?.population || 0;
        const trend = firstYear > 0 ? ((lastYear - firstYear) / firstYear) * 100 : 0;
        
        return {
          name: c.name,
          percentage: c.latestPercentage,
          trend: trend,
          year: c.progression[c.progression.length - 1]?.year || currentYear,
        };
      }),
      infrastructure: [
        { type: 'Mosques', count: summaryData.current?.mosquesCount || 0, yearOverYearChange: mosquesChange },
        { type: 'Churches', count: summaryData.current?.churchesCount || 0, yearOverYearChange: churchesChange },
        { type: 'Synagogues', count: summaryData.current?.synagoguesCount || 0, yearOverYearChange: synagoguesChange },
      ],
    });
    
    toast.success(`Exported ${selectedCity} demographic data to CSV`);
  };
  
  console.log("Community data:", communityData);
  console.log("Community loading:", communityLoading);
  
  const { data: districts, isLoading: districtsLoading } = trpc.districts.list.useQuery({ city: selectedCity });
  
  // Calculate year-over-year changes
  const mosquesChange = summaryData?.current && summaryData?.previous
    ? ((summaryData.current.mosquesCount - summaryData.previous.mosquesCount) / summaryData.previous.mosquesCount) * 100
    : 0;
    
  const churchesChange = summaryData?.current && summaryData?.previous
    ? ((summaryData.current.churchesCount - summaryData.previous.churchesCount) / summaryData.previous.churchesCount) * 100
    : 0;
    
  const synagoguesChange = summaryData?.current && summaryData?.previous
    ? ((summaryData.current.synagoguesCount - summaryData.previous.synagoguesCount) / summaryData.previous.synagoguesCount) * 100
    : 0;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Berlin Real Estate Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Demographic insights and property market analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              <CitySelector />
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={!summaryData || !communityData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <nav className="flex gap-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
                Home
              </Link>
              <Link href="/map" className="text-muted-foreground hover:text-primary transition-colors">
                Map
              </Link>
              <Link href="/comparison" className="text-muted-foreground hover:text-primary transition-colors">
                Compare Cities
              </Link>
              <Link href="/districts" className="text-muted-foreground hover:text-primary transition-colors">
                Districts
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container py-12">
        {/* Demographic Snapshot */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Demographic Snapshot: {selectedCity}</h2>
          
          {/* Religious Infrastructure */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Religious Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {summaryLoading ? (
                <>
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </>
              ) : (
                <>
                  <Card className="bg-card/50 border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-chart-1/20">
                              <img src="/mosque-icon.png" alt="Mosque" className="w-8 h-8" />
                            </div>
                            <div>
                              <p className="text-3xl font-bold">{summaryData?.current?.mosquesCount || 0}</p>
                              <p className="text-sm text-muted-foreground">Mosques</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 text-sm ${mosquesChange > 0 ? "text-green-500" : "text-gray-400"}`}>
                            {mosquesChange > 0 && <TrendingUp className="w-4 h-4" />}
                            {mosquesChange === 0 && <Minus className="w-4 h-4" />}
                            <span>{mosquesChange > 0 ? "+" : ""}{mosquesChange.toFixed(1)}% vs. last year</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-chart-2/20">
                              <img src="/church-icon.png" alt="Church" className="w-8 h-8" />
                            </div>
                            <div>
                              <p className="text-3xl font-bold">{summaryData?.current?.churchesCount || 0}</p>
                              <p className="text-sm text-muted-foreground">Churches</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 text-sm ${churchesChange > 0 ? "text-green-500" : "text-gray-400"}`}>
                            {churchesChange > 0 && <TrendingUp className="w-4 h-4" />}
                            {churchesChange === 0 && <Minus className="w-4 h-4" />}
                            <span>{churchesChange > 0 ? "+" : ""}{churchesChange.toFixed(1)}% vs. last year</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-chart-3/20">
                              <img src="/synagogue-icon.png" alt="Synagogue" className="w-8 h-8" />
                            </div>
                            <div>
                              <p className="text-3xl font-bold">{summaryData?.current?.synagoguesCount || 0}</p>
                              <p className="text-sm text-muted-foreground">Synagogues</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 text-sm text-gray-400`}>
                            <Minus className="w-4 h-4" />
                            <span>stable</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
          
          {/* Community Composition */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Community Composition</h3>
            <Card className="bg-card/50 border-border">
              <CardContent className="pt-6">
                {communityLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="grid grid-cols-[1fr_100px_200px_200px] gap-4 pb-3 border-b border-border text-sm text-muted-foreground font-medium">
                      <div>Community Name</div>
                      <div>Population %</div>
                      <div>Trend</div>
                      <div>Progression (Last 5 Years)</div>
                    </div>
                    {communityData?.map((community: CommunityData) => (
                      <div
                        key={community.name}
                        className="grid grid-cols-[1fr_100px_200px_200px] gap-4 py-4 border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors rounded-lg px-2"
                      >
                        <div className="font-medium">{community.name}</div>
                        <div className="text-2xl font-bold">{community.latestPercentage.toFixed(1)}%</div>
                        <div>
                          <SparklineGraph 
                            data={community.progression} 
                            onClick={() => setSelectedCommunity({ name: community.name, data: community.progression })}
                          />
                        </div>
                        <div>
                          <ProgressionIndicator data={community.progression} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Trend Chart Modal */}
        <TrendChartModal
          open={!!selectedCommunity}
          onOpenChange={(open) => !open && setSelectedCommunity(null)}
          communityName={selectedCommunity?.name || ''}
          data={selectedCommunity?.data || []}
          cityName={selectedCity}
        />
        
        {/* Districts Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Berlin Districts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districtsLoading ? (
              <>
                <Skeleton key="skeleton-1" className="h-40" />
                <Skeleton key="skeleton-2" className="h-40" />
                <Skeleton key="skeleton-3" className="h-40" />
              </>
            ) : (
              districts?.map((district) => (
                <Link key={district.id} href={`/district/${district.id}`}>
                  <Card className="bg-card/50 border-border hover:border-primary/50 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle>{district.nameEn}</CardTitle>
                      <CardDescription>
                        Population: {district.population.toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Area:</span>
                          <span className="font-medium">{district.area} km²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Foreign residents:</span>
                          <span className="font-medium">{district.foreignerPercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dominant community:</span>
                          <span className="font-medium">{district.dominantCommunity}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container py-8">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>© 2024 Berlin Real Estate Analytics. Data visualization platform.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
