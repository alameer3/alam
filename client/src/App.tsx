import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import './index.css';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import ContentGrid from './components/ContentGrid';
import MovieDetails from './components/MovieDetails';
import SeriesDetails from './components/SeriesDetails';
import ShowDetails from './components/ShowDetails';
import WatchPage from './components/WatchPage';
import SearchResults from './components/SearchResults';
import FavoritesPage from './components/FavoritesPage';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // مراقبة التمرير لتأثيرات الهيدر
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App" dir="rtl">
      {/* الهيدر */}
      <Header isScrolled={isScrolled} />

      {/* المحتوى الرئيسي */}
      <main className="main-content">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/movies" component={() => <ContentGrid contentType="movie" />} />
          <Route path="/series" component={() => <ContentGrid contentType="series" />} />
          <Route path="/shows" component={() => <ContentGrid contentType="show" />} />
          <Route path="/mix" component={() => <ContentGrid contentType="mix" />} />
          <Route path="/movie/:id" component={MovieDetails} />
          <Route path="/series/:id" component={SeriesDetails} />
          <Route path="/show/:id" component={ShowDetails} />
          <Route path="/watch/:type/:id" component={WatchPage} />
          <Route path="/search" component={SearchResults} />
          <Route path="/favorite" component={FavoritesPage} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={() => (
            <div className="container py-5 text-center">
              <h1 className="display-1">404</h1>
              <p className="fs-4">الصفحة غير موجودة</p>
              <a href="/" className="btn btn-primary">العودة للرئيسية</a>
            </div>
          )} />
        </Switch>
      </main>

      {/* الفوتر */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h3 className="h5 text-primary mb-3">اكوام</h3>
              <p className="text-muted">
                شمس المواقع، الموقع العربي الأول لتحميل ومشاهدة الأفلام والمسلسلات والبرامج
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <h3 className="h5 text-primary mb-3">روابط مهمة</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/contactus" className="text-muted text-decoration-none">تواصل معنا</a>
                </li>
                <li className="mb-2">
                  <a href="/dmca" className="text-muted text-decoration-none">حقوق الطبع والنشر</a>
                </li>
                <li className="mb-2">
                  <a href="/ad-policy" className="text-muted text-decoration-none">سياسة الإعلانات</a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h3 className="h5 text-primary mb-3">تابعنا</h3>
              <div className="d-flex gap-3">
                <a href="https://facebook.com/akwamofficial" className="text-muted text-decoration-none" target="_blank" rel="noopener noreferrer">
                  <i className="icon-facebook"></i> فيسبوك
                </a>
                <a href="https://youtube.com/akwamofficial" className="text-muted text-decoration-none" target="_blank" rel="noopener noreferrer">
                  <i className="icon-youtube"></i> يوتيوب
                </a>
              </div>
            </div>
          </div>
          <hr className="border-secondary my-4" />
          <div className="text-center text-muted">
            <p className="mb-0">جميع الحقوق محفوظة لـ شبكة اكوام © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;