import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/layout/ui/toaster";
import { AdvancedThemeProvider } from "@/components/theme/advanced-theme-provider";
import { ResponsiveLayout } from "@/components/layout/responsive-layout";
import { EnhancedResponsiveHeader } from "@/components/layout/enhanced-responsive-header";
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
import AdminLogin from "@/pages/admin-login";
import SecretAdminAccess from "@/pages/secret-admin-access";


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
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/secret-admin" component={SecretAdminAccess} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdvancedThemeProvider defaultTheme="cinema">
        <ResponsiveLayout className="arabic-font">
          <EnhancedResponsiveHeader />
          <Navigation />
          <main className="pt-20 lg:pt-24 transition-all duration-300">
            <Router />
          </main>
          <Toaster />
        </ResponsiveLayout>
      </AdvancedThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
