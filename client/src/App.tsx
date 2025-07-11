import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/layout/ui/toaster";
import { TooltipProvider } from "@/components/layout/ui/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Movies from "@/pages/movies";
import Series from "@/pages/series";
import Television from "@/pages/television";
import Miscellaneous from "@/pages/miscellaneous";
import Search from "@/pages/search";
import ContentDetail from "@/pages/content-detail";
import Admin from "@/pages/admin";
import AdminDashboard from "@/pages/admin-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/movies" component={Movies} />
      <Route path="/series" component={Series} />
      <Route path="/television" component={Television} />
      <Route path="/miscellaneous" component={Miscellaneous} />
      <Route path="/search" component={Search} />
      <Route path="/content/:id" component={ContentDetail} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="cinema">
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground arabic-font">
            <Header />
            <Navigation />
            <main className="pt-32">
              <Router />
            </main>
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
