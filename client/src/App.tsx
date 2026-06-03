/**
 * セルフコーチングログ — App
 * Design: Field Note (Warm Analog Digital)
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WeekProvider } from "./contexts/WeekContext";
import Home from "./pages/Home";
import WeekPage from "./pages/WeekPage";
import ExportPage from "./pages/ExportPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/week/:id">
        {(params) => <WeekPage weekId={params.id} />}
      </Route>
      <Route path="/export" component={ExportPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <WeekProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </WeekProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
