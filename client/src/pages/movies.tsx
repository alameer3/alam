import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Movie {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  poster: string;
  releaseDate: string;
  rating: number;
  duration?: number;
  quality: string;
  language: string;
  country: string;
}

const MoviesPage: React.FC = () => {
  const [filters, setFilters] = useState({
    category: '',
    genre: '',
    year: '',
    quality: '',
    sort: 'recent'
  });

  const { data: movies, isLoading } = useQuery({
    queryKey: ['/api/content', { type: 'movie', ...filters }],
    enabled: true
  });

  return (
    <div className="movies-page">
      {/* الهيدر */}
      <header className="main-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-auto">
              <h2 className="main-logo m-0">
                <a href="/" className="d-inline-flex">
                  <svg width="50" height="40" viewBox="0 0 87 80" fill="none">
                    <defs>
                      <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007bff"/>
                        <stop offset="100%" stopColor="#28a745"/>
                      </linearGradient>
                    </defs>
                    <path d="M43.5 0L87 20V60L43.5 80L0 60V20L43.5 0Z" fill="url(#headerGradient)"/>
                    <text x="43.5" y="45" textAnchor="middle" fill="white" fontSize="18" fontFamily="STC-Bold">A</text>
                  </svg>
                </a>
              </h2>
            </div>
            
            {/* البحث */}
            <div className="col-md-5 col-lg-6 search-container">
              <div className="search-form">
                <form action="/search" method="get">
                  <input type="text" name="q" placeholder="ابحث عن فيلم..." />
                  <button type="submit">🔍</button>
                </form>
              </div>
            </div>
            
            {/* أضيف حديثاً */}
            <div className="col-auto">
              <a href="/recent" className="btn-recently">
                <span>أضيف حديثا</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* القائمة الرئيسية */}
      <nav className="main-menu">
        <div className="menu">
          <a href="/movies" className="item active">
            <div className="icn">🎬</div>
            <div className="text">أفلام</div>
          </a>
          <a href="/series" className="item">
            <div className="icn">📺</div>
            <div className="text">مسلسلات</div>
          </a>
          <a href="/shows" className="item">
            <div className="icn">🖥️</div>
            <div className="text">تلفزيون</div>
          </a>
          <a href="/mix" className="item">
            <div className="icn">🔀</div>
            <div className="text">منوعات</div>
          </a>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="main-content">
        <div className="container">
          {/* الفلاتر */}
          <div className="filters-section">
            <div className="row">
              <div className="col-md-3">
                <select 
                  value={filters.category} 
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع الفئات</option>
                  <option value="arabic">عربي</option>
                  <option value="foreign">أجنبي</option>
                  <option value="hindi">هندي</option>
                  <option value="turkish">تركي</option>
                  <option value="korean">كوري</option>
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  value={filters.genre} 
                  onChange={(e) => setFilters({...filters, genre: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="action">أكشن</option>
                  <option value="comedy">كوميدي</option>
                  <option value="drama">دراما</option>
                  <option value="romance">رومانسي</option>
                  <option value="horror">رعب</option>
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  value={filters.quality} 
                  onChange={(e) => setFilters({...filters, quality: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع الجودات</option>
                  <option value="HD">HD</option>
                  <option value="Full HD">Full HD</option>
                  <option value="4K">4K</option>
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  value={filters.sort} 
                  onChange={(e) => setFilters({...filters, sort: e.target.value})}
                  className="form-control"
                >
                  <option value="recent">الأحدث</option>
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="popular">الأكثر مشاهدة</option>
                  <option value="alphabetical">أبجدي</option>
                </select>
              </div>
            </div>
          </div>

          {/* عنوان الصفحة */}
          <div className="page-header">
            <h1>الأفلام</h1>
            <p>شاهد أحدث الأفلام العربية والأجنبية</p>
          </div>

          {/* شبكة الأفلام */}
          <div className="movies-grid">
            {isLoading ? (
              <div className="loading">جاري التحميل...</div>
            ) : (
              <div className="row">
                {movies?.map((movie: Movie) => (
                  <div key={movie.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div className="movie-card">
                      <a href={`/movie/${movie.id}`}>
                        <div className="poster-container">
                          <img 
                            src={movie.poster || '/serverdb/images/default-poster.svg'} 
                            alt={movie.titleAr}
                            className="poster"
                            loading="lazy"
                          />
                          <div className="quality-badge">{movie.quality}</div>
                          <div className="rating-badge">⭐ {movie.rating}</div>
                        </div>
                        <div className="movie-info">
                          <h3 className="title">{movie.titleAr}</h3>
                          <p className="year">{new Date(movie.releaseDate).getFullYear()}</p>
                          <p className="country">{movie.country}</p>
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* التنقل بين الصفحات */}
          <div className="pagination-section">
            <nav className="pagination">
              <a href="#" className="page-link">السابق</a>
              <a href="#" className="page-link active">1</a>
              <a href="#" className="page-link">2</a>
              <a href="#" className="page-link">3</a>
              <a href="#" className="page-link">التالي</a>
            </nav>
          </div>
        </div>
      </main>

      {/* الفوتر */}
      <footer className="main-footer">
        <div className="container">
          <div className="social">
            <a href="#" className="facebook">📘</a>
            <a href="#" className="youtube">📺</a>
            <a href="#" className="email">📧</a>
          </div>
          <div className="copyright">
            <p>&copy; 2024 موقع أكوام. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MoviesPage;