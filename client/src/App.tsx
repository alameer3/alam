import { Route, Switch } from 'wouter';
import Layout from './components/layout/Layout';
import './index.css';

// الصفحات
import HomePage from './pages/home';
import OnesPage from './pages/ones';
import MoviesPage from './pages/movies';
import SeriesPage from './pages/series';
import ShowsPage from './pages/shows';
import MixPage from './pages/mix';

function App() {
  return (
    <div className="App" dir="rtl">
      <Layout>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/ones" component={OnesPage} />
          <Route path="/movies" component={MoviesPage} />
          <Route path="/series" component={SeriesPage} />
          <Route path="/shows" component={ShowsPage} />
          <Route path="/mix" component={MixPage} />
          <Route component={() => (
            <div className="container mx-auto py-20 text-center">
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <p className="text-xl text-gray-300 mb-8">الصفحة غير موجودة</p>
              <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                العودة للرئيسية
              </a>
            </div>
          )} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;