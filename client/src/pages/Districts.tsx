import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useCity } from "@/contexts/CityContext";
import CitySelector from "@/components/CitySelector";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, X, GitCompare } from "lucide-react";
import { DistrictComparison } from "@/components/DistrictComparison";
import { Checkbox } from "@/components/ui/checkbox";

export default function Districts() {
  const { selectedCity } = useCity();
  const { data: districts, isLoading } = trpc.districts.list.useQuery({ city: selectedCity });
  
  const [filters, setFilters] = useState({
    minMosques: '',
    maxMosques: '',
    minChurches: '',
    maxChurches: '',
    minSynagogues: '',
    maxSynagogues: '',
  });
  
  const [filtersActive, setFiltersActive] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  
  const toggleDistrictSelection = (districtId: number) => {
    setSelectedForComparison(prev => {
      if (prev.includes(districtId)) {
        return prev.filter(id => id !== districtId);
      } else if (prev.length < 3) {
        return [...prev, districtId];
      }
      return prev;
    });
  };
  
  const openComparison = () => {
    if (selectedForComparison.length >= 2) {
      setComparisonOpen(true);
    }
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const applyFilters = () => {
    setFiltersActive(true);
  };
  
  const clearFilters = () => {
    setFilters({
      minMosques: '',
      maxMosques: '',
      minChurches: '',
      maxChurches: '',
      minSynagogues: '',
      maxSynagogues: '',
    });
    setFiltersActive(false);
  };
  
  // Filter districts based on criteria
  const filteredDistricts = districts?.filter(district => {
    if (!filtersActive) return true;
    
    // Get infrastructure counts from district data
    // Note: We'll need to add this data to the district query
    // For now, we'll use placeholder logic
    const mosquesCount = 0; // TODO: Add actual count from API
    const churchesCount = 0; // TODO: Add actual count from API
    const synagoguesCount = 0; // TODO: Add actual count from API
    
    if (filters.minMosques && mosquesCount < parseInt(filters.minMosques)) return false;
    if (filters.maxMosques && mosquesCount > parseInt(filters.maxMosques)) return false;
    if (filters.minChurches && churchesCount < parseInt(filters.minChurches)) return false;
    if (filters.maxChurches && churchesCount > parseInt(filters.maxChurches)) return false;
    if (filters.minSynagogues && synagoguesCount < parseInt(filters.minSynagogues)) return false;
    if (filters.maxSynagogues && synagoguesCount > parseInt(filters.maxSynagogues)) return false;
    
    return true;
  });
  
  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  
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
            </div>
            <nav className="flex gap-6">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/map" className="text-muted-foreground hover:text-primary transition-colors">
                Map
              </Link>
              <Link href="/comparison" className="text-muted-foreground hover:text-primary transition-colors">
                Compare Cities
              </Link>
              <Link href="/districts" className="text-foreground hover:text-primary transition-colors font-medium">
                Districts
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Districts in {selectedCity}</h2>
            <p className="text-muted-foreground">
              Explore demographic data and infrastructure for each district
            </p>
          </div>
          {selectedForComparison.length >= 2 && (
            <Button onClick={openComparison}>
              <GitCompare className="w-4 h-4 mr-2" />
              Compare {selectedForComparison.length} Districts
            </Button>
          )}
        </div>
        
        {/* Filters */}
        <Card className="mb-8 bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <CardTitle>Filter by Infrastructure</CardTitle>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
            <CardDescription>
              Filter districts by the number of religious buildings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mosques Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <img src="/mosque-icon.png" alt="Mosque" className="w-6 h-6" />
                  <Label className="font-semibold">Mosques</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="minMosques" className="text-xs text-muted-foreground">Min</Label>
                    <Input
                      id="minMosques"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={filters.minMosques}
                      onChange={(e) => handleFilterChange('minMosques', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxMosques" className="text-xs text-muted-foreground">Max</Label>
                    <Input
                      id="maxMosques"
                      type="number"
                      min="0"
                      placeholder="Any"
                      value={filters.maxMosques}
                      onChange={(e) => handleFilterChange('maxMosques', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Churches Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <img src="/church-icon.png" alt="Church" className="w-6 h-6" />
                  <Label className="font-semibold">Churches</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="minChurches" className="text-xs text-muted-foreground">Min</Label>
                    <Input
                      id="minChurches"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={filters.minChurches}
                      onChange={(e) => handleFilterChange('minChurches', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxChurches" className="text-xs text-muted-foreground">Max</Label>
                    <Input
                      id="maxChurches"
                      type="number"
                      min="0"
                      placeholder="Any"
                      value={filters.maxChurches}
                      onChange={(e) => handleFilterChange('maxChurches', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Synagogues Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <img src="/synagogue-icon.png" alt="Synagogue" className="w-6 h-6" />
                  <Label className="font-semibold">Synagogues</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="minSynagogues" className="text-xs text-muted-foreground">Min</Label>
                    <Input
                      id="minSynagogues"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={filters.minSynagogues}
                      onChange={(e) => handleFilterChange('minSynagogues', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxSynagogues" className="text-xs text-muted-foreground">Max</Label>
                    <Input
                      id="maxSynagogues"
                      type="number"
                      min="0"
                      placeholder="Any"
                      value={filters.maxSynagogues}
                      onChange={(e) => handleFilterChange('maxSynagogues', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button onClick={applyFilters} disabled={!hasActiveFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              {filtersActive && (
                <div className="flex items-center text-sm text-muted-foreground">
                  Showing {filteredDistricts?.length || 0} of {districts?.length || 0} districts
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Districts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </>
          ) : filteredDistricts && filteredDistricts.length > 0 ? (
            filteredDistricts.map((district) => (
              <div key={district.id} className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <Checkbox
                    checked={selectedForComparison.includes(district.id)}
                    onCheckedChange={() => toggleDistrictSelection(district.id)}
                    disabled={!selectedForComparison.includes(district.id) && selectedForComparison.length >= 3}
                    aria-label={`Select ${district.nameEn} for comparison`}
                  />
                </div>
                <Link href={`/district/${district.id}`}>
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
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                No districts match your filter criteria. Try adjusting the filters.
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* District Comparison Modal */}
      <DistrictComparison
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        districtIds={selectedForComparison}
        cityName={selectedCity}
      />
      
      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container py-8">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>© 2024 Berlin Real Estate Analytics. Data visualization platform.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
