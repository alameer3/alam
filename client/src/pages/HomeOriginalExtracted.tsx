import { Search, User, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import '../styles/original.css';

const HomeOriginalExtracted = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="body-home header-fixed">
      {/* Site Overlay */}
      <span 
        className={`site-overlay ${isMenuOpen || isSearchOpen ? 'active' : ''}`}
        onClick={() => {
          setIsMenuOpen(false);
          setIsSearchOpen(false);
        }}
      ></span>

      {/* Main Menu */}
      <div className={`main-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="d-flex flex-column h-100">
          <div className="my-auto w-100">
            <div className="menu d-flex flex-wrap justify-content-center">
              <Link href="/movies" className="item">
                <div className="icn ml-3"><i className="icon-video-camera"></i></div>
                <div className="text">أفلام</div>
              </Link>
              <Link href="/series" className="item">
                <div className="icn ml-3"><i className="icon-monitor"></i></div>
                <div className="text">مسلسلات</div>
              </Link>
              <Link href="/shows" className="item">
                <div className="icn ml-3"><i className="icon-tv"></i></div>
                <div className="text">تلفزيون</div>
              </Link>
              <Link href="/mix" className="item">
                <div className="icn ml-3"><i className="icon-mix"></i></div>
                <div className="text">منوعات</div>
              </Link>
            </div>
          </div>
          <nav className="social d-flex justify-content-center">
            <a href="#" className="home mx-2"><i className="icon-home"></i></a>
            <a href="#" className="facebook mx-2"><i className="icon-facebook"></i></a>
            <a href="#" className="youtube mx-2"><i className="icon-youtube"></i></a>
            <a href="#" className="email mx-2"><i className="icon-email"></i></a>
          </nav>
        </div>
      </div>

      {/* Search Box */}
      <div className={`search-box px-xl-5 ${isSearchOpen ? 'active' : ''}`}>
        <div className="container search-container">
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <label className="d-flex align-items-center h-100 w-100 m-0">
              <button type="submit" className="px-3 ml-2 font-size-30">
                <Search className="w-6 h-6" />
              </button>
              <input 
                type="search" 
                placeholder="ابحث هنا"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </form>
          <div className="search-toggle" onClick={() => setIsSearchOpen(false)}>
            <i className="icon-arrow-back"></i>
          </div>
        </div>
      </div>

      <div className="site-container">
        <div className="page-home">
          <div className="main-header-top"></div>
          
          {/* Header */}
          <header className="main-header">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-auto">
                  <h2 className="main-logo m-0">
                    <Link href="/" className="d-inline-flex">
                      <img src="/images/logo-white.svg" className="img-fluid" alt="اكوام" />
                    </Link>
                  </h2>
                </div>
                <div className="col-auto menu-toggle-container">
                  <button 
                    className="menu-toggle d-flex align-items-center text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <span className="icn"></span>
                    <div className="text font-size-18 mr-3">الأقسام</div>
                  </button>
                </div>
                <div className="ml-auto"></div>
                <div className="col-md-5 col-lg-6 search-container">
                  <div className="search-form">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <label>ابحث عن فيلم او مسلسل ...</label>
                      <button><Search className="w-4 h-4" /></button>
                    </form>
                  </div>
                </div>
                <div className="col-auto recently-container">
                  <Link href="/recent" className="btn-recently">
                    <Plus className="w-4 h-4 ml-2" />
                    <span>أضيف حديثا</span>
                  </Link>
                </div>
                <div className="col-auto user-profile-container">
                  <div className="user-panel">
                    <Link className="user-toggle d-block font-size-20 public" href="/login">
                      <User className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <div className="main-header-height"></div>
          
          {/* Main Content */}
          <div className="container py-5 my-5">
            {/* Home Site Button */}
            <div className="home-site-btn-container mt-5">
              <h1>
                <Link 
                  href="/" 
                  className="link" 
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 10
                  }}
                />
              </h1>
              <div 
                className="home-site-btn"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070')`,
                  transition: 'background-position 5s'
                }}
              >
                <span className="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="87px" height="80px">
                    <path 
                      fillRule="evenodd" 
                      fill="rgb(255, 255, 255)"
                      d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"
                    />
                  </svg>
                </span>
                <span className="text font-size-20 font-weight-medium text-white">
                  الصفحة الرئيسية
                </span>
              </div>
            </div>

            {/* Search Widget */}
            <div className="widget-2 widget mb-4">
              <div className="widget-body row">
                <div className="col-lg-8 mx-auto">
                  <form className="form d-flex no-gutters mb-20" onSubmit={(e) => e.preventDefault()}>
                    <div className="col pl-12">
                      <input 
                        type="text" 
                        className="form-control" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <label className="m-0">
                        <span className="label">ابحث عن فيلم او مسلسل او لعبة او برنامج ...</span>
                      </label>
                    </div>
                    <div className="col-auto">
                      <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        style={{ backgroundColor: '#f3951e', borderColor: '#f3951e' }}
                      >
                        بحث
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="categories-box">
              <div className="row">
                <div className="col-6 col-md-3 mb-3">
                  <Link href="/movies" className="btn btn-outline-light w-100">أفلام</Link>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <Link href="/series" className="btn btn-outline-light w-100">مسلسلات</Link>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <Link href="/shows" className="btn btn-outline-light w-100">تلفزيون</Link>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <Link href="/mix" className="btn btn-outline-light w-100">منوعات</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeOriginalExtracted;