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
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.8)), url('https://ak.sv/style/assets/images/home-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          {/* Logo */}
          <div className="mb-12">
            <div className="inline-block p-8 rounded-full border-4 border-white/20 bg-black/30 backdrop-blur-sm">
              <div className="text-6xl font-bold text-white">
                <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold">
                  أكوام
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold mt-6 mb-2">المكتبة الترفيهية</h1>
            <p className="text-xl text-white/80">الموقع العربي الأول للأفلام والمسلسلات</p>
          </div>

          {/* Search Bar */}
          <div className="mb-16">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن فيلم أو مسلسل أو برنامج..."
                  className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-r-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-l-xl font-semibold transition-colors"
                >
                  بحث
                </button>
              </div>
            </form>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <a href="/movies" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/60 transition-all hover:scale-105">
                <Film className="w-12 h-12 mx-auto mb-4 text-orange-500 group-hover:text-orange-400" />
                <h3 className="text-xl font-bold mb-2">أفلام</h3>
                <p className="text-sm text-white/70">مجموعة متنوعة من الأفلام</p>
              </div>
            </a>

            <a href="/series" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/60 transition-all hover:scale-105">
                <Tv className="w-12 h-12 mx-auto mb-4 text-orange-500 group-hover:text-orange-400" />
                <h3 className="text-xl font-bold mb-2">مسلسلات</h3>
                <p className="text-sm text-white/70">مسلسلات عربية وأجنبية</p>
              </div>
            </a>

            <a href="/shows" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/60 transition-all hover:scale-105">
                <Monitor className="w-12 h-12 mx-auto mb-4 text-orange-500 group-hover:text-orange-400" />
                <h3 className="text-xl font-bold mb-2">تلفزيون</h3>
                <p className="text-sm text-white/70">برامج تلفزيونية متنوعة</p>
              </div>
            </a>

            <a href="/mix" className="group">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/60 transition-all hover:scale-105">
                <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-orange-500 group-hover:text-orange-400" />
                <h3 className="text-xl font-bold mb-2">منوعات</h3>
                <p className="text-sm text-white/70">ألعاب وتطبيقات</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-orange-500">أكوام</h3>
              <p className="text-gray-400 mb-6">
                المكتبة الترفيهية العربية الأولى لتحميل ومشاهدة الأفلام والمسلسلات
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">الأقسام</h4>
              <ul className="space-y-2">
                <li><a href="/movies" className="text-gray-400 hover:text-white">أفلام</a></li>
                <li><a href="/series" className="text-gray-400 hover:text-white">مسلسلات</a></li>
                <li><a href="/shows" className="text-gray-400 hover:text-white">برامج</a></li>
                <li><a href="/mix" className="text-gray-400 hover:text-white">منوعات</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">روابط مفيدة</h4>
              <ul className="space-y-2">
                <li><a href="/recent" className="text-gray-400 hover:text-white">أضيف حديثاً</a></li>
                <li><a href="/top-rated" className="text-gray-400 hover:text-white">الأعلى تقييماً</a></li>
                <li><a href="/most-viewed" className="text-gray-400 hover:text-white">الأكثر مشاهدة</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2">
                <li><a href="/contactus" className="text-gray-400 hover:text-white">اتصل بنا</a></li>
                <li><a href="/dmca" className="text-gray-400 hover:text-white">سياسة DMCA</a></li>
                <li><a href="/ad-policy" className="text-gray-400 hover:text-white">سياسة الإعلانات</a></li>
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

export default HomeSimple;