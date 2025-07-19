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
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#161619' }}>
      
      {/* خلفية سينمائية ملونة مطابقة للصورة الأصلية */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, rgba(255, 140, 0, 0.3) 0%, rgba(255, 69, 0, 0.2) 25%, transparent 60%),
            radial-gradient(ellipse at 70% 60%, rgba(0, 191, 255, 0.25) 0%, rgba(30, 144, 255, 0.15) 30%, transparent 65%),
            radial-gradient(ellipse at 20% 80%, rgba(255, 20, 147, 0.2) 0%, rgba(138, 43, 226, 0.1) 35%, transparent 70%),
            linear-gradient(135deg, rgba(22, 22, 25, 0.95) 0%, rgba(22, 22, 25, 0.98) 100%)
          `
        }}
      />
      
      {/* طبقة الجزيئات والتأثيرات البصرية */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(255,140,0,0.4), transparent),
          radial-gradient(1px 1px at 90px 40px, rgba(0,191,255,0.3), transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.2), transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px 100px'
      }} />

      {/* الهيدر الأصلي */}
      <header className="relative z-20 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* الشعار الأيسر */}
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">اكوام</span>
              <span className="text-orange-500 text-2xl mr-2">△</span>
            </div>
            
            {/* النص الأيمن */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-white text-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                أضيف حديثاً
              </span>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Container الأصلي مطابق للتصميم */}
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
                  <label htmlFor="widget2SearchInput" className="m-0">
                    <span className="label"></span>
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
              
              {/* الأقسام الأصلية */}
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

      {/* التذييل الأصلي */}
      <footer className="main-footer py-5">
        <nav className="social d-flex justify-content-center">
          <Link href="https://akw.to" target="_blank" className="home mx-2">
            <i className="icon-home"></i>
          </Link>
          <Link href="https://www.facebook.com/akwamnet" target="_blank" className="facebook mx-2">
            <i className="icon-facebook"></i>
          </Link>
          <Link href="https://www.facebook.com/groups/AKOAMweb" target="_blank" className="facebook mx-2">
            <i className="icon-facebook"></i>
          </Link>
          <Link href="https://akw.net.in/" target="_blank" className="app-store mx-2">
            <i className="icon-app-store"></i>
          </Link>
          <Link href="https://www.youtube.com/c/AKWAMnetwork" target="_blank" className="youtube mx-2">
            <i className="icon-youtube"></i>
          </Link>
          <Link href="/AKWAM-Notifications" target="_blank" className="app-store mx-2">
            <i className="icon-app-store"></i>
          </Link>
          <Link href="/contactus" className="email mx-2">
            <i className="icon-email"></i>
          </Link>
        </nav>
        
        <nav className="links d-flex justify-content-center mt-3">
          <Link href="/" className="mx-2">اكوام</Link>
          <Link href="/old" target="_blank" className="mx-2">الموقع القديم</Link>
          <Link href="/dmca" className="mx-2">DMCA</Link>
          <Link href="/ad-policy" className="mx-2">AD-P</Link>
          <Link href="https://ak-news.com" target="_blank" className="mx-2">اكوام نيوز</Link>
          <Link href="https://akw.net.co" target="_blank" className="mx-2">شبكة اكوام</Link>
        </nav>
        
        <p className="copyright mb-0 font-size-12 text-center mt-3">
          جميع الحقوق محفوظة لـ شبكة اكوام © 2025
        </p>
      </footer>


    </div>
  );
}