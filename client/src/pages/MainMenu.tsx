import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Film, Tv, Monitor, Gamepad2, Play, Star, Calendar, Globe, Users, TrendingUp, Award, Clock, Menu, X } from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  titleAr: string;
  type: string;
  poster: string;
  rating: number;
  releaseDate: string;
  quality: string;
  country: string;
}

const MainMenu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/content/featured'],
    enabled: true
  });

  const { data: recentContent, isLoading: recentLoading } = useQuery({
    queryKey: ['/api/content/recent'],
    enabled: true
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAll();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'akoam, Cairo, sans-serif' }}>
      {/* خلفية الصفحة الرئيسية */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, .55), #000 100%), url(https://ak.sv/style/assets/images/home-bg.webp)'
        }}
      />
      
      {/* Site Overlay */}
      <span 
        className={`site-overlay fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isMenuOpen || isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeAll}
      ></span>

      {/* القائمة الرئيسية الجانبية */}
      <div className={`main-menu fixed top-0 left-0 h-full w-80 bg-black/90 backdrop-blur-md z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="d-flex flex-column h-full">
          <div className="my-auto w-100">
            <div className="menu d-flex flex-wrap justify-content-center p-4">
              <a href="/movies" className="item block w-full p-4 text-center text-white hover:bg-white/10 rounded-lg mb-2 transition-colors">
                <div className="icn mb-2">
                  <Film className="w-8 h-8 mx-auto" />
                </div>
                <div className="text text-lg">أفلام</div>
              </a>
              <a href="/series" className="item block w-full p-4 text-center text-white hover:bg-white/10 rounded-lg mb-2 transition-colors">
                <div className="icn mb-2">
                  <Tv className="w-8 h-8 mx-auto" />
                </div>
                <div className="text text-lg">مسلسلات</div>
              </a>
              <a href="/shows" className="item block w-full p-4 text-center text-white hover:bg-white/10 rounded-lg mb-2 transition-colors">
                <div className="icn mb-2">
                  <Monitor className="w-8 h-8 mx-auto" />
                </div>
                <div className="text text-lg">تلفزيون</div>
              </a>
              <a href="/mix" className="item block w-full p-4 text-center text-white hover:bg-white/10 rounded-lg mb-2 transition-colors">
                <div className="icn mb-2">
                  <Gamepad2 className="w-8 h-8 mx-auto" />
                </div>
                <div className="text text-lg">منوعات</div>
              </a>
            </div>
          </div>
          
          {/* وسائل التواصل الاجتماعي */}
          <nav className="social d-flex justify-content-center p-4 border-t border-white/10">
            <a href="#" className="home mx-2 text-white hover:text-orange-500 transition-colors">
              <Globe className="w-6 h-6" />
            </a>
            <a href="#" className="facebook mx-2 text-white hover:text-blue-500 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="youtube mx-2 text-white hover:text-red-500 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" className="email mx-2 text-white hover:text-green-500 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
              </svg>
            </a>
          </nav>
        </div>
      </div>

      {/* صندوق البحث */}
      <div className={`search-box fixed top-0 left-0 right-0 h-full bg-black/90 backdrop-blur-md z-40 ${isSearchOpen ? 'flex' : 'hidden'}`}>
        <div className="container mx-auto p-4 h-full flex items-center justify-center">
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="flex items-center bg-white/10 rounded-full p-2">
              <button type="submit" className="p-3 text-white hover:text-orange-500 transition-colors">
                <Search className="w-6 h-6" />
              </button>
              <input 
                type="search" 
                name="q" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث هنا"
                className="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-2 outline-none"
              />
            </div>
          </form>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="site-container relative z-10">
        <div className="page-home">
          
          {/* الشريط العلوي */}
          <header className="main-header fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-sm z-40 border-b border-white/10">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <h2 className="main-logo text-2xl font-bold text-white">
                    <a href="/" className="flex items-center space-x-2 space-x-reverse">
                      <svg width="40" height="40" viewBox="0 0 87 80" className="text-white">
                        <path fillRule="evenodd" fill="currentColor" d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
                      </svg>
                      <span>أكوام</span>
                    </a>
                  </h2>
                  <button onClick={toggleMenu} className="menu-toggle flex items-center text-white hover:text-orange-500 transition-colors">
                    <span className="icn mr-2">
                      {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </span>
                    <span className="text">الأقسام</span>
                  </button>
                </div>
                
                <div className="flex-1 max-w-md mx-8">
                  <form onSubmit={handleSearch} className="search-form">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن فيلم او مسلسل ..."
                        className="w-full bg-white/10 text-white placeholder-white/60 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-500 transition-colors">
                        <Search className="w-5 h-5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={toggleSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-500 transition-colors md:hidden"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="flex items-center space-x-4 space-x-reverse">
                  <a href="/recent" className="btn-recently flex items-center text-white hover:text-orange-500 transition-colors">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>أضيف حديثا</span>
                  </a>
                  <a href="/login" className="text-white hover:text-orange-500 transition-colors">
                    <Users className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* المحتوى الرئيسي */}
          <div className="container mx-auto px-4 pt-24 pb-16">
            
            {/* زر الصفحة الرئيسية */}
            <div className="home-site-btn-container mt-20 mb-16">
              <a href="/ones" className="block relative">
                <div 
                  className="home-site-btn relative overflow-hidden rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-500"
                  style={{
                    backgroundImage: "url('https://ak.sv/style/assets/images/site-new.webp')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '200px'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-green-600/80"></div>
                  <div className="relative z-10">
                    <span className="logo mb-4 block">
                      <svg width="80" height="80" viewBox="0 0 87 80" className="mx-auto text-white">
                        <path fillRule="evenodd" fill="currentColor" d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
                      </svg>
                    </span>
                    <span className="text text-2xl font-bold text-white">الصفحة الرئيسية</span>
                  </div>
                </div>
              </a>
            </div>

            {/* محرك البحث الرئيسي */}
            <div className="widget-2 widget mb-16">
              <div className="widget-body">
                <div className="max-w-4xl mx-auto">
                  <form onSubmit={handleSearch} className="form flex bg-white/10 rounded-full p-2 mb-8">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-white/60 px-6 py-3 outline-none"
                        placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج ..."
                      />
                    </div>
                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full transition-colors">
                      بحث
                    </button>
                  </form>
                  
                  {/* الفئات الرئيسية */}
                  <div className="main-categories-list">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <a href="/movies" className="item block text-center text-white py-6 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                        <div className="icn mb-3">
                          <Film className="w-12 h-12 mx-auto text-blue-400" />
                        </div>
                        <div className="text-lg font-medium">أفلام</div>
                      </a>
                      <a href="/series" className="item block text-center text-white py-6 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                        <div className="icn mb-3">
                          <Tv className="w-12 h-12 mx-auto text-green-400" />
                        </div>
                        <div className="text-lg font-medium">مسلسلات</div>
                      </a>
                      <a href="/shows" className="item block text-center text-white py-6 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                        <div className="icn mb-3">
                          <Monitor className="w-12 h-12 mx-auto text-red-400" />
                        </div>
                        <div className="text-lg font-medium">تلفزيون</div>
                      </a>
                      <a href="/mix" className="item block text-center text-white py-6 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                        <div className="icn mb-3">
                          <Gamepad2 className="w-12 h-12 mx-auto text-orange-400" />
                        </div>
                        <div className="text-lg font-medium">منوعات</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* المحتوى المميز */}
            {featuredContent?.data?.length > 0 && (
              <div className="featured-content mb-16">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">المحتوى المميز</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {featuredContent.data.map((item: ContentItem) => (
                    <div key={item.id} className="content-card group">
                      <a href={`/content/${item.id}`} className="block">
                        <div className="relative overflow-hidden rounded-lg">
                          <img 
                            src={item.poster || '/serverdata/images/default-poster.svg'} 
                            alt={item.titleAr}
                            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center space-x-2 space-x-reverse text-sm">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span>{item.rating}</span>
                              <span className="bg-orange-500 px-2 py-1 rounded text-xs">{item.quality}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-3">
                          <h3 className="text-white font-medium text-sm truncate">{item.titleAr}</h3>
                          <p className="text-white/60 text-xs mt-1">{new Date(item.releaseDate).getFullYear()}</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* المحتوى الأحدث */}
            {recentContent?.data?.length > 0 && (
              <div className="recent-content mb-16">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">أحدث الإضافات</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {recentContent.data.map((item: ContentItem) => (
                    <div key={item.id} className="content-card group">
                      <a href={`/content/${item.id}`} className="block">
                        <div className="relative overflow-hidden rounded-lg">
                          <img 
                            src={item.poster || '/serverdata/images/default-poster.svg'} 
                            alt={item.titleAr}
                            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center space-x-2 space-x-reverse text-sm">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span>{item.rating}</span>
                              <span className="bg-orange-500 px-2 py-1 rounded text-xs">{item.quality}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-3">
                          <h3 className="text-white font-medium text-sm truncate">{item.titleAr}</h3>
                          <p className="text-white/60 text-xs mt-1">{new Date(item.releaseDate).getFullYear()}</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* الفوتر */}
      <footer className="main-footer py-12 bg-black/50 backdrop-blur-sm border-t border-white/10">
        <nav className="social flex justify-center space-x-6 space-x-reverse mb-6">
          <a href="#" className="text-white hover:text-orange-500 transition-colors">
            <Globe className="w-6 h-6" />
          </a>
          <a href="#" className="text-white hover:text-blue-500 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="text-white hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="#" className="text-white hover:text-green-500 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
            </svg>
          </a>
        </nav>

        <nav className="links flex justify-center space-x-6 space-x-reverse text-sm mb-4">
          <a href="/" className="text-white/60 hover:text-white transition-colors">أكوام</a>
          <a href="/old" className="text-white/60 hover:text-white transition-colors">الموقع القديم</a>
          <a href="/dmca" className="text-white/60 hover:text-white transition-colors">DMCA</a>
          <a href="/ad-policy" className="text-white/60 hover:text-white transition-colors">AD-P</a>
        </nav>

        <p className="copyright text-center text-white/60 text-sm">
          جميع الحقوق محفوظة لـ شبكة أكوام © 2025
        </p>
      </footer>
    </div>
  );
};

export default MainMenu;