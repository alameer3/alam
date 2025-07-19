import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import '../styles/home-authentic.css';

interface ContentItem {
  id: number;
  title: string;
  titleAr: string;
  type: 'movie' | 'series' | 'show' | 'mix';
  poster: string;
  rating: number;
  releaseDate: string;
  quality: string;
  country: string;
  genres: string[];
  description: string;
}

interface DashboardStats {
  totalContent: number;
  totalMovies: number;
  totalSeries: number;
  totalUsers: number;
  totalCategories: number;
  totalGenres: number;
}

export default function HomeAuthentic() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // تطبيق CSS الأصلي على الجسم عند تحميل الصفحة
  React.useEffect(() => {
    document.body.style.backgroundColor = '#161619';
    document.body.style.fontFamily = 'akoam, Arial, Helvetica, sans-serif';
    document.body.style.direction = 'rtl';
    document.body.style.textAlign = 'right';
    
    return () => {
      // تنظيف التأثيرات عند إلغاء تحميل الصفحة
      document.body.style.backgroundColor = '';
      document.body.style.fontFamily = '';
      document.body.style.direction = '';
      document.body.style.textAlign = '';
    };
  }, []);
  
  // جلب إحصائيات الموقع
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/stats'],
  });

  // جلب المحتوى المميز
  const { data: featuredContent } = useQuery<{
    data: ContentItem[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ['/api/content', { limit: 12, featured: true }],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div 
      className="min-h-screen" 
      dir="rtl" 
      style={{ 
        fontFamily: 'akoam, Arial, sans-serif', 
        backgroundColor: '#161619', 
        lineHeight: 1.5,
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, .55), #000 100%), url(/serverdata/images/home-bg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Site Overlay */}
      <span 
        className={`site-overlay ${isMenuActive || isSearchActive ? 'visible opacity-100' : 'invisible opacity-0'} fixed inset-0 bg-black bg-opacity-85 z-30 transition-all duration-500`}
        onClick={() => {
          setIsMenuActive(false);
          setIsSearchActive(false);
        }}
      />

      {/* القائمة الجانبية مطابقة 100% للأصل */}
      <div className={`main-menu fixed right-0 left-0 bottom-0 top-[70px] z-45 overflow-y-auto bg-[#27272c] border-t border-[#111114] transition-all duration-500 ${isMenuActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="h-full flex flex-col justify-between">
          {/* قائمة الأقسام الرئيسية */}
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-8 w-full max-w-lg px-8">
              {[
                { href: '/movies', icon: '🎬', text: 'أفلام', delay: '0.25s' },
                { href: '/series', icon: '📺', text: 'مسلسلات', delay: '0.5s' },
                { href: '/shows', icon: '📻', text: 'تلفزيون', delay: '0.75s' },
                { href: '/mix', icon: '🎮', text: 'منوعات', delay: '1s' }
              ].map((item, index) => (
                <a 
                  key={index} 
                  href={item.href} 
                  className="item text-white flex flex-col items-center justify-center py-8 hover:text-[#f3951e] transition-colors duration-300"
                  onClick={() => setIsMenuActive(false)}
                >
                  <div 
                    className={`icn text-5xl mb-4 transform transition-all duration-500 ${isMenuActive ? 'translate-y-0 opacity-100' : 'translate-y-[70%] opacity-0'}`}
                    style={{ transitionDelay: isMenuActive ? item.delay : '0s' }}
                  >
                    {item.icon}
                  </div>
                  <div 
                    className={`text text-xl font-medium text-center transform transition-all duration-500 ${isMenuActive ? 'translate-x-0 opacity-100' : 'translate-x-[-10%] opacity-0'}`}
                    style={{ transitionDelay: isMenuActive ? item.delay : '0s' }}
                  >
                    {item.text}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* أيقونات التواصل الاجتماعي في الأسفل */}
          <nav className="social flex justify-center pb-8">
            {[
              { href: 'https://akw.to', icon: '🏠', name: 'الموقع الرئيسي', delay: '0.1s' },
              { href: 'https://www.facebook.com/akwamnet', icon: '📘', name: 'فيسبوك', delay: '0.2s' },
              { href: 'https://www.youtube.com/c/AKWAMnetwork', icon: '📹', name: 'يوتيوب', delay: '0.3s' },
              { href: '/contactus', icon: '✉️', name: 'اتصل بنا', delay: '0.4s' }
            ].map((social, index) => (
              <a 
                key={index} 
                href={social.href} 
                className={`w-10 h-10 text-[#777] text-sm cursor-pointer relative rounded-full border border-[#777] mx-2 flex items-center justify-center transition-all duration-500 hover:text-white hover:border-white ${isMenuActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[50%]'}`}
                style={{ transitionDelay: isMenuActive ? social.delay : '0s' }}
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Search Box - مطابق للأصل */}
      <div className={`search-box w-full h-[70px] fixed top-0 right-0 z-52 bg-white shadow-lg transition-all duration-500 ${isSearchActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="search-container px-4 relative">
          <form onSubmit={handleSearch} className="min-h-[70px]">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[70px] border-none text-2xl bg-transparent outline-none text-[#161619] pr-4"
              placeholder="ابحث هنا"
              dir="rtl"
            />
          </form>
          <div 
            className="search-toggle text-2xl absolute top-1/2 left-4 z-5 cursor-pointer transform -translate-y-1/2"
            onClick={() => setIsSearchActive(false)}
          >
            ←
          </div>
        </div>
      </div>

      {/* Main Content - خلفية مطابقة للأصل */}
      <div 
        className="site-container min-h-screen"
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, .55), #000 100%), url('/serverdata/images/home-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="page-home">
          {/* Header مطابق 100% للموقع الأصلي */}
          <header className="main-header h-[70px] fixed top-0 left-0 right-0 z-40 bg-[#161619] border-b border-[#333]">
            <div className="h-full flex items-center px-4 max-w-7xl mx-auto">
              {/* الشعار - يسار الشاشة */}
              <div className="flex items-center">
                <h2 className="main-logo m-0">
                  <a href="/ones" className="inline-flex items-center">
                    <svg 
                      className="w-8 h-7 text-white mr-2" 
                      viewBox="0 0 87 80" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
                    </svg>
                    <span className="text-white text-lg font-bold" style={{ fontFamily: 'akoam, Arial, sans-serif' }}>
                      اكوام
                    </span>
                  </a>
                </h2>
              </div>

              {/* زر القائمة - بجانب الشعار */}
              <div className="mr-6">
                <button 
                  onClick={() => setIsMenuActive(!isMenuActive)}
                  className={`menu-toggle flex items-center text-white transition-colors duration-300 hover:text-[#f3951e] ${isMenuActive ? 'text-[#f3951e]' : ''}`}
                >
                  <span className="icn relative w-5 h-4 flex flex-col justify-between mr-2">
                    <span className="w-full h-0.5 bg-current"></span>
                    <span className="w-full h-0.5 bg-current"></span>
                    <span className="w-full h-0.5 bg-current"></span>
                  </span>
                  <span className="text text-sm">القائمة</span>
                </button>
              </div>

              {/* مساحة فارغة للوسط */}
              <div className="flex-1"></div>

              {/* أزرار يمين الهيدر */}
              <div className="flex items-center gap-4">
                {/* زر البحث للشاشات الصغيرة */}
                <button 
                  onClick={() => setIsSearchActive(true)}
                  className="search-toggle text-white hover:text-[#f3951e] text-lg transition-colors md:hidden"
                  title="بحث"
                >
                  🔍
                </button>

                {/* شريط البحث للشاشات الكبيرة */}
                <div className="hidden md:block max-w-sm">
                  <div className="search-form relative">
                    <form onSubmit={handleSearch}>
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-9 px-3 bg-white/10 text-white placeholder-white/60 rounded border border-white/20 outline-none focus:border-[#f3951e] text-sm transition-colors"
                        placeholder="بحث سريع..."
                        dir="rtl"
                        style={{ fontSize: '14px' }}
                      />
                      <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-[#f3951e] text-sm">
                        🔍
                      </button>
                    </form>
                  </div>
                </div>

                {/* أيقونة المستخدم */}
                <a href="/login" className="user-toggle text-white hover:text-[#f3951e] text-lg transition-colors" title="تسجيل دخول">
                  👤
                </a>
              </div>
            </div>
          </header>

          {/* Main Content - مطابق تماماً للصورة المرجعية */}
          <div className="pt-[70px]">
            <div className="container mx-auto px-4 py-20">
              
              {/* Central Site Button - مطابق تماماً للكود الأصلي */}
              <div className="home-site-btn-container mt-5" style={{ position: 'relative', textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
                <h1 style={{ position: 'relative', margin: 0 }}>
                  <a href="/ones" className="link" style={{ position: 'absolute', top: '-40px', right: '50%', transform: 'translateX(50%)', width: '320px', height: '320px', zIndex: 10, borderRadius: '50%' }}></a>
                </h1>
                <div 
                  className="home-site-btn"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #f3951e 0%, #ff6b35 50%, #f39c12 100%)",
                    transition: 'background-position 5s, transform 0.5s ease',
                    width: '320px',
                    height: '320px',
                    margin: '0 auto',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    border: '8px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(243, 149, 30, 0.3)',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 0 60px rgba(0, 0, 0, 0.7), 0 0 120px rgba(243, 149, 30, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(243, 149, 30, 0.3)';
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <span className="logo" style={{ display: 'block', marginBottom: '16px' }}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="87px" 
                        height="80px"
                        style={{ 
                          filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))',
                          margin: '0 auto',
                          display: 'block'
                        }}
                      >
                        <path 
                          fillRule="evenodd" 
                          fill="rgb(255, 255, 255)" 
                          d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"
                        />
                      </svg>
                    </span>
                    <span 
                      className="text" 
                      style={{ 
                        fontSize: '22px', 
                        fontWeight: 600, 
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                        fontFamily: 'akoam, Arial, sans-serif'
                      }}
                    >
                      المكتبة الترفيهية
                    </span>
                  </div>
                </div>
              </div>

              {/* Widget-2 مطابق تماماً للكود الأصلي */}
              <div className="widget-2 widget mb-4" style={{ marginBottom: '40px' }}>
                <div className="widget-body row">
                  <div className="col-lg-8 mx-auto" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                    <form className="form d-flex no-gutters mb-20" onSubmit={handleSearch} style={{ display: 'flex', marginBottom: '20px' }}>
                      <div className="col pl-12" style={{ flex: 1, paddingLeft: '12px' }}>
                        <input 
                          type="text" 
                          className="form-control"
                          id="widget2SearchInput"
                          name="q"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            height: '50px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px 0 0 8px',
                            color: 'white',
                            padding: '15px 20px',
                            fontSize: '16px',
                            outline: 'none',
                            direction: 'rtl'
                          }}
                          placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج ..."
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
                        <button 
                          type="submit" 
                          className="btn btn-orange"
                          style={{
                            backgroundColor: '#f3951e',
                            border: 'none',
                            color: 'white',
                            padding: '15px 30px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            borderRadius: '0 8px 8px 0',
                            cursor: 'pointer',
                            height: '50px'
                          }}
                        >
                          بحث
                        </button>
                      </div>
                    </form>

                    {/* Main Categories List - مطابق تماماً للأصل */}
                    <div className="main-categories-list" style={{ marginTop: '40px' }}>
                      <div className="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '0' }}>
                        {[
                          { href: '/movies', iconClass: 'icon-video-camera', text: 'أفلام', icon: '🎬' },
                          { href: '/series', iconClass: 'icon-monitor', text: 'مسلسلات', icon: '📺' },
                          { href: '/shows', iconClass: 'icon-tv', text: 'تلفزيون', icon: '📻' },
                          { href: '/mix', iconClass: 'icon-mix', text: 'منوعات', icon: '🎮' }
                        ].map((item, index) => (
                          <div key={index} className="col-lg col-4" style={{ flex: '1 1 25%', padding: '0 8px', minWidth: '200px' }}>
                            <a 
                              href={item.href} 
                              className="item d-block text-center text-white py-3 h-100"
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: 'white',
                                padding: '32px 24px',
                                height: '100%',
                                backgroundColor: 'rgba(39, 39, 44, 0.8)',
                                border: '1px solid rgba(128, 128, 128, 0.6)',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                minHeight: '160px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(39, 39, 44, 0.9)';
                                e.currentTarget.style.borderColor = '#f3951e';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(243, 149, 30, 0.3)';
                                const icon = e.currentTarget.querySelector('.icn');
                                if (icon) icon.style.transform = 'scale(1.15)';
                                const text = e.currentTarget.querySelector('.text');
                                if (text) text.style.color = '#f3951e';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(39, 39, 44, 0.8)';
                                e.currentTarget.style.borderColor = 'rgba(128, 128, 128, 0.6)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                                const icon = e.currentTarget.querySelector('.icn');
                                if (icon) icon.style.transform = 'scale(1)';
                                const text = e.currentTarget.querySelector('.text');
                                if (text) text.style.color = 'white';
                              }}
                            >
                              <div className="icn" style={{ fontSize: '48px', marginBottom: '16px', transition: 'transform 0.3s ease' }}>
                                {item.icon}
                              </div>
                              <div className="text font-size-16" style={{ fontSize: '18px', fontWeight: '500', transition: 'color 0.3s ease' }}>
                                {item.text}
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Categories List End */}
              <div className="main-categories-list-end"></div>

              {/* إحصائيات الموقع - إذا كانت متوفرة */}
              {stats && (
                <div className="max-w-4xl mx-auto mt-16">
                  <div className="bg-[rgba(39,39,44,0.8)] rounded-xl p-8 border border-gray-600">
                    <h2 className="text-center text-white text-2xl font-bold mb-8">إحصائيات الموقع</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-[#f3951e] text-4xl font-bold">{stats.totalContent}</div>
                        <div className="text-white/70 text-sm mt-2">إجمالي المحتوى</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#f3951e] text-4xl font-bold">{stats.totalMovies}</div>
                        <div className="text-white/70 text-sm mt-2">الأفلام</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#f3951e] text-4xl font-bold">{stats.totalSeries}</div>
                        <div className="text-white/70 text-sm mt-2">المسلسلات</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#f3951e] text-4xl font-bold">{stats.totalUsers}</div>
                        <div className="text-white/70 text-sm mt-2">المستخدمون</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - مطابق للأصل */}
          <footer className="main-footer py-12 bg-[#1a1a1d] border-t border-[#333]">
            <nav className="social flex justify-center">
              {[
                { href: 'https://akw.to', icon: '🏠', class: 'home' },
                { href: 'https://www.facebook.com/akwamnet', icon: '📘', class: 'facebook' },
                { href: 'https://www.youtube.com/c/AKWAMnetwork', icon: '📹', class: 'youtube' },
                { href: '/contactus', icon: '✉️', class: 'email' }
              ].map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  className="w-12 h-12 text-[#777] cursor-pointer relative rounded-full border border-[#777] mx-3 flex items-center justify-center hover:text-white hover:border-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </nav>
            <div className="text-center text-[#777] text-sm mt-8">
              جميع الحقوق محفوظة لـ شبكة اكوام © 2025
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}