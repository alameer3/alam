import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Show {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  poster: string;
  releaseDate: string;
  rating: number;
  type: 'program' | 'sports' | 'news' | 'talk_show' | 'cooking' | 'talent';
  episodesCount?: number;
  quality: string;
  language: string;
  country: string;
}

const ShowsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    genre: '',
    sort: 'recent'
  });

  const { data: shows, isLoading } = useQuery({
    queryKey: ['/api/content', { type: 'program', ...filters }],
    enabled: true
  });

  const getTypeText = (type: string) => {
    switch(type) {
      case 'program': return 'برنامج';
      case 'sports': return 'رياضة';
      case 'news': return 'أخبار';
      case 'talk_show': return 'توك شو';
      case 'cooking': return 'طبخ';
      case 'talent': return 'مواهب';
      default: return type;
    }
  };

  return (
    <div className="shows-page">
      {/* الهيدر */}
      <header className="main-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-auto">
              <h2 className="main-logo m-0">
                <a href="/" className="d-inline-flex">
                  <svg width="50" height="40" viewBox="0 0 87 80" fill="none">
                    <path d="M43.5 0L87 20V60L43.5 80L0 60V20L43.5 0Z" fill="#f3951e"/>
                    <text x="43.5" y="45" textAnchor="middle" fill="white" fontSize="20" fontFamily="STC-Bold">A</text>
                  </svg>
                </a>
              </h2>
            </div>
            
            {/* البحث */}
            <div className="col-md-5 col-lg-6 search-container">
              <div className="search-form">
                <form action="/search" method="get">
                  <input type="text" name="q" placeholder="ابحث عن برنامج..." />
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
          <a href="/movies" className="item">
            <div className="icn">🎬</div>
            <div className="text">أفلام</div>
          </a>
          <a href="/series" className="item">
            <div className="icn">📺</div>
            <div className="text">مسلسلات</div>
          </a>
          <a href="/shows" className="item active">
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
                  value={filters.type} 
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="program">برامج عامة</option>
                  <option value="sports">رياضة</option>
                  <option value="news">أخبار</option>
                  <option value="talk_show">توك شو</option>
                  <option value="cooking">طبخ</option>
                  <option value="talent">مواهب</option>
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  value={filters.category} 
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع الفئات</option>
                  <option value="arabic">عربي</option>
                  <option value="foreign">أجنبي</option>
                  <option value="local">محلي</option>
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  value={filters.genre} 
                  onChange={(e) => setFilters({...filters, genre: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع التصنيفات</option>
                  <option value="entertainment">ترفيه</option>
                  <option value="educational">تعليمي</option>
                  <option value="documentary">وثائقي</option>
                  <option value="comedy">كوميدي</option>
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
                  <option value="episodes">عدد الحلقات</option>
                </select>
              </div>
            </div>
          </div>

          {/* عنوان الصفحة */}
          <div className="page-header">
            <h1>التلفزيون</h1>
            <p>شاهد أحدث البرامج التلفزيونية والرياضية</p>
          </div>

          {/* شبكة البرامج */}
          <div className="shows-grid">
            {isLoading ? (
              <div className="loading">جاري التحميل...</div>
            ) : (
              <div className="row">
                {shows?.map((show: Show) => (
                  <div key={show.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div className="show-card">
                      <a href={`/show/${show.id}`}>
                        <div className="poster-container">
                          <img 
                            src={show.poster || '/serverdb/images/default-poster.svg'} 
                            alt={show.titleAr}
                            className="poster"
                            loading="lazy"
                          />
                          <div className="quality-badge">{show.quality}</div>
                          <div className="rating-badge">⭐ {show.rating}</div>
                          <div className="type-badge">
                            {getTypeText(show.type)}
                          </div>
                        </div>
                        <div className="show-info">
                          <h3 className="title">{show.titleAr}</h3>
                          <p className="year">{new Date(show.releaseDate).getFullYear()}</p>
                          <p className="episodes">
                            {show.episodesCount ? `${show.episodesCount} حلقة` : ''}
                          </p>
                          <p className="country">{show.country}</p>
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

export default ShowsPage;