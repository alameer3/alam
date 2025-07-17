import React, { useState, useEffect, useRef } from "react";

export default function OnesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const typedRef = useRef<HTMLInputElement>(null);

  // إضافة تأثيرات Typed.js للبحث
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/plugins/typed.min.js';
    script.onload = () => {
      if (typedRef.current && (window as any).Typed) {
        new (window as any).Typed(typedRef.current, {
          strings: [
            'ابحث عن فيلم او مسلسل او لعبة او برنامج ...',
            'مثال: الجزيرة',
            'مثال آخر: اسم مؤقت',
            'مثال: FIFA',
            'ابحث هنا في اكوام باسم الفيلم او المسلسل او اي لعبة او برنامج ترغب به'
          ],
          typeSpeed: 50,
          backSpeed: 30,
          loop: true,
          backDelay: 2000,
          attr: 'placeholder'
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // يمكن إضافة منطق البحث هنا لاحقاً
      console.log('البحث عن:', searchQuery);
    }
  };

  return (
    <div className="ones-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="navbar">
            <a href="/" className="logo">
              <img src="/logo-white.svg" alt="اكوام" />
            </a>
            <div className="nav-links">
              <a href="/ones" className="nav-link">الرئيسية</a>
              <a href="/movies" className="nav-link">أفلام</a>
              <a href="/series" className="nav-link">مسلسلات</a>
              <a href="/shows" className="nav-link">برامج</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">شمس المواقع</h1>
            <p className="hero-subtitle">الموقع العربي الأول لتحميل ومشاهدة الأفلام والمسلسلات</p>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-container">
                <input
                  ref={typedRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  placeholder="ابحث عن فيلم او مسلسل..."
                />
                <button type="submit" className="search-button">
                  <i className="icon-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-sections">
        <div className="container">
          <div className="section">
            <h2 className="section-title">أحدث الأفلام</h2>
            <div className="content-grid">
              <div className="content-card">
                <div className="card-image">
                  <img src="/serverdb/images/content-1.svg" alt="فيلم" />
                </div>
                <div className="card-info">
                  <h3 className="card-title">فيلم مثال</h3>
                  <p className="card-meta">2024 • HD</p>
                </div>
              </div>
              {/* يمكن إضافة المزيد من البطاقات هنا */}
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">أحدث المسلسلات</h2>
            <div className="content-grid">
              <div className="content-card">
                <div className="card-image">
                  <img src="/serverdb/images/content-2.svg" alt="مسلسل" />
                </div>
                <div className="card-info">
                  <h3 className="card-title">مسلسل مثال</h3>
                  <p className="card-meta">2024 • الموسم الأول</p>
                </div>
              </div>
              {/* يمكن إضافة المزيد من البطاقات هنا */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}