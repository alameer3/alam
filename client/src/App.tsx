import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { YemenThemeProvider } from "@/components/theme/yemen-theme-provider";
import AkSvHeader from "@/components/layout/ak-sv-header";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AkSvHomepage from "@/components/home/ak-sv-homepage";
import Ones from "@/pages/ones";
import AkSvMovies from "@/pages/ak-sv-movies";
import Series from "@/pages/series";
import Television from "@/pages/television";
import Shows from "@/pages/shows";
import MiscContent from "@/pages/misc-content";
import Mix from "@/pages/mix";
import Search from "@/pages/search";
import ContentDetail from "@/pages/content-detail";
import MovieDetail from "@/pages/movie-detail";
import SeriesDetail from "@/pages/series-detail";
import ShowDetail from "@/pages/show-detail";
import MixDetail from "@/pages/mix-detail";

import SecretAdminAccess from "@/pages/secret-admin-access";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Profile from "@/pages/profile";
import Watchlists from "@/pages/watchlists";
import Notifications from "@/pages/notifications";
import Dashboard from "@/pages/dashboard";
import UnifiedAdminPanel from "@/pages/unified-admin-panel";
import Trailers from "@/pages/trailers";


function Router() {
  return (
    <Switch>
      <Route path="/" component={AkSvHomepage} />
      <Route path="/ones" component={Ones} />
      <Route path="/movies" component={AkSvMovies} />
      <Route path="/series" component={Series} />
      <Route path="/shows" component={Shows} />
      <Route path="/television" component={Television} />
      <Route path="/misc" component={MiscContent} />
      <Route path="/misc-content" component={MiscContent} />
      <Route path="/mix" component={Mix} />
      <Route path="/search" component={Search} />
      <Route path="/content/:id" component={ContentDetail} />
      <Route path="/movie/:id/:title?" component={MovieDetail} />
      <Route path="/series/:id/:title?" component={SeriesDetail} />
      <Route path="/shows/:id/:title?" component={ShowDetail} />
      <Route path="/mix/:id/:title?" component={MixDetail} />

      <Route path="/secret-admin" component={SecretAdminAccess} />
      <Route path="/unified-admin" component={UnifiedAdminPanel} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route path="/watchlists" component={Watchlists} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/trailers" component={Trailers} />


      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isHomePage = location === "/";

  return (
    <div className="min-h-screen bg-background">
      {!isHomePage && <AkSvHeader />}
      <main>
        <Router />
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YemenThemeProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </YemenThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
