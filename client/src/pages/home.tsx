import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface ContentItem {
  id: number;
  title: string;
  titleAr: string;
  type: string;
  poster: string;
  rating: number;
  releaseDate: string;
  quality: string;
  country: string;
}

const HomePage: React.FC = () => {
  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/content/featured'],
    enabled: true
  });

  const { data: recentContent, isLoading: recentLoading } = useQuery({
    queryKey: ['/api/content/recent'],
    enabled: true
  });

  return (
    <div className="home-page">
      {/* الهيدر الرئيسي */}
      <header className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-logo">
                <svg width="120" height="100" viewBox="0 0 87 80" fill="none">
                  <path d="M43.5 0L87 20V60L43.5 80L0 60V20L43.5 0Z" fill="#f3951e"/>
                  <text x="43.5" y="45" textAnchor="middle" fill="white" fontSize="20" fontFamily="STC-Bold">أكوام</text>
                </svg>
              </div>
              <h1 className="hero-title">شمس المواقع العربية</h1>
              <p className="hero-subtitle">الموقع العربي الأول لتحميل ومشاهدة الأفلام والمسلسلات</p>
              
              {/* البحث المركزي */}
              <div className="hero-search">
                <form action="/search" method="get" className="search-form-hero">
                  <input 
                    type="text" 
                    name="q" 
                    placeholder="ابحث عن فيلم أو مسلسل أو برنامج..."
                    className="search-input-hero"
                  />
                  <button type="submit" className="search-btn-hero">
                    🔍 بحث
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* القائمة الرئيسية */}
      <nav className="main-categories">
        <div className="container">
          <div className="categories-grid">
            <a href="/movies" className="category-card movies">
              <div className="category-icon">🎬</div>
              <div className="category-title">أفلام</div>
              <div className="category-desc">أحدث الأفلام العربية والأجنبية</div>
            </a>
            <a href="/series" className="category-card series">
              <div className="category-icon">📺</div>
              <div className="category-title">مسلسلات</div>
              <div className="category-desc">المسلسلات العربية والتركية والأجنبية</div>
            </a>
            <a href="/shows" className="category-card shows">
              <div className="category-icon">🖥️</div>
              <div className="category-title">تلفزيون</div>
              <div className="category-desc">البرامج التلفزيونية والرياضية</div>
            </a>
            <a href="/mix" className="category-card mix">
              <div className="category-icon">🔀</div>
              <div className="category-title">منوعات</div>
              <div className="category-desc">ألعاب، تطبيقات، مسرحيات</div>
            </a>
          </div>
        </div>
      </nav>

      {/* المحتوى المميز */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>المحتوى المميز</h2>
            <a href="/featured" className="view-all">عرض الكل</a>
          </div>
          <div className="content-slider">
            {featuredLoading ? (
              <div className="loading">جاري التحميل...</div>
            ) : (
              <div className="content-grid">
                {featuredContent?.data?.map((item: ContentItem) => (
                  <div key={item.id} className="content-card featured">
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
                        <div className="featured-badge">مميز</div>
                      </div>
                      <div className="content-info">
                        <h3 className="title">{item.titleAr}</h3>
                        <p className="year">{new Date(item.releaseDate).getFullYear()}</p>
                        <p className="country">{item.country}</p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* أحدث المحتوى */}
      <section className="recent-section">
        <div className="container">
          <div className="section-header">
            <h2>أضيف حديثاً</h2>
            <a href="/recent" className="view-all">عرض الكل</a>
          </div>
          <div className="content-grid">
            {recentLoading ? (
              <div className="loading">جاري التحميل...</div>
            ) : (
              <div className="row">
                {recentContent?.data?.map((item: ContentItem) => (
                  <div key={item.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div className="content-card recent">
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
                          <div className="new-badge">جديد</div>
                        </div>
                        <div className="content-info">
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
        </div>
      </section>

      {/* الإحصائيات */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">5000+</div>
              <div className="stat-label">أفلام</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3000+</div>
              <div className="stat-label">مسلسلات</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">برامج</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100K+</div>
              <div className="stat-label">مستخدم</div>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>أكوام</h3>
              <p>الموقع العربي الأول لتحميل ومشاهدة الأفلام والمسلسلات والبرامج التلفزيونية</p>
              <div className="social">
                <a href="#" className="facebook">📘</a>
                <a href="#" className="youtube">📺</a>
                <a href="#" className="telegram">📱</a>
                <a href="#" className="email">📧</a>
              </div>
            </div>
            <div className="footer-section">
              <h4>الأقسام</h4>
              <ul>
                <li><a href="/movies">أفلام</a></li>
                <li><a href="/series">مسلسلات</a></li>
                <li><a href="/shows">تلفزيون</a></li>
                <li><a href="/mix">منوعات</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>روابط مفيدة</h4>
              <ul>
                <li><a href="/recent">أضيف حديثاً</a></li>
                <li><a href="/top-rated">الأعلى تقييماً</a></li>
                <li><a href="/most-viewed">الأكثر مشاهدة</a></li>
                <li><a href="/random">اختيار عشوائي</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>تواصل معنا</h4>
              <ul>
                <li><a href="/contact">اتصل بنا</a></li>
                <li><a href="/dmca">حقوق النشر</a></li>
                <li><a href="/privacy">سياسة الخصوصية</a></li>
                <li><a href="/terms">شروط الاستخدام</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="copyright">
              <p>&copy; 2024 موقع أكوام. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;