import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Series {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  poster: string;
  releaseDate: string;
  rating: number;
  status: 'completed' | 'ongoing' | 'cancelled';
  seasonsCount?: number;
  episodesCount?: number;
  quality: string;
  language: string;
  country: string;
}

const SeriesPage: React.FC = () => {
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    genre: '',
    year: '',
    sort: 'recent'
  });

  const { data: series, isLoading } = useQuery({
    queryKey: ['/api/content', { type: 'series', ...filters }],
    enabled: true
  });

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return 'مكتمل';
      case 'ongoing': return 'جاري';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#28a745';
      case 'ongoing': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="series-page">
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
                  <input type="text" name="q" placeholder="ابحث عن مسلسل..." />
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
          <a href="/series" className="item active">
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
              <div className="col-md-2">
                <select 
                  value={filters.category} 
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع الفئات</option>
                  <option value="arabic">عربي</option>
                  <option value="foreign">أجنبي</option>
                  <option value="turkish">تركي</option>
                  <option value="korean">كوري</option>
                  <option value="indian">هندي</option>
                </select>
              </div>
              <div className="col-md-2">
                <select 
                  value={filters.status} 
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع الحالات</option>
                  <option value="completed">مكتمل</option>
                  <option value="ongoing">جاري</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
              <div className="col-md-2">
                <select 
                  value={filters.genre} 
                  onChange={(e) => setFilters({...filters, genre: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="drama">دراما</option>
                  <option value="comedy">كوميدي</option>
                  <option value="action">أكشن</option>
                  <option value="romance">رومانسي</option>
                  <option value="thriller">إثارة</option>
                </select>
              </div>
              <div className="col-md-2">
                <select 
                  value={filters.year} 
                  onChange={(e) => setFilters({...filters, year: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع السنوات</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>
              <div className="col-md-2">
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
            <h1>المسلسلات</h1>
            <p>شاهد أحدث المسلسلات العربية والأجنبية</p>
          </div>

          {/* شبكة المسلسلات */}
          <div className="series-grid">
            {isLoading ? (
              <div className="loading">جاري التحميل...</div>
            ) : (
              <div className="row">
                {series?.map((seriesItem: Series) => (
                  <div key={seriesItem.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div className="series-card">
                      <a href={`/series/${seriesItem.id}`}>
                        <div className="poster-container">
                          <img 
                            src={seriesItem.poster || '/serverdb/images/default-poster.svg'} 
                            alt={seriesItem.titleAr}
                            className="poster"
                            loading="lazy"
                          />
                          <div className="quality-badge">{seriesItem.quality}</div>
                          <div className="rating-badge">⭐ {seriesItem.rating}</div>
                          <div 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(seriesItem.status) }}
                          >
                            {getStatusText(seriesItem.status)}
                          </div>
                        </div>
                        <div className="series-info">
                          <h3 className="title">{seriesItem.titleAr}</h3>
                          <p className="year">{new Date(seriesItem.releaseDate).getFullYear()}</p>
                          <p className="episodes">
                            {seriesItem.episodesCount ? `${seriesItem.episodesCount} حلقة` : ''}
                            {seriesItem.seasonsCount && seriesItem.seasonsCount > 1 ? ` - ${seriesItem.seasonsCount} مواسم` : ''}
                          </p>
                          <p className="country">{seriesItem.country}</p>
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

export default SeriesPage;