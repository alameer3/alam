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
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ backgroundColor: '#161619' }}>
      
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

      {/* الهيدر الأصلي مطابق للصورة المرجعية */}
      <header className="relative z-20 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* أيقونة المستخدم الأيسر */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white text-sm mr-2">أهلاً بك ضيفاً</span>
            </div>
            
            {/* شعار اكوام الأيمن */}
            <div className="flex items-center">
              <svg className="w-8 h-8 text-white mr-2" fill="currentColor" viewBox="0 0 87 80">
                <path fillRule="evenodd" d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
              </svg>
              <span className="text-white text-xl font-bold">اكوام</span>
            </div>
          </div>
        </div>
      </header>

      {/* Container الأصلي مطابق للتصميم */}
      <div className="container mx-auto px-6 py-8 flex-1 flex flex-col justify-center items-center">
        
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
            <span className="text font-size-20 font-weight-medium text-white">المكتبة الترفيهية</span>
          </div>
        </div>

        {/* Widget البحث الأصلي */}
        <div className="widget-2 widget mb-4">
          <div className="widget-body row">
            <div className="col-lg-8 mx-auto">
              
              <form className="form d-flex no-gutters mb-20" action="/search" method="get">
                <div className="flex w-full bg-gray-800 rounded-lg overflow-hidden">
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 border-none outline-none" 
                    placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج ..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="px-6 py-3 text-white font-medium"
                    style={{ backgroundColor: '#f3951e' }}
                  >
                    بحث
                  </button>
                </div>
              </form>
              
              {/* الأقسام الأصلية مطابقة للصورة المرجعية */}
              <div className="main-categories-list mt-6">
                <div className="grid grid-cols-4 gap-4">
                  
                  <Link href="/movies" className="category-item group">
                    <div className="bg-gray-800 bg-opacity-80 rounded-lg p-6 text-center text-white hover:border-orange-500 border-2 border-gray-600 transition-all duration-300">
                      <div className="mb-3">
                        <svg className="w-12 h-12 mx-auto text-gray-300 group-hover:text-orange-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                        </svg>
                      </div>
                      <div className="font-size-16 font-medium">أفلام</div>
                    </div>
                  </Link>
                  
                  <Link href="/series" className="category-item group">
                    <div className="bg-gray-800 bg-opacity-80 rounded-lg p-6 text-center text-white hover:border-orange-500 border-2 border-gray-600 transition-all duration-300">
                      <div className="mb-3">
                        <svg className="w-12 h-12 mx-auto text-gray-300 group-hover:text-orange-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm0-4c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm0-4c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm6 8c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm0-4c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm0-4c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm6 8c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm0-4c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm0-4c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1z"/>
                        </svg>
                      </div>
                      <div className="font-size-16 font-medium">مسلسلات</div>
                    </div>
                  </Link>
                  
                  <Link href="/shows" className="category-item group">
                    <div className="bg-gray-800 bg-opacity-80 rounded-lg p-6 text-center text-white hover:border-orange-500 border-2 border-gray-600 transition-all duration-300">
                      <div className="mb-3">
                        <svg className="w-12 h-12 mx-auto text-gray-300 group-hover:text-orange-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 6h-7.59l3.3-3.3c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L12 4.59 8.7 1.3C8.31.9 7.68.9 7.29 1.3c-.39.39-.39 1.02 0 1.41L10.59 6H3c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1zM8 18H4v-7h4v7zm6 0h-4v-7h4v7zm6 0h-4v-7h4v7z"/>
                        </svg>
                      </div>
                      <div className="font-size-16 font-medium">تلفزيون</div>
                    </div>
                  </Link>
                  
                  <Link href="/mix" className="category-item group">
                    <div className="bg-gray-800 bg-opacity-80 rounded-lg p-6 text-center text-white hover:border-orange-500 border-2 border-gray-600 transition-all duration-300">
                      <div className="mb-3">
                        <svg className="w-12 h-12 mx-auto text-gray-300 group-hover:text-orange-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div className="font-size-16 font-medium">منوعات</div>
                    </div>
                  </Link>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="main-categories-list-end"></div>
        
      </div>

      {/* التذييل الأصلي مطابق للصورة المرجعية */}
      <footer className="relative z-20 mt-auto py-8">
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