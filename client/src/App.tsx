import React from 'react';
import { Route, Switch } from 'wouter';
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
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/ones" component={OnesPage} />
        <Route path="/movies" component={MoviesPage} />
        <Route path="/series" component={SeriesPage} />
        <Route path="/shows" component={ShowsPage} />
        <Route path="/mix" component={MixPage} />
        <Route component={() => (
          <div className="container py-5 text-center">
            <h1 className="display-1">404</h1>
            <p className="fs-4">الصفحة غير موجودة</p>
            <a href="/" className="btn btn-primary">العودة للرئيسية</a>
          </div>
        )} />
      </Switch>
    </div>
  );
}

export default App;