import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

export default function AuthenticHeader() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // التحكم في header scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (document.querySelector('.main-header')) {
        if (window.scrollY <= 50) {
          document.body.classList.remove('header-bg');
        } else {
          document.body.classList.add('header-bg');
        }
        
        const categoriesListEnd = document.querySelector('.main-categories-list-end');
        if (categoriesListEnd) {
          if (window.scrollY <= categoriesListEnd.getBoundingClientRect().top) {
            document.body.classList.remove('header-menu');
          } else {
            document.body.classList.add('header-menu');
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إغلاق القوائم بمفتاح ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        document.body.classList.remove('search-active', 'main-menu-active');
        setShowMainMenu(false);
        setShowSearchBox(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMainMenu = () => {
    document.body.classList.remove('search-active');
    document.body.classList.toggle('main-menu-active');
    setShowMainMenu(!showMainMenu);
    setShowSearchBox(false);
  };

  const toggleSearchBox = () => {
    document.body.classList.remove('main-menu-active');
    document.body.classList.toggle('search-active');
    setShowSearchBox(!showSearchBox);
    setShowMainMenu(false);
    
    setTimeout(() => {
      const searchInput = document.querySelector('.search-box form input') as HTMLInputElement;
      if (searchInput) searchInput.focus();
    }, 200);
  };

  const closeMenus = () => {
    document.body.classList.remove('main-menu-active', 'search-active');
    setShowMainMenu(false);
    setShowSearchBox(false);
  };

  return (
    <>
      {/* Site Overlay */}
      <span className="site-overlay" onClick={closeMenus}></span>

      {/* Main Menu */}
      <div className="main-menu">
        <div className="d-flex flex-column">
          <div className="my-auto w-100">
            <div className="menu d-flex flex-wrap justify-content-center">
              <a href="/movies" className="item">
                <div className="icn ml-3"><i className="icon-video-camera"></i></div>
                <div className="text">أفلام</div>
              </a>
              <a href="/series" className="item">
                <div className="icn ml-3"><i className="icon-monitor"></i></div>
                <div className="text">مسلسلات</div>
              </a>
              <a href="/programs" className="item">
                <div className="icn ml-3"><i className="icon-tv"></i></div>
                <div className="text">تلفزيون</div>
              </a>
              <a href="/games" className="item">
                <div className="icn ml-3"><i className="icon-mix"></i></div>
                <div className="text">منوعات</div>
              </a>
            </div>
          </div>
          <nav className="social d-flex justify-content-center">
            <a href="/ones" className="home mx-2"><i className="icon-home"></i></a>
            <a href="https://www.facebook.com/akwamnet" target="_blank" className="facebook mx-2"><i className="icon-facebook"></i></a>
            <a href="https://www.facebook.com/groups/AKOAMweb" target="_blank" className="facebook mx-2"><i className="icon-facebook"></i></a>
            <a href="https://akw.net.in/" target="_blank" className="app-store mx-2"><i className="icon-app-store"></i></a>
            <a href="https://www.youtube.com/c/AKWAMnetwork" target="_blank" className="youtube mx-2"><i className="icon-youtube"></i></a>
            <a href="/contactus" className="email mx-2"><i className="icon-email"></i></a>
          </nav>
        </div>
      </div>

      {/* Search Box */}
      <div className="search-box px-xl-5">
        <div className="container search-container">
          <form onSubmit={handleSearch} className="search-form">
            <label htmlFor="searchBoxInput" className="d-flex align-items-center h-100 w-100 m-0">
              <button type="submit" className="px-3 ml-2 font-size-30">
                <i className="icon-search"></i>
              </button>
              <input 
                type="search" 
                name="q" 
                id="searchBoxInput" 
                placeholder="ابحث هنا"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </form>
          <div className="search-toggle" onClick={toggleSearchBox}>
            <i className="icon-arrow-back"></i>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-auto">
              <h2 className="main-logo m-0">
                <a href="/ones" className="d-inline-flex">
                  <img src="/images/logo-white.svg" className="img-fluid" alt="اكوام" />
                </a>
              </h2>
            </div>
            
            <div className="col-auto menu-toggle-container">
              <button className="menu-toggle d-flex align-items-center text-white" onClick={toggleMainMenu}>
                <span className="icn"></span>
                <div className="text font-size-18 mr-3">الأقسام</div>
              </button>
            </div>
            
            <div className="ml-auto"></div>
            
            <div className="col-md-5 col-lg-6 search-container">
              <div className="search-form">
                <form onSubmit={handleSearch}>
                  <input 
                    type="text" 
                    id="headerSearchInput" 
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <label htmlFor="headerSearchInput">ابحث عن فيلم او مسلسل ...</label>
                  <button type="submit"><i className="icon-search"></i></button>
                </form>
              </div>
            </div>
            
            <div className="col-auto recently-container">
              <a href="/recent" className="btn-recently">
                <i className="icon-plus2 ml-2"></i>
                <span>أضيف حديثا</span>
              </a>
            </div>
            
            <div className="col-auto user-profile-container">
              <div className="user-panel">
                <a className="user-toggle d-block font-size-20 public" href="/login">
                  <i className="icon-user"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}