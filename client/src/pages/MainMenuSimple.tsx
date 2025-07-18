import { useState } from 'react';
import { Search } from 'lucide-react';

const MainMenuSimple = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* خلفية الصفحة الأصلية */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://ak.sv/style/assets/images/home-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* طبقة التدرج مطابقة للأصل */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"></div>
      
      {/* الشريط العلوي */}
      <header className="relative z-20 flex justify-between items-center p-4">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <span className="text-sm">أكوام جديد</span>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold">أكوام</div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* الشعار الدائري - مطابق للأصل */}
        <div className="mb-12">
          <div className="w-48 h-48 mx-auto rounded-full border-4 border-white/60 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <svg width="87" height="80" viewBox="0 0 87 80" className="text-white mb-3">
                <path fillRule="evenodd" fill="currentColor" d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
              </svg>
              <div className="text-white text-sm font-medium">الصفحة الرئيسية</div>
            </div>
          </div>
        </div>

        {/* شريط البحث - مطابق للأصل */}
        <div className="w-full max-w-2xl mb-12">
          <form onSubmit={handleSearch} className="flex bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-white/30">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج ..."
              className="flex-1 bg-transparent text-white placeholder-white/70 px-6 py-4 outline-none text-lg"
            />
            <button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 font-semibold transition-colors text-lg"
            >
              بحث
            </button>
          </form>
        </div>

        {/* الفئات الأربع - مطابق للأصل */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <a href="/mix" className="group block text-center text-white py-8 px-6 bg-gray-800/70 backdrop-blur-sm rounded-xl hover:bg-gray-700/80 transition-all duration-300 border border-white/30">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-white group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="text-lg font-medium group-hover:text-orange-400 transition-colors">منوعات</div>
          </a>
          
          <a href="/series" className="group block text-center text-white py-8 px-6 bg-gray-800/70 backdrop-blur-sm rounded-xl hover:bg-gray-700/80 transition-all duration-300 border border-white/30">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-white group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-lg font-medium group-hover:text-green-400 transition-colors">مسلسلات</div>
          </a>
          
          <a href="/movies" className="group block text-center text-white py-8 px-6 bg-gray-800/70 backdrop-blur-sm rounded-xl hover:bg-gray-700/80 transition-all duration-300 border border-white/30">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-white group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v10a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1h8z" />
              </svg>
            </div>
            <div className="text-lg font-medium group-hover:text-blue-400 transition-colors">أفلام</div>
          </a>
          
          <a href="/shows" className="group block text-center text-white py-8 px-6 bg-gray-800/70 backdrop-blur-sm rounded-xl hover:bg-gray-700/80 transition-all duration-300 border border-white/30">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-white group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-lg font-medium group-hover:text-red-400 transition-colors">تلفزيون</div>
          </a>
        </div>
      </div>

      {/* التذييل */}
      <footer className="relative z-10 mt-auto">
        {/* الروابط الاجتماعية */}
        <div className="flex justify-center space-x-6 space-x-reverse mb-6">
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
        
        {/* روابط التذييل */}
        <div className="flex justify-center space-x-6 space-x-reverse text-sm text-white/60 mb-6">
          <a href="/" className="hover:text-white transition-colors">أكوام</a>
          <a href="/old" className="hover:text-white transition-colors">الموقع القديم</a>
          <a href="/dmca" className="hover:text-white transition-colors">DMCA</a>
          <a href="/ad-policy" className="hover:text-white transition-colors">AD-P</a>
          <a href="/contactus" className="hover:text-white transition-colors">اتواصل معنا</a>
          <a href="/about" className="hover:text-white transition-colors">من نحن</a>
        </div>
        
        {/* حقوق النشر */}
        <div className="text-center text-white/40 text-sm pb-6">
          <p>جميع الحقوق محفوظة لـ شبكة أكوام © 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default MainMenuSimple;