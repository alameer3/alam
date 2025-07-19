import { Route, Switch } from 'wouter';
import './index.css';

// الصفحات الأصلية
import HomeAuthentic from './pages/HomeAuthentic';
import HomeOriginalExtracted from './pages/HomeOriginalExtracted';
import HomeOriginalExact from './pages/HomeOriginalExact';
import MoviesAuthentic from './pages/MoviesAuthentic';
import SeriesAuthentic from './pages/SeriesAuthentic';
import ShowsAuthentic from './pages/ShowsAuthentic';
import MixAuthentic from './pages/MixAuthentic';
import ContentViewAuthentic from './pages/ContentViewAuthentic';
import IconFont from './components/IconFont';

// الصفحات القديمة (للمراجع)
import Layout from './components/layout/Layout';
import HomeEnhanced from './pages/HomeEnhanced';
import HomeOriginal from './pages/HomeOriginal';
import MainMenu from './pages/MainMenu';
import MainMenuSimple from './pages/MainMenuSimple';
import OnesPage from './pages/ones';
import MoviesPage from './pages/movies';
import MoviesOriginal from './pages/MoviesOriginal';
import SeriesPage from './pages/series';
import SeriesOriginal from './pages/SeriesOriginal';
import ShowsPage from './pages/shows';
import ShowsOriginal from './pages/ShowsOriginal';
import MixPage from './pages/mix';
import MixOriginal from './pages/MixOriginal';
import ContentViewOriginal from './pages/ContentViewOriginal';

function App() {
  return (
    <div className="App" dir="rtl">
      <IconFont />
      <Switch>
        {/* الصفحات الأصلية الجديدة */}
        <Route path="/" component={HomeOriginalExact} />
        <Route path="/extracted" component={HomeOriginalExtracted} />
        <Route path="/home-original" component={HomeAuthentic} />
        <Route path="/movies" component={MoviesAuthentic} />
        <Route path="/series" component={SeriesAuthentic} />
        <Route path="/shows" component={ShowsAuthentic} />
        <Route path="/mix" component={MixAuthentic} />
        <Route path="/movie/:id" component={ContentViewAuthentic} />
        <Route path="/series/:id" component={ContentViewAuthentic} />
        <Route path="/show/:id" component={ContentViewAuthentic} />
        <Route path="/mix/:id" component={ContentViewAuthentic} />
        
        {/* الصفحات القديمة للمراجع */}
        <Route path="/old/*" component={() => (
          <Layout>
            <Switch>
              <Route path="/old/" component={HomeOriginal} />
              <Route path="/old/main" component={MainMenu} />
              <Route path="/old/home" component={HomeEnhanced} />
              <Route path="/old/ones" component={OnesPage} />
              <Route path="/old/original" component={MainMenuSimple} />
              <Route path="/old/movies" component={MoviesOriginal} />
              <Route path="/old/series" component={SeriesOriginal} />
              <Route path="/old/shows" component={ShowsOriginal} />
              <Route path="/old/mix" component={MixOriginal} />
              <Route path="/old/movie/:id" component={ContentViewOriginal} />
              <Route path="/old/series/:id" component={ContentViewOriginal} />
              <Route path="/old/show/:id" component={ContentViewOriginal} />
            </Switch>
          </Layout>
        )} />
        
        {/* صفحة 404 */}
        <Route component={() => (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <p className="text-xl text-gray-300 mb-8">الصفحة غير موجودة</p>
              <a href="/" className="text-orange-500 hover:text-orange-400 transition-colors">العودة للرئيسية</a>
            </div>
          </div>
        )} />
      </Switch>
    </div>
  );
}

export default App;