import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
    <div className="min-h-screen" dir="rtl" style={{ fontFamily: 'akoam, Arial, sans-serif', backgroundColor: '#161619' }}>
      {/* Site Overlay */}
      <span 
        className={`site-overlay ${isMenuActive || isSearchActive ? 'visible opacity-100' : 'invisible opacity-0'} fixed inset-0 bg-black bg-opacity-85 z-30 transition-all duration-500`}
        onClick={() => {
          setIsMenuActive(false);
          setIsSearchActive(false);
        }}
      />

      {/* Main Menu - مطابق للأصل */}
      <div className={`main-menu fixed right-0 left-0 bottom-0 top-[70px] z-45 overflow-y-auto bg-[#27272c] border-t border-[#111114] transition-all duration-500 ${isMenuActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="h-full flex flex-col">
          <div className="my-auto w-full">
            <div className="flex flex-wrap justify-center">
              {[
                { href: '/movies', icon: 'icon-video-camera', text: 'أفلام' },
                { href: '/series', icon: 'icon-monitor', text: 'مسلسلات' },
                { href: '/shows', icon: 'icon-tv', text: 'تلفزيون' },
                { href: '/mix', icon: 'icon-mix', text: 'منوعات' }
              ].map((item, index) => (
                <a key={index} href={item.href} className="item text-white flex items-center justify-center mx-5 my-8 hover:text-[#f3951e] transition-colors duration-300">
                  <div className={`icn ml-3 text-5xl transform transition-all duration-500 ${isMenuActive ? 'translate-y-0 opacity-100' : 'translate-y-[70%] opacity-0'}`}>
                    {item.icon === 'icon-video-camera' ? '🎬' : item.icon === 'icon-monitor' ? '📺' : item.icon === 'icon-tv' ? '📻' : '🎮'}
                  </div>
                  <div className={`text min-w-[70px] text-xl text-right transform transition-all duration-500 ${isMenuActive ? 'translate-x-0 opacity-100' : 'translate-x-[-10%] opacity-0'}`}>
                    {item.text}
                  </div>
                </a>
              ))}
            </div>
          </div>
          <nav className="social flex justify-center pb-8">
            {[
              { href: 'https://akw.to', icon: '🏠', class: 'home' },
              { href: 'https://www.facebook.com/akwamnet', icon: '📘', class: 'facebook' },
              { href: 'https://www.youtube.com/c/AKWAMnetwork', icon: '📹', class: 'youtube' },
              { href: '/contactus', icon: '✉️', class: 'email' }
            ].map((social, index) => (
              <a 
                key={index} 
                href={social.href} 
                className={`w-10 h-10 text-[#777] text-xs cursor-pointer relative rounded-full border border-[#777] mx-2 flex items-center justify-center transition-all duration-500 hover:text-white hover:border-white ${isMenuActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[50%]'}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
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
          {/* Header - مطابق للأصل */}
          <header className="main-header h-[70px] fixed top-0 left-0 right-0 z-40 bg-[#161619] border-b border-[#333]">
            <div className="container mx-auto px-4">
              <div className="flex items-center h-[70px]">
                <div className="flex items-center">
                  <h2 className="main-logo m-0">
                    <a href="/ones" className="inline-flex">
                      <svg 
                        className="w-12 h-12 text-white" 
                        viewBox="0 0 87 80" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
                      </svg>
                    </a>
                  </h2>
                </div>
                <div className="mr-4">
                  <button 
                    onClick={() => setIsMenuActive(!isMenuActive)}
                    className={`menu-toggle flex items-center text-white transition-colors duration-500 ${isMenuActive ? 'text-[#f3951e]' : ''}`}
                  >
                    <span className="icn relative w-6 h-5 flex flex-col justify-between ml-3">
                      <span className="w-full h-0.5 bg-current transition-all duration-500"></span>
                      <span className="w-full h-0.5 bg-current transition-all duration-500"></span>
                      <span className="w-full h-0.5 bg-current transition-all duration-500"></span>
                    </span>
                    <div className="text text-lg">الأقسام</div>
                  </button>
                </div>
                <div className="mr-auto"></div>
                <div className="flex-1 max-w-md mx-4 hidden md:block">
                  <div className="search-form relative">
                    <form onSubmit={handleSearch}>
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 px-4 bg-white/10 text-white placeholder-white/70 rounded-lg border border-white/20 outline-none focus:border-[#f3951e]"
                        placeholder="ابحث عن فيلم او مسلسل ..."
                        dir="rtl"
                      />
                      <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-[#f3951e]">
                        🔍
                      </button>
                    </form>
                  </div>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsSearchActive(true)}
                    className="search-toggle text-white hover:text-[#f3951e] text-xl mr-4 md:hidden"
                  >
                    🔍
                  </button>
                  <a href="/recent" className="btn-recently text-white hover:text-[#f3951e] flex items-center mr-4">
                    <span className="ml-2">➕</span>
                    <span>أضيف حديثا</span>
                  </a>
                  <a href="/login" className="user-toggle text-white hover:text-[#f3951e] text-xl">
                    👤
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content - مطابق تماماً للصورة المرجعية */}
          <div className="pt-[70px]">
            <div className="container mx-auto px-4 py-20">
              
              {/* Central Site Button - الشعار الدائري الأصلي */}
              <div className="home-site-btn-container mt-20 mb-16 text-center">
                <h1 className="relative">
                  <a href="/ones" className="absolute inset-0 z-10"></a>
                </h1>
                <div 
                  className="home-site-btn w-[320px] h-[320px] mx-auto relative bg-center bg-cover rounded-full flex items-center justify-center border-8 border-white/20 shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer"
                  style={{
                    backgroundImage: `url('/serverdata/images/site-new.webp')`,
                    backgroundSize: 'cover',
                    transition: 'background-position 5s'
                  }}
                >
                  <div className="text-center">
                    <span className="logo block mb-4">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="87px" 
                        height="80px" 
                        className="mx-auto"
                      >
                        <path 
                          fillRule="evenodd" 
                          fill="rgb(255, 255, 255)" 
                          d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"
                        />
                      </svg>
                    </span>
                    <span className="text text-xl font-medium text-white">
                      الصفحة الرئيسية
                    </span>
                  </div>
                </div>
              </div>

              {/* Search Widget - مطابق للأصل */}
              <div className="widget-2 widget mb-4">
                <div className="widget-body">
                  <div className="max-w-4xl mx-auto">
                    <form className="form flex mb-8" onSubmit={handleSearch}>
                      <div className="flex-1 pl-3">
                        <input 
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="form-control w-full h-16 px-6 bg-white/10 text-white placeholder-white/70 rounded-r-xl border border-white/20 outline-none focus:border-[#f3951e] text-lg"
                          placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج ..."
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <button 
                          type="submit" 
                          className="btn btn-orange h-16 px-8 bg-[#f3951e] text-white font-bold rounded-l-xl hover:bg-[#e8851a] transition-colors duration-300"
                        >
                          بحث
                        </button>
                      </div>
                    </form>

                    {/* Main Categories - الأقسام الأربعة مطابقة للأصل */}
                    <div className="main-categories-list">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { href: '/movies', icon: '🎬', text: 'أفلام' },
                          { href: '/series', icon: '📺', text: 'مسلسلات' },
                          { href: '/shows', icon: '📻', text: 'تلفزيون' },
                          { href: '/mix', icon: '🎮', text: 'منوعات' }
                        ].map((item, index) => (
                          <div key={index} className="lg:col-span-1 col-span-1">
                            <a 
                              href={item.href} 
                              className="item block text-center text-white py-8 h-full bg-[rgba(39,39,44,0.8)] rounded-xl hover:bg-[rgba(39,39,44,0.9)] transition-all duration-300 border border-gray-600 hover:border-[#f3951e] group"
                            >
                              <div className="icn text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                              </div>
                              <div className="text-lg font-medium group-hover:text-[#f3951e] transition-colors">
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