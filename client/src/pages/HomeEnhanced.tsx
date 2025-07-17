import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Film, Tv, Monitor, Gamepad2, Play, Star, Calendar, Globe, Users, TrendingUp, Award, Clock } from 'lucide-react';

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

const HomeEnhanced = () => {
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

  const categories = [
    { 
      href: '/movies', 
      icon: Film, 
      title: 'أفلام', 
      description: 'للأفلام',
      color: 'from-blue-500 to-purple-600',
      count: '5000+'
    },
    { 
      href: '/series', 
      icon: Tv, 
      title: 'مسلسلات', 
      description: 'للمسلسلات',
      color: 'from-green-500 to-teal-600',
      count: '3000+'
    },
    { 
      href: '/shows', 
      icon: Monitor, 
      title: 'تلفزيون', 
      description: 'للتلفزيون',
      color: 'from-red-500 to-pink-600',
      count: '1000+'
    },
    { 
      href: '/mix', 
      icon: Gamepad2, 
      title: 'منوعات', 
      description: 'للمنوعات',
      color: 'from-orange-500 to-yellow-600',
      count: '500+'
    }
  ];

  const stats = [
    { icon: Film, value: '5000+', label: 'أفلام', color: 'text-blue-400' },
    { icon: Tv, value: '3000+', label: 'مسلسلات', color: 'text-green-400' },
    { icon: Monitor, value: '1000+', label: 'برامج', color: 'text-red-400' },
    { icon: Users, value: '100K+', label: 'مستخدم', color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'akoam, Cairo, sans-serif' }}>
      {/* Header العلوي */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <a href="/" className="text-white text-xl font-bold">أكوام</a>
            </div>
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              <a href="/" className="text-white/80 hover:text-white transition-colors">الرئيسية</a>
              <a href="/movies" className="text-white/80 hover:text-white transition-colors">أفلام</a>
              <a href="/series" className="text-white/80 hover:text-white transition-colors">مسلسلات</a>
              <a href="/shows" className="text-white/80 hover:text-white transition-colors">برامج</a>
              <a href="/mix" className="text-white/80 hover:text-white transition-colors">منوعات</a>
            </nav>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="text-white/80 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-white/80 hover:text-white transition-colors">
                تسجيل الدخول
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-black/80"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://ak.sv/style/assets/images/home-bg.webp')`
          }}
        />
        
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          {/* Logo */}
          <div className="mb-12 animate-fade-in">
            <div className="inline-block p-8 rounded-full border-4 border-white/20 bg-black/30 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-500">
              <svg width="120" height="120" viewBox="0 0 120 120" className="text-white">
                <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
                <polygon points="60,25 80,50 60,75 40,50" fill="currentColor" />
                <text x="60" y="95" textAnchor="middle" fontSize="12" fill="currentColor" fontFamily="akoam">
                  المكتبة الترفيهية
                </text>
              </svg>
            </div>
            <h1 className="text-5xl font-bold mt-6 mb-2 text-white drop-shadow-lg">أكوام</h1>
            <p className="text-2xl text-white/80 drop-shadow-md">موقع التحميل والمشاهدة العربي الأول</p>
          </div>

          {/* Search Bar */}
          <div className="mb-16">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative flex shadow-2xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن فيلم أو مسلسل أو برنامج..."
                  className="w-full px-8 py-5 text-xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-r-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-l-xl font-semibold transition-all duration-200 hover:shadow-lg text-xl"
                >
                  بحث
                </button>
              </div>
            </form>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <a key={index} href={category.href} className="group">
                <div className="relative bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-black/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center group-hover:bg-orange-500/30">
                      <category.icon className="w-8 h-8 text-orange-500 group-hover:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-sm text-white/70 mb-2">{category.description}</p>
                    <p className="text-xs text-orange-400 font-semibold">{category.count}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600/10 to-red-600/10 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">إحصائيات الموقع</h2>
            <p className="text-white/70 text-lg">أرقام تتحدث عن نفسها</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-4">
                  <stat.icon className={`w-12 h-12 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Award className="w-10 h-10 text-orange-500 mr-4" />
              المحتوى المميز
            </h2>
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
                  <div className="relative bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
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

      {/* Recent Content */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Clock className="w-10 h-10 text-green-500 mr-4" />
              أضيف حديثاً
            </h2>
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
                  <div className="relative bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl">
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

      {/* Footer */}
      <footer className="bg-black/90 text-white py-16">
        <div className="container mx-auto px-4">
          {/* الروابط الاجتماعية */}
          <div className="flex justify-center space-x-6 space-x-reverse mb-8">
            <a href="#" className="text-white/60 hover:text-white transition-colors text-2xl">
              📘
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-2xl">
              📺
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-2xl">
              📱
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-2xl">
              📧
            </a>
          </div>

          {/* الروابط الرئيسية */}
          <div className="flex justify-center space-x-8 space-x-reverse mb-8 text-sm">
            <a href="/contactus" className="text-white/60 hover:text-white transition-colors">اتصل بنا</a>
            <a href="/dmca" className="text-white/60 hover:text-white transition-colors">DMCA</a>
            <a href="/ad-policy" className="text-white/60 hover:text-white transition-colors">سياسة الإعلانات</a>
            <a href="/privacy" className="text-white/60 hover:text-white transition-colors">الخصوصية</a>
          </div>

          {/* حقوق النشر */}
          <div className="text-center text-white/60 text-sm">
            <p>جميع الحقوق محفوظة لشبكة أكوام © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeEnhanced;