import { useState } from 'react';

interface OriginalHeaderProps {
  pageTitle?: string;
}

const OriginalHeader = ({ pageTitle = "اكوام" }: OriginalHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Site Overlay */}
      <span className="site-overlay"></span>
      
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
              <a href="/shows" className="item">
                <div className="icn ml-3"><i className="icon-tv"></i></div>
                <div className="text">تلفزيون</div>
              </a>
              <a href="/mix" className="item">
                <div className="icn ml-3"><i className="icon-mix"></i></div>
                <div className="text">منوعات</div>
              </a>
            </div>
          </div>
          <nav className="social d-flex justify-content-center">
            <a href="/" target="" className="home mx-2"><i className="icon-home"></i></a>
            <a href="https://www.facebook.com/akwamnet" target="_blank" className="facebook mx-2"><i className="icon-facebook"></i></a>
            <a href="https://www.facebook.com/groups/AKOAMweb" target="_blank" className="facebook mx-2"><i className="icon-facebook"></i></a>
            <a href="#" target="_blank" className="app-store mx-2"><i className="icon-app-store"></i></a>
            <a href="https://www.youtube.com/c/AKWAMnetwork" target="_blank" className="youtube mx-2"><i className="icon-youtube"></i></a>
            <a href="#" target="_blank" className="app-store mx-2"><i className="icon-app-store"></i></a>
            <a href="/contactus" target="" className="email mx-2"><i className="icon-email"></i></a>
          </nav>
        </div>
      </div>

      {/* Search Box */}
      <div className="search-box px-xl-5">
        <div className="container search-container">
          <form onSubmit={handleSearch} className="search-form">
            <label htmlFor="searchBoxInput" className="d-flex align-items-center h-100 w-100 m-0">
              <button type="submit" className="px-3 ml-2 font-size-30"><i className="icon-search"></i></button>
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
          <div className="search-toggle"><i className="icon-arrow-back"></i></div>
        </div>
      </div>

      {/* Main Header */}
      <div className="site-container">
        <div className="main-header-top"></div>
        <header className="main-header">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-auto">
                <h2 className="main-logo m-0">
                  <a href="/" className="d-inline-flex">
                    <img src="/images/logo-white.svg" className="img-fluid" alt="اكوام" />
                  </a>
                </h2>
              </div>
              <div className="col-auto menu-toggle-container">
                <button className="menu-toggle d-flex align-items-center text-white" style={{background: 'none', border: 'none'}}>
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
                  <button className="user-toggle d-block font-size-20 private hide" style={{background: 'none', border: 'none'}}>
                    <i className="icon-user"></i>
                  </button>
                </div>
              </div>
              <div className="col-auto search-toggle-container">
                <button className="search-toggle d-block font-size-20 text-white" style={{background: 'none', border: 'none'}}>
                  <i className="icon-search"></i>
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default OriginalHeader;