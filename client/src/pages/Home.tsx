import { useState, useEffect } from 'react';
import { Link } from 'wouter';

export default function HomeAuthentic() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // تحميل الصفحة مع تأثير الانتقال
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="header-fixed body-home" style={{ backgroundColor: '#161619' }}>
      
      {/* الخلفية الأصلية مطابقة للموقع */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, .55), #000 100%), url('https://ak.sv/style/assets/images/home-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* القائمة الجانبية الأصلية */}
      <div className="main-menu">
        <div className="d-flex flex-column">
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
            <a href="https://akw.to" target="" className="home mx-2"><i className="icon-home"></i></a>
            <a href="https://www.facebook.com/akwamnet" target="_blank" className="facebook mx-2"><i className="icon-facebook"></i></a>
            <a href="https://www.facebook.com/groups/AKOAMweb" target="_blank" className="facebook mx-2"><i className="icon-facebook"></i></a>
            <a href="https://akw.net.in/" target="_blank" className="app-store mx-2"><i className="icon-app-store"></i></a>
            <a href="https://www.youtube.com/c/AKWAMnetwork" target="_blank" className="youtube mx-2"><i className="icon-youtube"></i></a>
            <a href="/AKWAM-Notifications" target="_blank" className="app-store mx-2"><i className="icon-app-store"></i></a>
            <a href="/contactus" target="" className="email mx-2"><i className="icon-email"></i></a>
          </nav>
        </div>
      </div>

      {/* الهيدر الأصلي */}
      <div className="main-header-top"></div>
      <header className="main-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-auto">
              <h2 className="main-logo m-0">
                <Link href="/ones" className="d-inline-flex">
                  <img src="/style/assets/images/logo-white.svg" className="img-fluid" alt="اكوام" />
                </Link>
              </h2>
            </div>
            <div className="col-auto menu-toggle-container">
              <button className="menu-toggle d-flex align-items-center text-white">
                <span className="icn"></span>
                <div className="text font-size-18 mr-3">الأقسام</div>
              </button>
            </div>
            <div className="ml-auto"></div>
            <div className="col-md-5 col-lg-6 search-container">
              <div className="search-form">
                <form action="/search" method="get">
                  <input type="text" id="headerSearchInput" name="q" />
                  <label htmlFor="headerSearchInput">ابحث عن فيلم او مسلسل ...</label>
                  <button><i className="icon-search"></i></button>
                </form>
              </div>
            </div>
            <div className="col-auto recently-container">
              <Link href="/recent" className="btn-recently"><i className="icon-plus2 ml-2"></i><span>أضيف حديثا</span></Link>
            </div>
            <div className="col-auto user-profile-container">
              <div className="user-panel">
                <Link className="user-toggle d-block font-size-20 public" href="/login"><i className="icon-user"></i></Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="main-header-height"></div>

      {/* الحاوي الأصلي مطابق للموقع */}
      <div className="site-container">
        <div className="page-home">
          <div className="container py-5 my-5">
            
            {/* الشعار الدائري الأصلي بالضبط */}
            <div className="home-site-btn-container mt-5">
              <h1>
                <Link href="/ones" className="link" style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', zIndex: 10 }}></Link>
              </h1>
              <div 
                className="home-site-btn"
                style={{
                  backgroundImage: "url('https://ak.sv/style/assets/images/site-new.webp')",
                  transition: 'background-position 5s'
                }}
              >
                <span className="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="87px" height="80px">
                    <path fillRule="evenodd" fill="rgb(255, 255, 255)"
                      d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
                  </svg>
                </span>
                <span className="text font-size-20 font-weight-medium text-white">الصفحة الرئيسية</span>
              </div>
            </div>

            {/* Widget البحث الأصلي */}
            <div className="widget-2 widget mb-4">
              <div className="widget-body row">
                <div className="col-lg-8 mx-auto">
                  
                  <form className="form d-flex no-gutters mb-20" action="/search" method="get">
                    <div className="col pl-12">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="widget2SearchInput" 
                        name="q"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                      <label htmlFor="widget2SearchInput" className="m-0"><span className="label"></span></label>
                      <div className="label-text d-none">
                        <p>ابحث عن فيلم او مسلسل او لعبة او برنامج ...</p>
                        <p>^200 مثال: الجزيرة</p>
                        <p>^400 مثال آخر: اسم مؤقت</p>
                        <p>^600 مثال: FIFA</p>
                        <p>^800 ابحث هنا في اكوام باسم الفيلم او المسلسل او اي لعبة او برنامج ترغب به</p>
                      </div>
                    </div>
                    <div className="col-auto">
                      <button type="submit" className="btn btn-orange">بحث</button>
                    </div>
                  </form>
                  
                  {/* الأقسام الأصلية مطابقة للموقع */}
                  <div className="main-categories-list">
                    <div className="row">
                      <div className="col-lg col-4">
                        <Link href="/movies" className="item d-block text-center text-white py-3 h-100">
                          <div className="icn"><i className="icon-video-camera"></i></div>
                          <div className="font-size-16">أفلام</div>
                        </Link>
                      </div>
                      <div className="col-lg col-4">
                        <Link href="/series" className="item d-block text-center text-white py-3 h-100">
                          <div className="icn"><i className="icon-monitor"></i></div>
                          <div className="font-size-16">مسلسلات</div>
                        </Link>
                      </div>
                      <div className="col-lg col-4">
                        <Link href="/shows" className="item d-block text-center text-white py-3 h-100">
                          <div className="icn"><i className="icon-tv"></i></div>
                          <div className="font-size-16">تلفزيون</div>
                        </Link>
                      </div>
                      <div className="col-lg col-4">
                        <Link href="/mix" className="item d-block text-center text-white py-3 h-100">
                          <div className="icn"><i className="icon-mix"></i></div>
                          <div className="font-size-16">منوعات</div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="main-categories-list-end"></div>
          </div>
        </div>
      </div>

      {/* التذييل الأصلي */}
      <footer className="main-footer py-5">
        {/* الروابط الاجتماعية */}
        <nav className="flex justify-center space-x-6 space-x-reverse mb-4">
          <a href="https://akw.to" target="_blank" className="text-white hover:text-orange-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/akwamnet" target="_blank" className="text-white hover:text-orange-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://www.youtube.com/c/AKWAMnetwork" target="_blank" className="text-white hover:text-orange-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="https://instagram.com/akwamnet" target="_blank" className="text-white hover:text-orange-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="/contactus" className="text-white hover:text-orange-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
        </nav>
        
        {/* روابط الموقع */}
        <nav className="flex justify-center flex-wrap gap-6 text-sm mb-4">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">اكوام</Link>
          <Link href="/dmca" className="text-gray-300 hover:text-white transition-colors">DMCA</Link>
          <Link href="/ad-policy" className="text-gray-300 hover:text-white transition-colors">AD-P</Link>
          <Link href="https://ak-news.com" target="_blank" className="text-gray-300 hover:text-white transition-colors">اكوام نيوز</Link>
          <Link href="https://akw.net.co" target="_blank" className="text-gray-300 hover:text-white transition-colors">شبكة اكوام</Link>
        </nav>
        
        {/* حقوق النشر */}
        <p className="text-center text-xs text-gray-400">
          جميع الحقوق محفوظة لـ شبكة اكوام © 2025
        </p>
      </footer>


    </div>
  );
}