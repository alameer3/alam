import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface MixContent {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  poster: string;
  releaseDate: string;
  rating: number;
  type: 'game' | 'application' | 'theater' | 'wrestling' | 'sports';
  quality: string;
  language: string;
  country: string;
}

const MixPage: React.FC = () => {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    sort: 'recent'
  });

  const { data: mixContent, isLoading } = useQuery({
    queryKey: ['/api/content', { type: ['game', 'application', 'theater', 'wrestling', 'sports'], ...filters }],
    enabled: true
  });

  const getTypeText = (type: string) => {
    switch(type) {
      case 'game': return 'لعبة';
      case 'application': return 'تطبيق';
      case 'theater': return 'مسرحية';
      case 'wrestling': return 'مصارعة';
      case 'sports': return 'رياضة';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'game': return '🎮';
      case 'application': return '📱';
      case 'theater': return '🎭';
      case 'wrestling': return '🤼';
      case 'sports': return '⚽';
      default: return '📁';
    }
  };

  return (
    <div className="mix-page">
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
                  <input type="text" name="q" placeholder="ابحث في المنوعات..." />
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
          <a href="/shows" className="item">
            <div className="icn">🖥️</div>
            <div className="text">تلفزيون</div>
          </a>
          <a href="/mix" className="item active">
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
              <div className="col-md-4">
                <select 
                  value={filters.type} 
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="game">ألعاب</option>
                  <option value="application">تطبيقات</option>
                  <option value="theater">مسرحيات</option>
                  <option value="wrestling">مصارعة</option>
                  <option value="sports">رياضة</option>
                </select>
              </div>
              <div className="col-md-4">
                <select 
                  value={filters.category} 
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="form-control"
                >
                  <option value="">جميع الفئات</option>
                  <option value="arabic">عربي</option>
                  <option value="foreign">أجنبي</option>
                  <option value="international">عالمي</option>
                </select>
              </div>
              <div className="col-md-4">
                <select 
                  value={filters.sort} 
                  onChange={(e) => setFilters({...filters, sort: e.target.value})}
                  className="form-control"
                >
                  <option value="recent">الأحدث</option>
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="popular">الأكثر تحميلاً</option>
                  <option value="alphabetical">أبجدي</option>
                </select>
              </div>
            </div>
          </div>

          {/* عنوان الصفحة */}
          <div className="page-header">
            <h1>المنوعات</h1>
            <p>ألعاب، تطبيقات، مسرحيات، مصارعة وأكثر</p>
          </div>

          {/* أقسام المنوعات */}
          <div className="mix-categories">
            <div className="row mb-4">
              <div className="col-md-2 col-4 mb-3">
                <a href="/mix?type=game" className="category-item">
                  <div className="icon">🎮</div>
                  <div className="text">ألعاب</div>
                </a>
              </div>
              <div className="col-md-2 col-4 mb-3">
                <a href="/mix?type=application" className="category-item">
                  <div className="icon">📱</div>
                  <div className="text">تطبيقات</div>
                </a>
              </div>
              <div className="col-md-2 col-4 mb-3">
                <a href="/mix?type=theater" className="category-item">
                  <div className="icon">🎭</div>
                  <div className="text">مسرحيات</div>
                </a>
              </div>
              <div className="col-md-2 col-4 mb-3">
                <a href="/mix?type=wrestling" className="category-item">
                  <div className="icon">🤼</div>
                  <div className="text">مصارعة</div>
                </a>
              </div>
              <div className="col-md-2 col-4 mb-3">
                <a href="/mix?type=sports" className="category-item">
                  <div className="icon">⚽</div>
                  <div className="text">رياضة</div>
                </a>
              </div>
            </div>
          </div>

          {/* شبكة المحتوى */}
          <div className="mix-grid">
            {isLoading ? (
              <div className="loading">جاري التحميل...</div>
            ) : (
              <div className="row">
                {mixContent?.map((item: MixContent) => (
                  <div key={item.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div className="mix-card">
                      <a href={`/${item.type}/${item.id}`}>
                        <div className="poster-container">
                          <img 
                            src={item.poster || '/serverdb/images/default-poster.svg'} 
                            alt={item.titleAr}
                            className="poster"
                            loading="lazy"
                          />
                          <div className="quality-badge">{item.quality}</div>
                          <div className="rating-badge">⭐ {item.rating}</div>
                          <div className="type-badge">
                            {getTypeIcon(item.type)} {getTypeText(item.type)}
                          </div>
                        </div>
                        <div className="mix-info">
                          <h3 className="title">{item.titleAr}</h3>
                          <p className="year">{new Date(item.releaseDate).getFullYear()}</p>
                          <p className="country">{item.country}</p>
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

export default MixPage;