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
      {/* تراكب الموقع */}
      <div className={`site-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>

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

      {/* القائمة الجانبية للهواتف */}
      <aside className={`main-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="menu">
          <a href="/" className="item">
            <div className="icn">
              <i className="icon-home"></i>
            </div>
            <div className="text">الرئيسية</div>
          </a>
          <a href="/movies" className="item">
            <div className="icn">
              <i className="icon-video-camera"></i>
            </div>
            <div className="text">أفلام</div>
          </a>
          <a href="/series" className="item">
            <div className="icn">
              <i className="icon-monitor"></i>
            </div>
            <div className="text">مسلسلات</div>
          </a>
          <a href="/shows" className="item">
            <div className="icn">
              <i className="icon-tv"></i>
            </div>
            <div className="text">تلفزيون</div>
          </a>
          <a href="/mix" className="item">
            <div className="icn">
              <i className="icon-mix"></i>
            </div>
            <div className="text">منوعات</div>
          </a>
          <a href="/favorite" className="item">
            <div className="icn">
              <i className="icon-star"></i>
            </div>
            <div className="text">المفضلة</div>
          </a>
          <a href="/profile" className="item">
            <div className="icn">
              <i className="icon-user"></i>
            </div>
            <div className="text">الملف الشخصي</div>
          </a>
        </div>

        {/* الشبكات الاجتماعية */}
        <div className="social">
          <a href="https://facebook.com/akwamofficial" target="_blank" rel="noopener noreferrer">
            <i className="icon-facebook"></i>
          </a>
          <a href="https://youtube.com/akwamofficial" target="_blank" rel="noopener noreferrer">
            <i className="icon-youtube"></i>
          </a>
          <a href="mailto:contact@ak.sv">
            <i className="icon-email"></i>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Header;