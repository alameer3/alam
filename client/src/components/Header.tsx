import React, { useState, useEffect } from 'react';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      {/* الهيدر الرئيسي */}
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <nav className="navbar">
            {/* الشعار */}
            <a href="/" className="logo">
              <img src="/logo-white.svg" alt="اكوام" />
              اكوام
            </a>

            {/* التنقل الرئيسي */}
            <ul className="main-nav d-desktop-block d-mobile-none">
              <li>
                <a href="/" className="active">
                  <i className="icon-home"></i>
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/movies">
                  <i className="icon-video-camera"></i>
                  أفلام
                </a>
              </li>
              <li>
                <a href="/series">
                  <i className="icon-monitor"></i>
                  مسلسلات
                </a>
              </li>
              <li>
                <a href="/shows">
                  <i className="icon-tv"></i>
                  تلفزيون
                </a>
              </li>
              <li>
                <a href="/mix">
                  <i className="icon-mix"></i>
                  منوعات
                </a>
              </li>
            </ul>

            {/* أدوات الهيدر */}
            <div className="header-tools">
              <button className="search-toggle" onClick={toggleSearch}>
                <i className="icon-search"></i>
              </button>
              <button className="menu-toggle d-mobile-block d-desktop-none" onClick={toggleMenu}>
                <i className="icon-menu"></i>
              </button>
            </div>
          </nav>

          {/* شريط البحث */}
          <div className={`search-bar ${isSearchOpen ? 'active' : ''}`}>
            <div className="container">
              <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="ابحث عن أفلام، مسلسلات، برامج..."
                  autoComplete="off"
                />
                <button type="submit" className="search-btn">
                  <i className="icon-search"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* تراكب الموقع */}
      {isMenuOpen && <div className="site-overlay" onClick={() => setIsMenuOpen(false)}></div>}
      
      {/* القائمة الجانبية للهواتف */}
      {isMenuOpen && (
        <aside className="main-menu active">
          <div className="menu">
            <a href="/" className="item">
              <div className="icn">🏠</div>
              <div className="text">الرئيسية</div>
            </a>
            <a href="/movies" className="item">
              <div className="icn">🎬</div>
              <div className="text">أفلام</div>
            </a>
            <a href="/series" className="item">
              <div className="icn">📺</div>
              <div className="text">مسلسلات</div>
            </a>
            <a href="/shows" className="item">
              <div className="icn">📻</div>
              <div className="text">تلفزيون</div>
            </a>
            <a href="/mix" className="item">
              <div className="icn">🎭</div>
              <div className="text">منوعات</div>
            </a>
          </div>
        </aside>
      )}
    </>
  );
};

export default Header;