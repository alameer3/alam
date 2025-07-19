import { Search, Film, Tv, Monitor, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import AuthenticLogo from '../components/ui/AuthenticLogo';

const HomeAuthentic = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'أفلام',
      icon: Film,
      path: '/movies',
      description: 'أحدث الأفلام العربية والأجنبية'
    },
    {
      title: 'مسلسلات',
      icon: Tv,
      path: '/series',
      description: 'المسلسلات العربية والتركية والأجنبية'
    },
    {
      title: 'برامج',
      icon: Monitor,
      path: '/shows',
      description: 'البرامج التلفزيونية والوثائقية'
    },
    {
      title: 'منوعات',
      icon: Gamepad2,
      path: '/mix',
      description: 'ألعاب وتطبيقات ومحتوى متنوع'
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#161619' }}>
      {/* الخلفية */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1489599904472-2d96b1de8bf8?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(22, 22, 25, 0.7)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* الشعار الدائري */}
        <div className="mb-12">
          <AuthenticLogo size={160} />
        </div>

        {/* شريط البحث */}
        <div className="w-full max-w-2xl mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن فيلم أو مسلسل أو أي شيء آخر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full backdrop-blur-sm text-white placeholder-gray-400 border rounded-lg px-6 py-4 pr-14 text-lg focus:outline-none transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(39, 39, 44, 0.8)', 
                borderColor: '#404040',
                focusBorderColor: '#f3951e'
              }}
              dir="rtl"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white px-6 py-2 rounded-md transition-colors duration-300 font-medium"
              style={{ backgroundColor: '#f3951e' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6841a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3951e'}
            >
              بحث
            </button>
          </div>
        </div>

        {/* الأقسام الرئيسية */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                href={category.path}
                className="group"
              >
                <div 
                  className="backdrop-blur-sm border rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105"
                  style={{ 
                    backgroundColor: 'rgba(39, 39, 44, 0.8)', 
                    borderColor: '#404040'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(39, 39, 44, 0.9)';
                    e.currentTarget.style.borderColor = '#f3951e';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(39, 39, 44, 0.8)';
                    e.currentTarget.style.borderColor = '#404040';
                  }}
                >
                  <div className="mb-4 flex justify-center">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300"
                      style={{ backgroundColor: 'rgba(243, 149, 30, 0.2)' }}
                    >
                      <IconComponent className="h-8 w-8" style={{ color: '#f3951e' }} />
                    </div>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">{category.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{category.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* الروابط السفلية */}
        <div className="mt-16 flex flex-wrap justify-center space-x-8 space-x-reverse text-sm">
          <a href="/contactus" className="text-gray-400 transition-colors" style={{ color: '#b3b3b3' }} 
             onMouseEnter={(e) => e.currentTarget.style.color = '#f3951e'}
             onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}>اتصل بنا</a>
          <a href="/dmca" className="text-gray-400 transition-colors" style={{ color: '#b3b3b3' }} 
             onMouseEnter={(e) => e.currentTarget.style.color = '#f3951e'}
             onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}>DMCA</a>
          <a href="/ad-policy" className="text-gray-400 transition-colors" style={{ color: '#b3b3b3' }} 
             onMouseEnter={(e) => e.currentTarget.style.color = '#f3951e'}
             onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}>سياسة الإعلانات</a>
        </div>

        {/* حقوق النشر */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            جميع الحقوق محفوظة © 2025 أكوام. تم التطوير بواسطة فريق أكوام
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeAuthentic;