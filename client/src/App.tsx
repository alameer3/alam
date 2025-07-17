import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { YemenThemeProvider } from "@/components/theme/yemen-theme-provider";
import AuthenticHeader from "@/components/layout/authentic-header";
import AuthenticFooter from "@/components/layout/authentic-footer";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import NotFound from "@/pages/not-found";
import AuthenticHomepage from "@/components/home/authentic-homepage";
import OnesPage from "@/pages/ones";
import AkSvMovies from "@/pages/ak-sv-movies";
import Series from "@/pages/series";
import Search from "@/pages/search";
import ContentDetail from "@/pages/content-detail";
import AkSvMovieDetail from "@/pages/ak-sv-movie-detail";
import SeriesDetail from "@/pages/series-detail";

import Login from "@/pages/login";
import Register from "@/pages/register";
import Profile from "@/pages/profile";
import Watchlists from "@/pages/watchlists";
import Notifications from "@/pages/notifications";
import Admin from "@/pages/admin";
import Trailers from "@/pages/trailers";
import Programs from "@/pages/programs";
import Games from "@/pages/games";
import Applications from "@/pages/applications";
import Theater from "@/pages/theater";
import Wrestling from "@/pages/wrestling";
import Sports from "@/pages/sports";
import Recent from "@/pages/recent";
import Watch from "@/pages/watch";


function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthenticHomepage} />
      <Route path="/ones" component={OnesPage} />
      <Route path="/movies" component={AkSvMovies} />
      <Route path="/series" component={Series} />
      <Route path="/television" component={Series} />
      <Route path="/shows" component={Programs} />
      <Route path="/misc" component={Programs} />
      <Route path="/misc-content" component={Programs} />
      <Route path="/mix" component={Programs} />
      <Route path="/search" component={Search} />
      <Route path="/content/:id" component={ContentDetail} />
      <Route path="/movie/:id/:title?" component={AkSvMovieDetail} />
      <Route path="/series/:id/:title?" component={SeriesDetail} />
      <Route path="/program/:id/:title?" component={ContentDetail} />
      <Route path="/game/:id/:title?" component={ContentDetail} />
      <Route path="/application/:id/:title?" component={ContentDetail} />
      <Route path="/theater/:id/:title?" component={ContentDetail} />
      <Route path="/wrestling/:id/:title?" component={ContentDetail} />
      <Route path="/sports/:id/:title?" component={ContentDetail} />
      
      {/* صفحات المشاهدة والمحتوى الجديد */}
      <Route path="/watch/:id/:episodeId?/:title?" component={Watch} />
      <Route path="/recent" component={Recent} />
      
      {/* الأقسام الجديدة */}
      <Route path="/programs" component={Programs} />
      <Route path="/games" component={Games} />
      <Route path="/applications" component={Applications} />
      <Route path="/theater" component={Theater} />
      <Route path="/wrestling" component={Wrestling} />
      <Route path="/sports" component={Sports} />

      {/* المسارات المحمية - تحتاج authentication */}
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route path="/watchlists" component={Watchlists} />
      <Route path="/notifications" component={Notifications} />
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
      {isHomePage && <AuthenticHeader />}
      {!isHomePage && <AuthenticHeader />}
      <main>
        <Router />
      </main>
      {!isHomePage && <AuthenticFooter />}
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
