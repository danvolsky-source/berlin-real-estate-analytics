import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CityProvider } from "./contexts/CityContext";
import Home from "./pages/Home";
import CityComparison from "./pages/CityComparison";
import MapView from "./pages/MapView";
import DistrictDetail from "./pages/DistrictDetail";
import Districts from "./pages/Districts";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/map" component={MapView} />
      <Route path="/comparison" component={CityComparison} />
      <Route path="/districts" component={Districts} />
      <Route path={"/district/:id"} component={DistrictDetail} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <CityProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
