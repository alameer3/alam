import { Search, Film, Tv, Monitor, Gamepad2, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import AuthenticLogo from '../components/ui/AuthenticLogo';

const HomeAuthentic = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'منوعات',
      icon: Gamepad2,
      path: '/mix',
      description: ''
    },
    {
      title: 'تلفزيون',
      icon: Monitor,
      path: '/shows',
      description: ''
    },
    {
      title: 'مسلسلات',
      icon: Tv,
      path: '/series',
      description: ''
    },
    {
      title: 'أفلام',
      icon: Film,
      path: '/movies',
      description: ''
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      {/* الشريط العلوي */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse text-white">
            <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            <span className="text-sm">أعضاء جديد</span>
          </div>
          
          <div className="text-white text-lg font-bold">
            أكوام△
          </div>
        </div>
      </div>

      {/* الخلفية */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10, 10, 10, 0.85)' }}></div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20">
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
              className="w-full text-white placeholder-gray-400 border-0 rounded-lg px-4 py-3 pr-20 text-base focus:outline-none"
              style={{ 
                backgroundColor: 'rgba(60, 60, 60, 0.9)',
                color: '#ffffff'
              }}
              dir="rtl"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white px-4 py-1 rounded transition-colors duration-300 font-medium text-sm"
              style={{ backgroundColor: '#f3951e' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6841a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3951e'}
            >
              بحث
            </button>
          </div>
        </div>

        {/* الأقسام الرئيسية */}
        <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                href={category.path}
                className="group"
              >
                <div 
                  className="rounded-lg p-4 text-center transition-all duration-300 hover:bg-gray-700"
                  style={{ 
                    backgroundColor: 'rgba(40, 40, 40, 0.9)',
                    border: '1px solid rgba(60, 60, 60, 0.5)'
                  }}
                >
                  <div className="mb-3 flex justify-center">
                    <IconComponent className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-white text-sm font-medium">{category.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* أيقونات التواصل الاجتماعي */}
        <div className="mt-16 flex justify-center space-x-6 space-x-reverse">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">F</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">T</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Y</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">I</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">@</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">P</a>
        </div>

        {/* الروابط السفلية */}
        <div className="mt-8 flex flex-wrap justify-center space-x-6 space-x-reverse text-xs text-gray-400">
          <a href="/contactus" className="hover:text-white transition-colors">سياسة الخصوصية</a>
          <a href="/dmca" className="hover:text-white transition-colors">سياسة أفضل</a>
          <a href="/ad-policy" className="hover:text-white transition-colors">DMCA</a>
          <a href="/contactus" className="hover:text-white transition-colors">اتصل بنا</a>
          <a href="/about" className="hover:text-white transition-colors">معلومات المساح</a>
          <a href="/help" className="hover:text-white transition-colors">أسئلة</a>
        </div>

        {/* حقوق النشر */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            جميع الحقوق محفوظة © موقع اكوام ، برمجة موقع اكوام
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeAuthentic;