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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section - نسخة مطابقة للتصميم الأصلي */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.8)), url('https://ak.sv/style/assets/images/home-bg.webp')`
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-block p-8 rounded-full border-4 border-white/20 bg-black/30 backdrop-blur-sm">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-white">
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="1" fill="none" />
                <polygon points="60,30 75,45 60,60 45,45" fill="currentColor" />
                <text x="60" y="90" textAnchor="middle" fontSize="14" fill="currentColor" fontFamily="akoam">
                  المكتبة الترفيهية
                </text>
              </svg>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن فيلم أو مسلسل أو برنامج..."
                  className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-r-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-l-xl transition-colors duration-200 font-semibold"
                >
                  بحث
                </button>
              </div>
            </form>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <a href="/movies" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/60 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4 text-orange-500 group-hover:text-orange-400">
                  <Film className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">أفلام</h3>
                <p className="text-sm text-white/70">مجموعة متنوعة من الأفلام</p>
              </div>
            </a>

            <a href="/series" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/60 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4 text-orange-500 group-hover:text-orange-400">
                  <Tv className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">مسلسلات</h3>
                <p className="text-sm text-white/70">مسلسلات عربية وأجنبية</p>
              </div>
            </a>

            <a href="/shows" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/60 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4 text-orange-500 group-hover:text-orange-400">
                  <Monitor className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">تلفزيون</h3>
                <p className="text-sm text-white/70">برامج تلفزيونية متنوعة</p>
              </div>
            </a>

            <a href="/mix" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/60 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4 text-orange-500 group-hover:text-orange-400">
                  <Gamepad2 className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">منوعات</h3>
                <p className="text-sm text-white/70">ألعاب وتطبيقات</p>
              </div>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
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