import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import AuthenticLayout from '../components/layout/AuthenticLayout';
import { Film, Tv, Monitor, Grid3X3, Search, Plus, Star, Eye, Download } from 'lucide-react';

const HomeOriginal = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // تأثير كتابة متحرك للبحث
  const searchSuggestions = [
    'ابحث عن فيلم او مسلسل ...',
    'البحث عن أفلام جديدة ...',
    'البحث عن مسلسلات ...',
    'ابحث هنا ...'
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchSuggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthenticLayout bodyClass="page-home">
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        
        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            
            {/* Main Logo */}
            <div className="mb-12">
              <Link href="/" className="inline-block">
                <img 
                  src="/extracted_files/home/ak.sv/style/assets/images/logo-white.svg" 
                  alt="اكوام" 
                  className="h-20 mx-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'block';
                  }}
                />
                <div className="text-6xl font-bold text-white hidden">اكوام</div>
              </Link>
            </div>

            {/* Site Description */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              شمس المواقع
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              الموقع العربي الاول لتحميل و مشاهدة الافلام, المسلسلات, الالعاب, البرامج و التطبيقات, التلفزيون, المسرحيات, المصارعة, الرياضة
            </p>

            {/* Main Search */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchSuggestions[placeholderIndex]}
                  className="w-full bg-gray-800 border border-gray-600 rounded-full px-6 py-4 text-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all duration-300"
                  style={{ fontSize: '18px', minHeight: '60px' }}
                />
                <button 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                  aria-label="بحث"
                >
                  <Search size={24} />
                </button>
              </div>
            </div>

            {/* Circular Button (Original Design) */}
            <div className="home-site-btn-container mb-16">
              <Link href="/movies" className="link">
                <div 
                  className="home-site-btn"
                  style={{
                    backgroundImage: `url('/extracted_files/home/ak.sv/style/assets/images/bg-home.jpg')`,
                  }}
                >
                  <div className="logo transition-all duration-500">
                    <img 
                      src="/extracted_files/home/ak.sv/style/assets/images/logo-white.svg" 
                      alt="اكوام" 
                      className="h-16"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'block';
                      }}
                    />
                    <div className="text-4xl font-bold text-white hidden">أكوام</div>
                  </div>
                  <div className="text text-white font-bold text-lg transition-all duration-500">
                    شمس المواقع
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              
              {/* Movies */}
              <Link href="/movies" className="group">
                <div className="bg-gray-800 hover:bg-orange-600 rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <div className="text-orange-400 group-hover:text-white mb-4 transition-colors">
                    <Film size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">أفلام</h3>
                  <p className="text-gray-400 group-hover:text-gray-200 text-sm">
                    أحدث الأفلام العربية والأجنبية
                  </p>
                </div>
              </Link>

              {/* Series */}
              <Link href="/series" className="group">
                <div className="bg-gray-800 hover:bg-orange-600 rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <div className="text-orange-400 group-hover:text-white mb-4 transition-colors">
                    <Monitor size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">مسلسلات</h3>
                  <p className="text-gray-400 group-hover:text-gray-200 text-sm">
                    المسلسلات العربية والتركية والأجنبية
                  </p>
                </div>
              </Link>

              {/* TV Shows */}
              <Link href="/shows" className="group">
                <div className="bg-gray-800 hover:bg-orange-600 rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <div className="text-orange-400 group-hover:text-white mb-4 transition-colors">
                    <Tv size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">تلفزيون</h3>
                  <p className="text-gray-400 group-hover:text-gray-200 text-sm">
                    البرامج التلفزيونية والرياضية
                  </p>
                </div>
              </Link>

              {/* Mix */}
              <Link href="/mix" className="group">
                <div className="bg-gray-800 hover:bg-orange-600 rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <div className="text-orange-400 group-hover:text-white mb-4 transition-colors">
                    <Grid3X3 size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">منوعات</h3>
                  <p className="text-gray-400 group-hover:text-gray-200 text-sm">
                    ألعاب، تطبيقات، مسرحيات، مصارعة
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Filter Box (Original Style) */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">تصفح حسب النوع</h2>
              <div className="categories-box bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    'اكشن', 'كوميدي', 'دراما', 'رعب', 'رومانسي', 'خيال علمي',
                    'مغامرات', 'كرتون', 'وثائقي', 'حرب', 'جريمة', 'عائلي'
                  ].map((category) => (
                    <button 
                      key={category}
                      className="btn bg-gray-700 hover:bg-orange-600 text-white px-4 py-2 rounded transition-all duration-300 text-sm"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-orange-400 mb-2">15,000+</div>
                <div className="text-gray-300">أفلام</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-orange-400 mb-2">5,000+</div>
                <div className="text-gray-300">مسلسلات</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-orange-400 mb-2">2,000+</div>
                <div className="text-gray-300">برامج</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-orange-400 mb-2">1M+</div>
                <div className="text-gray-300">زوار شهريا</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-8">روابط سريعة</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/recent" className="btn bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center">
                  <Plus size={20} className="ml-2" />
                  أضيف حديثا
                </Link>
                <Link href="/top-rated" className="btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center">
                  <Star size={20} className="ml-2" />
                  الأعلى تقييما
                </Link>
                <Link href="/most-watched" className="btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center">
                  <Eye size={20} className="ml-2" />
                  الأكثر مشاهدة
                </Link>
                <Link href="/download-center" className="btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center">
                  <Download size={20} className="ml-2" />
                  مركز التحميل
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AuthenticLayout>
  );
};

export default HomeOriginal;