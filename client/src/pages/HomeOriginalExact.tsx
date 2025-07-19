import { useState, useEffect } from 'react';
import { Link } from 'wouter';

export default function HomeOriginalExact() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // تحميل الصفحة مع تأخير بسيط لتأثير الانتقال
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#161619' }}>
      {/* خلفية الموقع الأصلية مطابقة للصورة */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, rgba(139, 69, 19, 0.15) 0%, rgba(22, 22, 25, 0.8) 50%, rgba(0, 0, 0, 0.95) 100%),
            linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(22, 22, 25, 0.9) 40%, rgba(0, 0, 0, 0.95) 100%)
          `,
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* طبقة تأثير إضافية */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(255, 165, 0, 0.05) 0%, transparent 50%)'
      }} />
      
      {/* الشريط العلوي */}
      <header className="relative z-20 h-[70px] flex items-center justify-between px-4 md:px-8">
        {/* أيقونة المستخدم والمساعدة */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex items-center text-white text-sm cursor-pointer hover:text-orange-400 transition-colors">
            <i className="icon-user ml-2" />
            <span>احدث محتوى</span>
          </div>
        </div>
        
        {/* شعار اكوام */}
        <div className="flex items-center text-white text-2xl font-bold">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            اكوام
          </span>
          <span className="text-orange-400 ml-2">▲</span>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-70px)] px-4">
        {/* الشعار الدائري المركزي */}
        <div className={`home-site-btn-container transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <Link href="/movies" className="link">
            <div className="home-site-btn">
              <div className="logo">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl text-gray-800 font-bold">▲</span>
                </div>
              </div>
              <div className="text text-white font-bold text-xl">
                المكتبة الترفيهية
              </div>
            </div>
          </Link>
        </div>

        {/* شريط البحث */}
        <div className={`w-full max-w-2xl mt-10 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative">
            <div className="flex rounded-lg overflow-hidden bg-white bg-opacity-10 backdrop-blur-sm">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 font-bold transition-colors">
                بحث
              </button>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="البحث في قاعدة بيانات الافلام والمسلسلات والبرامج التلفزيونية..."
                className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* الأقسام الأربعة */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* منوعات */}
          <Link href="/mix" className="category-item group">
            <div className="bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-lg p-6 text-center transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-orange-400">
              <div className="text-4xl text-white mb-4 group-hover:text-orange-400 transition-colors">
                <i className="icon-mix" />
              </div>
              <div className="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">
                منوعات
              </div>
            </div>
          </Link>

          {/* تلفزيون */}
          <Link href="/shows" className="category-item group">
            <div className="bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-lg p-6 text-center transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-orange-400">
              <div className="text-4xl text-white mb-4 group-hover:text-orange-400 transition-colors">
                <i className="icon-tv" />
              </div>
              <div className="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">
                تلفزيون
              </div>
            </div>
          </Link>

          {/* مسلسلات */}
          <Link href="/series" className="category-item group">
            <div className="bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-lg p-6 text-center transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-orange-400">
              <div className="text-4xl text-white mb-4 group-hover:text-orange-400 transition-colors">
                <i className="icon-monitor" />
              </div>
              <div className="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">
                مسلسلات
              </div>
            </div>
          </Link>

          {/* أفلام */}
          <Link href="/movies" className="category-item group">
            <div className="bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-lg p-6 text-center transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-orange-400">
              <div className="text-4xl text-white mb-4 group-hover:text-orange-400 transition-colors">
                <i className="icon-video-camera" />
              </div>
              <div className="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">
                أفلام
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* التذييل */}
      <footer className={`relative z-10 mt-auto py-8 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* روابط التواصل الاجتماعي */}
        <div className="flex justify-center space-x-4 space-x-reverse mb-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">
            <i className="icon-home" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-2xl">
            <i className="icon-facebook" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-2xl">
            <i className="icon-twitter" />
          </a>
          <a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-2xl">
            <i className="icon-youtube" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-2xl">
            <i className="icon-app-store" />
          </a>
          <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-2xl">
            <i className="icon-email" />
          </a>
        </div>

        {/* روابط إضافية */}
        <div className="flex justify-center space-x-6 space-x-reverse text-sm text-gray-400 mb-4">
          <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
          <a href="#" className="hover:text-white transition-colors">حقوق الطبع</a>
          <a href="#" className="hover:text-white transition-colors">DMCA</a>
          <a href="#" className="hover:text-white transition-colors">اتصل بنا</a>
          <a href="#" className="hover:text-white transition-colors">اكوام التيجرام</a>
          <a href="#" className="hover:text-white transition-colors">ويكيو</a>
        </div>

        {/* حقوق الطبع */}
        <div className="text-center text-xs text-gray-500">
          جميع الحقوق محفوظة © شبكة اكوام 2025
        </div>
      </footer>

      {/* CSS خاص بأكوام الأصلي */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .home-site-btn-container {
          width: 258px;
          height: 258px;
          border-radius: 50%;
          position: relative;
          margin: 0 auto 40px;
        }
        
        .home-site-btn-container::before,
        .home-site-btn-container::after {
          position: absolute;
          top: 50%;
          right: 50%;
          z-index: 2;
          content: "";
          border-radius: 50%;
          border: 2px solid #fff;
          transform: translate(50%, -50%);
          transition: all 500ms;
        }
        
        .home-site-btn-container::before {
          width: 100%;
          height: 100%;
        }
        
        .home-site-btn-container::after {
          width: 0;
          height: 0;
          border-color: transparent;
        }
        
        .home-site-btn {
          width: 230px;
          height: 230px;
          overflow: hidden;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          right: 50%;
          border: 5px solid #fff;
          background-color: #161619;
          transform: translate(50%, -50%);
          background-position: center -43%;
          background-repeat: no-repeat;
          background-size: 120%;
          cursor: pointer;
        }
        
        .home-site-btn .logo {
          position: absolute;
          top: 50px;
          right: 50%;
          z-index: 2;
          transform: translate(50%);
          transition: all 500ms;
        }
        
        .home-site-btn .text {
          width: 100%;
          text-align: center;
          position: absolute;
          bottom: 55px;
          right: 50%;
          z-index: 2;
          transform: translate(50%);
          transition: all 500ms;
        }
        
        .home-site-btn-container:hover::before {
          width: 0;
          height: 0;
          border-color: transparent;
        }
        
        .home-site-btn-container:hover::after {
          width: 100%;
          height: 100%;
          border-color: #26baee;
        }
        
        .home-site-btn-container:hover .home-site-btn {
          border-color: #0d82ab;
          background-position: center 100%;
        }
        
        .home-site-btn-container:hover .home-site-btn .logo,
        .home-site-btn-container:hover .home-site-btn .text {
          opacity: 0;
        }
        
        .home-site-btn-container:hover .home-site-btn .logo {
          top: -100%;
        }
        
        .home-site-btn-container:hover .home-site-btn .text {
          bottom: 100%;
        }
        `
      }} />
    </div>
  );
}