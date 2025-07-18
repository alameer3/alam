import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Film, Tv, Monitor, Gamepad2, Play, Star, Calendar, Globe, Heart, BookOpen, Users, Trophy } from 'lucide-react';

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

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="min-h-screen page-home" style={{
      background: `linear-gradient(to bottom, rgba(0, 0, 0, .55), #000 100%), url('/images/home-bg.webp')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* استخدام التصميم الأصلي من extracted_files */}
      <div className="container py-5 my-5">
        {/* زر الصفحة الرئيسية الدائري - من الموقع الأصلي */}
        <div className="home-site-btn-container mt-5">
          <h1>
            <a href="/" className="link" style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              zIndex: 10,
              borderRadius: '50%'
            }} />
          </h1>
          <div 
            className="home-site-btn"
            style={{
              backgroundImage: "url('/images/site-new.webp')",
              transition: "background-position 5s"
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

        {/* صندوق البحث والقوائم - من الموقع الأصلي */}
        <div className="widget-2 widget mb-4">
          <div className="widget-body row">
            <div className="col-lg-8 mx-auto" style={{ maxWidth: '66.666667%', margin: '0 auto' }}>
              {/* نموذج البحث المحسن */}
              <form className="form d-flex no-gutters mb-20" style={{ display: 'flex', marginBottom: '20px' }} onSubmit={handleSearch}>
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
                      padding: '12px 16px',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #404047',
                      borderRadius: '4px 0 0 4px',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                  />
                  <label htmlFor="widget2SearchInput" className="m-0" style={{ margin: 0 }}>
                    <span className="label"></span>
                  </label>
                  <div className="label-text d-none" style={{ display: 'none' }}>
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
                      padding: '12px 24px',
                      backgroundColor: '#df820c',
                      border: '1px solid #d37b0b',
                      borderRadius: '0 4px 4px 0',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    بحث
                  </button>
                </div>
              </form>

              {/* القوائم الرئيسية - من الموقع الأصلي */}
              <div className="main-categories-list">
                <div className="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="col-lg col-4">
                    <a href="/movies" className="item d-block text-center text-white py-3 h-100" style={{
                      display: 'block',
                      textAlign: 'center',
                      color: '#fff',
                      padding: '24px 12px',
                      height: '100%',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #404047',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="icn" style={{ marginBottom: '12px' }}>
                        <i className="icon-video-camera" style={{ fontSize: '32px', color: '#df820c' }}></i>
                      </div>
                      <div className="font-size-16" style={{ fontSize: '16px', fontWeight: '600' }}>أفلام</div>
                    </a>
                  </div>
                  <div className="col-lg col-4">
                    <a href="/series" className="item d-block text-center text-white py-3 h-100" style={{
                      display: 'block',
                      textAlign: 'center',
                      color: '#fff',
                      padding: '24px 12px',
                      height: '100%',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #404047',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="icn" style={{ marginBottom: '12px' }}>
                        <i className="icon-monitor" style={{ fontSize: '32px', color: '#df820c' }}></i>
                      </div>
                      <div className="font-size-16" style={{ fontSize: '16px', fontWeight: '600' }}>مسلسلات</div>
                    </a>
                  </div>
                  <div className="col-lg col-4">
                    <a href="/shows" className="item d-block text-center text-white py-3 h-100" style={{
                      display: 'block',
                      textAlign: 'center',
                      color: '#fff',
                      padding: '24px 12px',
                      height: '100%',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #404047',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="icn" style={{ marginBottom: '12px' }}>
                        <i className="icon-tv" style={{ fontSize: '32px', color: '#df820c' }}></i>
                      </div>
                      <div className="font-size-16" style={{ fontSize: '16px', fontWeight: '600' }}>تلفزيون</div>
                    </a>
                  </div>
                  <div className="col-lg col-4">
                    <a href="/mix" className="item d-block text-center text-white py-3 h-100" style={{
                      display: 'block',
                      textAlign: 'center',
                      color: '#fff',
                      padding: '24px 12px',
                      height: '100%',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #404047',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="icn" style={{ marginBottom: '12px' }}>
                        <i className="icon-mix" style={{ fontSize: '32px', color: '#df820c' }}></i>
                      </div>
                      <div className="font-size-16" style={{ fontSize: '16px', fontWeight: '600' }}>منوعات</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-categories-list-end"></div>

        {/* محتوى إضافي مميز */}
        {featuredContent && featuredContent.data && (
          <div className="featured-content mt-5">
            <h2 className="text-white text-2xl font-bold mb-4 text-center">المحتوى المميز</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featuredContent.data.slice(0, 6).map((item: ContentItem) => (
                <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                  <img 
                    src={item.poster || '/serverdata/images/default-poster.svg'} 
                    alt={item.titleAr}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-white text-sm font-semibold truncate">{item.titleAr}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-yellow-500 text-xs">{item.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* المحتوى الحديث */}
        {recentContent && recentContent.data && (
          <div className="recent-content mt-5 mb-10">
            <h2 className="text-white text-2xl font-bold mb-4 text-center">أضيف حديثاً</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentContent.data.slice(0, 12).map((item: ContentItem) => (
                <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                  <img 
                    src={item.poster || '/serverdata/images/default-poster.svg'} 
                    alt={item.titleAr}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-white text-sm font-semibold truncate">{item.titleAr}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-yellow-500 text-xs">{item.rating}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{item.quality}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/30 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-20 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">المحتوى المميز</h2>
            <p className="text-white/70 text-lg">أفضل ما لدينا من أفلام ومسلسلات</p>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredContent?.data?.slice(0, 8).map((item: ContentItem) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
                    <div className="aspect-[2/3] relative">
                      <img 
                        src={item.poster || '/serverdata/images/default-poster.svg'} 
                        alt={item.titleAr}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {item.quality}
                      </div>
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center">
                        <Star className="w-3 h-3 ml-1" />
                        {item.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{item.titleAr}</h3>
                      <div className="flex items-center text-gray-400 text-sm space-x-4 space-x-reverse">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 ml-1" />
                          {new Date(item.releaseDate).getFullYear()}
                        </span>
                        <span className="flex items-center">
                          <Globe className="w-4 h-4 ml-1" />
                          {item.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Content Section */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">أضيف حديثاً</h2>
            <p className="text-white/70 text-lg">أحدث الإضافات لمكتبتنا</p>
          </div>

          {recentLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {recentContent?.data?.slice(0, 12).map((item: ContentItem) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
                    <div className="aspect-[2/3] relative">
                      <img 
                        src={item.poster || '/serverdata/images/default-poster.svg'} 
                        alt={item.titleAr}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                        جديد
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{item.titleAr}</h3>
                      <p className="text-gray-400 text-xs">{new Date(item.releaseDate).getFullYear()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-5xl font-bold mb-2 flex items-center justify-center">
                <Film className="w-12 h-12 ml-2" />
                5000+
              </div>
              <div className="text-xl">أفلام</div>
            </div>
            <div className="text-white">
              <div className="text-5xl font-bold mb-2 flex items-center justify-center">
                <Tv className="w-12 h-12 ml-2" />
                3000+
              </div>
              <div className="text-xl">مسلسلات</div>
            </div>
            <div className="text-white">
              <div className="text-5xl font-bold mb-2 flex items-center justify-center">
                <Monitor className="w-12 h-12 ml-2" />
                1000+
              </div>
              <div className="text-xl">برامج</div>
            </div>
            <div className="text-white">
              <div className="text-5xl font-bold mb-2 flex items-center justify-center">
                <Users className="w-12 h-12 ml-2" />
                100K+
              </div>
              <div className="text-xl">مستخدم</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-orange-500">أكوام</h3>
              <p className="text-gray-400 mb-6">
                المكتبة الترفيهية العربية الأولى لتحميل ومشاهدة الأفلام والمسلسلات والبرامج التلفزيونية
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <a href="#" className="text-2xl hover:text-orange-500 transition-colors">📘</a>
                <a href="#" className="text-2xl hover:text-orange-500 transition-colors">📺</a>
                <a href="#" className="text-2xl hover:text-orange-500 transition-colors">📱</a>
                <a href="#" className="text-2xl hover:text-orange-500 transition-colors">📧</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">الأقسام</h4>
              <ul className="space-y-2">
                <li><a href="/movies" className="text-gray-400 hover:text-white transition-colors">أفلام</a></li>
                <li><a href="/series" className="text-gray-400 hover:text-white transition-colors">مسلسلات</a></li>
                <li><a href="/shows" className="text-gray-400 hover:text-white transition-colors">برامج</a></li>
                <li><a href="/mix" className="text-gray-400 hover:text-white transition-colors">منوعات</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط مفيدة</h4>
              <ul className="space-y-2">
                <li><a href="/recent" className="text-gray-400 hover:text-white transition-colors">أضيف حديثاً</a></li>
                <li><a href="/top-rated" className="text-gray-400 hover:text-white transition-colors">الأعلى تقييماً</a></li>
                <li><a href="/most-viewed" className="text-gray-400 hover:text-white transition-colors">الأكثر مشاهدة</a></li>
                <li><a href="/random" className="text-gray-400 hover:text-white transition-colors">اختيار عشوائي</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2">
                <li><a href="/contactus" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</a></li>
                <li><a href="/dmca" className="text-gray-400 hover:text-white transition-colors">سياسة DMCA</a></li>
                <li><a href="/ad-policy" className="text-gray-400 hover:text-white transition-colors">سياسة الإعلانات</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 موقع أكوام. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;