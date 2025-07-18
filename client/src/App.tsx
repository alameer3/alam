import { Route, Switch } from 'wouter';
import Layout from './components/layout/Layout';
import './index.css';

// الصفحات
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
      <Layout>
        <Switch>
          <Route path="/" component={HomeOriginal} />
          <Route path="/main" component={MainMenu} />
          <Route path="/home" component={HomeEnhanced} />
          <Route path="/ones" component={OnesPage} />
          <Route path="/original" component={MainMenuSimple} />
          <Route path="/movies" component={MoviesOriginal} />
          <Route path="/series" component={SeriesOriginal} />
          <Route path="/shows" component={ShowsOriginal} />
          <Route path="/mix" component={MixOriginal} />
          <Route path="/movie/:id" component={ContentViewOriginal} />
          <Route path="/series/:id" component={ContentViewOriginal} />
          <Route path="/show/:id" component={ContentViewOriginal} />
          <Route component={() => (
            <div className="container mx-auto py-20 text-center">
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <p className="text-xl text-gray-300 mb-8">الصفحة غير موجودة</p>
              <a href="/" className="text-green-400 hover:text-green-300 transition-colors">العودة للرئيسية</a>
            </div>
          )} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;