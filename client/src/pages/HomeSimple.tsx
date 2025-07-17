import { useState } from 'react';
import { Search, Film, Tv, Monitor, Gamepad2, Play, Star } from 'lucide-react';

const HomeSimple = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'akoam, Cairo, sans-serif' }}>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center pt-16"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.8)), url('https://ak.sv/style/assets/images/home-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          {/* Logo - تصميم مطابق للأصل */}
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
            <h1 className="text-4xl font-bold mt-6 mb-2 text-white drop-shadow-lg">أكوام</h1>
            <p className="text-xl text-white/80 drop-shadow-md">موقع التحميل والمشاهدة العربي الأول</p>
          </div>

          {/* Search Bar */}
          <div className="mb-16">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex shadow-2xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن فيلم أو مسلسل أو برنامج..."
                  className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-r-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-l-xl font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  بحث
                </button>
              </div>
            </form>
          </div>

          {/* Categories - تصميم مطابق للأصل */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <a href="/movies" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-black/60 transition-all hover:scale-105 hover:shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Film className="w-8 h-8 text-orange-500 group-hover:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">أفلام</h3>
                  <p className="text-sm text-white/70">للأفلام</p>
                </div>
              </div>
            </a>

            <a href="/series" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-black/60 transition-all hover:scale-105 hover:shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Tv className="w-8 h-8 text-orange-500 group-hover:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">مسلسلات</h3>
                  <p className="text-sm text-white/70">للمسلسلات</p>
                </div>
              </div>
            </a>

            <a href="/shows" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-black/60 transition-all hover:scale-105 hover:shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Monitor className="w-8 h-8 text-orange-500 group-hover:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">تلفزيون</h3>
                  <p className="text-sm text-white/70">للتلفزيون</p>
                </div>
              </div>
            </a>

            <a href="/mix" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-black/60 transition-all hover:scale-105 hover:shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Gamepad2 className="w-8 h-8 text-orange-500 group-hover:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">منوعات</h3>
                  <p className="text-sm text-white/70">للمنوعات</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>


      {/* Header العلوي - إضافة شريط التنقل */}
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

      {/* Footer مطابق للأصل */}
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

export default HomeSimple;