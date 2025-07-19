import { useState, useEffect } from 'react';
import { Link } from 'wouter';

export default function HomeAuthentic() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // تحميل الصفحة مع تأثير الانتقال
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#161619' }}>
      
      {/* خلفية سينمائية ملونة مطابقة للصورة الأصلية */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, rgba(255, 140, 0, 0.3) 0%, rgba(255, 69, 0, 0.2) 25%, transparent 60%),
            radial-gradient(ellipse at 70% 60%, rgba(0, 191, 255, 0.25) 0%, rgba(30, 144, 255, 0.15) 30%, transparent 65%),
            radial-gradient(ellipse at 20% 80%, rgba(255, 20, 147, 0.2) 0%, rgba(138, 43, 226, 0.1) 35%, transparent 70%),
            linear-gradient(135deg, rgba(22, 22, 25, 0.95) 0%, rgba(22, 22, 25, 0.98) 100%)
          `
        }}
      />
      
      {/* طبقة الجزيئات والتأثيرات البصرية */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(255,140,0,0.4), transparent),
          radial-gradient(1px 1px at 90px 40px, rgba(0,191,255,0.3), transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.2), transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px 100px'
      }} />

      {/* الهيدر الأصلي */}
      <header className="relative z-20 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* الشعار الأيسر */}
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">اكوام</span>
              <span className="text-orange-500 text-2xl mr-2">△</span>
            </div>
            
            {/* النص الأيمن */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-white text-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                أضيف حديثاً
              </span>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
        
        {/* الشعار الدائري الأصلي مطابق للتصميم الحقيقي */}
        <div className={`mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="home-site-btn-container">
            <Link href="/ones" className="link" style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', zIndex: 10 }}>
              <h1 className="sr-only">اكوام - الصفحة الرئيسية</h1>
            </Link>
            <div 
              className="home-site-btn"
              style={{
                width: '230px',
                height: '230px',
                overflow: 'hidden',
                borderRadius: '50%',
                position: 'absolute',
                top: '50%',
                right: '50%',
                border: '5px solid #fff',
                backgroundColor: '#161619',
                transform: 'translate(50%, -50%)',
                backgroundImage: 'url(https://ak.sv/style/assets/images/site-new.webp)',
                backgroundPosition: 'center -43%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '120%',
                transition: 'all 500ms'
              }}
            >
              {/* الشعار الأصلي من SVG */}
              <span 
                className="logo"
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: '50%',
                  zIndex: 2,
                  transform: 'translate(50%)',
                  transition: 'all 500ms'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="87px" height="80px">
                  <path fillRule="evenodd" fill="rgb(255, 255, 255)"
                    d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
                </svg>
              </span>
              
              {/* النص الأصلي */}
              <span 
                className="text"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  position: 'absolute',
                  bottom: '55px',
                  right: '50%',
                  zIndex: 2,
                  transform: 'translate(50%)',
                  fontSize: '20px',
                  fontWeight: 'medium',
                  color: 'white',
                  transition: 'all 500ms'
                }}
              >
                الصفحة الرئيسية
              </span>
            </div>
          </div>
        </div>

        {/* شريط البحث الأصلي مطابق للتصميم */}
        <div className={`w-full max-w-2xl mb-6 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <form className="flex bg-transparent" action="/search" method="get">
            <div className="flex-1 relative">
              <input 
                type="text" 
                name="q"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full px-4 py-3 text-white text-sm bg-gray-800 bg-opacity-90 border-0 rounded-r-md focus:outline-none focus:bg-opacity-100"
                style={{ 
                  direction: 'rtl',
                  backgroundColor: 'rgba(35, 35, 40, 0.9)'
                }}
              />
              <label 
                htmlFor="searchInput" 
                className="absolute right-4 top-3 text-gray-400 text-sm pointer-events-none transition-all"
                style={{
                  opacity: searchValue ? 0 : 1,
                  transform: searchValue ? 'translateY(-20px) scale(0.8)' : 'translateY(0) scale(1)'
                }}
              >
                ابحث عن فيلم او مسلسل او لعبة او برنامج ...
              </label>
            </div>
            <button 
              type="submit"
              className="px-6 py-3 text-black text-sm font-medium rounded-l-md transition-all hover:brightness-110 btn-orange"
              style={{ backgroundColor: '#f3951e' }}
            >
              بحث
            </button>
          </form>
        </div>

        {/* الأقسام الأربعة الأصلية مطابقة للتصميم الحقيقي */}
        <div className={`w-full max-w-2xl mb-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="main-categories-list">
            <div className="grid grid-cols-4 gap-0">
              
              {/* أفلام - الأول من اليمين */}
              <div style={{ backgroundColor: 'rgba(39, 39, 44, 0.6)' }}>
                <Link href="/movies" className="item block text-center text-white py-4 h-full transition-all hover:bg-orange-500 border border-gray-700 hover:border-orange-500">
                  <div className="icn mb-2">
                    <span className="text-2xl">🎬</span>
                  </div>
                  <div className="text-sm font-medium">أفلام</div>
                </Link>
              </div>
              
              {/* مسلسلات - الثاني */}
              <div style={{ backgroundColor: 'rgba(39, 39, 44, 0.6)' }}>
                <Link href="/series" className="item block text-center text-white py-4 h-full transition-all hover:bg-orange-500 border border-gray-700 hover:border-orange-500">
                  <div className="icn mb-2">
                    <span className="text-2xl">📺</span>
                  </div>
                  <div className="text-sm font-medium">مسلسلات</div>
                </Link>
              </div>
              
              {/* تلفزيون - الثالث */}
              <div style={{ backgroundColor: 'rgba(39, 39, 44, 0.6)' }}>
                <Link href="/shows" className="item block text-center text-white py-4 h-full transition-all hover:bg-orange-500 border border-gray-700 hover:border-orange-500">
                  <div className="icn mb-2">
                    <span className="text-2xl">📻</span>
                  </div>
                  <div className="text-sm font-medium">تلفزيون</div>
                </Link>
              </div>
              
              {/* منوعات - الرابع (الأخير في اليسار) */}
              <div style={{ backgroundColor: 'rgba(39, 39, 44, 0.6)' }}>
                <Link href="/mix" className="item block text-center text-white py-4 h-full transition-all hover:bg-orange-500 border border-gray-700 hover:border-orange-500">
                  <div className="icn mb-2">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <div className="text-sm font-medium">منوعات</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* التذييل مطابق للصورة الأصلية */}
      <footer className="relative z-10 mt-auto py-12">
        {/* أيقونات التواصل الاجتماعي الأصلية */}
        <div className={`flex justify-center space-x-4 space-x-reverse mb-6 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Link href="https://akw.to" target="_blank" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-lg">🏠</span>
          </Link>
          <Link href="https://www.facebook.com/akwamnet" target="_blank" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-lg">f</span>
          </Link>
          <Link href="https://www.facebook.com/groups/AKOAMweb" target="_blank" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-lg">f</span>
          </Link>
          <Link href="https://akw.net.in/" target="_blank" className="w-10 h-10 bg-gray-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-lg">📱</span>
          </Link>
          <Link href="https://www.youtube.com/c/AKWAMnetwork" target="_blank" className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-lg">📹</span>
          </Link>
          <Link href="/contactus" className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-lg">✉️</span>
          </Link>
        </div>
        
        {/* روابط التذييل الأصلية */}
        <div className="flex justify-center space-x-4 space-x-reverse text-xs text-gray-400 mb-4 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">اكوام</Link>
          <Link href="/old" className="hover:text-white transition-colors">الموقع القديم</Link>
          <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
          <Link href="/ad-policy" className="hover:text-white transition-colors">AD-P</Link>
          <Link href="https://ak-news.com" target="_blank" className="hover:text-white transition-colors">اكوام نيوز</Link>
          <Link href="https://akw.net.co" target="_blank" className="hover:text-white transition-colors">شبكة اكوام</Link>
        </div>
        
        {/* حقوق الطبع والنشر */}
        <div className="text-center text-gray-500 text-xs">
          جميع الحقوق محفوظة © شبكة اكوام 2025
        </div>
      </footer>


    </div>
  );
}