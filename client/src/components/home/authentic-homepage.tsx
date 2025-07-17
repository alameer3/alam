import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function AuthenticHomepage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // إضافة class body-home للخلفية
    document.body.classList.add('body-home', 'header-fixed', 'page-home');
    
    // إزالة class عند مغادرة الصفحة
    return () => {
      document.body.classList.remove('body-home', 'header-fixed', 'page-home');
    };
  }, []);

  useEffect(() => {
    // تهيئة Typed.js للصفحة الرئيسية
    if (typedRef.current && (window as any).Typed) {
      new (window as any).Typed(typedRef.current, {
        stringsElement: ".label-text",
        typeSpeed: 30,
        backSpeed: 20,
        loop: true,
        backDelay: 2000,
        showCursor: true,
        cursorChar: '|'
      });
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="site-container">
      <div className="page-home">
        <div className="main-header-top"></div>
        
        <div className="main-header-height"></div>
        
        <div className="container py-5 my-5">
          {/* زر الصفحة الرئيسية */}
          <div className="home-site-btn-container mt-5">
            <h1>
              <a href="/ones" className="link" style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                zIndex: 10
              }} onClick={(e) => {
                e.preventDefault();
                window.location.href = '/ones';
              }}></a>
            </h1>
            <div className="home-site-btn" style={{
              backgroundImage: "url('/images/site-new.webp')",
              transition: 'background-position 5s'
            }}>
              <span className="logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="87px" height="80px">
                  <path fillRule="evenodd" fill="rgb(255, 255, 255)"
                        d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
                </svg>
              </span>
              <span className="text font-size-20 font-weight-medium text-white">الصفحة الرئيسية</span>
            </div>
          </div>

          {/* Widget البحث والأقسام */}
          <div className="widget-2 widget mb-4">
            <div className="widget-body row">
              <div className="col-lg-8 mx-auto">
                <form className="form d-flex no-gutters mb-20" onSubmit={handleSearch}>
                  <div className="col pl-12">
                    <input 
                      type="text" 
                      className="form-control" 
                      id="widget2SearchInput" 
                      name="q"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <label htmlFor="widget2SearchInput" className="m-0">
                      <span className="label" ref={typedRef}></span>
                    </label>
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

                {/* قائمة الأقسام الرئيسية */}
                <div className="main-categories-list">
                  <div className="row">
                    <div className="col-lg col-4">
                      <a href="/movies" className="item d-block text-center text-white py-3 h-100" onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/movies';
                      }}>
                        <div className="icn"><i className="icon-video-camera"></i></div>
                        <div className="font-size-16">أفلام</div>
                      </a>
                    </div>
                    <div className="col-lg col-4">
                      <a href="/series" className="item d-block text-center text-white py-3 h-100" onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/series';
                      }}>
                        <div className="icn"><i className="icon-monitor"></i></div>
                        <div className="font-size-16">مسلسلات</div>
                      </a>
                    </div>
                    <div className="col-lg col-4">
                      <a href="/programs" className="item d-block text-center text-white py-3 h-100" onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/programs';
                      }}>
                        <div className="icn"><i className="icon-tv"></i></div>
                        <div className="font-size-16">تلفزيون</div>
                      </a>
                    </div>
                    <div className="col-lg col-4">
                      <a href="/games" className="item d-block text-center text-white py-3 h-100" onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/games';
                      }}>
                        <div className="icn"><i className="icon-mix"></i></div>
                        <div className="font-size-16">منوعات</div>
                      </a>
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
  );
}