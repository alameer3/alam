import { useState, useEffect } from 'react';
import { Link } from 'wouter';

export default function HomeAuthentic() {
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
      
      {/* طبقة تأثير إضافية مطابقة للصورة */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(255, 165, 0, 0.05) 0%, transparent 50%)',
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="0.8" fill="rgba(255,255,255,0.1)"/></svg>')`
      }} />

      {/* الهيدر الأصلي مطابق للصورة */}
      <header className="relative z-20 py-3" style={{ backgroundColor: 'rgba(22, 22, 25, 0.9)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* الشعار */}
            <div className="flex items-center">
              <Link href="/ones" className="text-white text-2xl font-bold">
                🔺 اكوام
              </Link>
            </div>
            
            {/* أيقونة المستخدم ونص "أضيف حديثا" */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-white text-sm">أضيف حديثا</span>
              <Link href="/login" className="text-white text-xl p-2">
                👤
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-70px)] px-4">
        
        {/* الشعار الدائري المركزي الأصلي */}
        <div className={`home-site-btn-container transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <Link href="/ones" className="link">
            <div className="home-site-btn">
              <div className="logo">
                {/* شعار اكوام الأصلي SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="87px" height="80px" viewBox="0 0 87 80">
                  <path fillRule="evenodd" fill="rgb(255, 255, 255)"
                    d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
                </svg>
              </div>
              <div className="text text-white font-medium">
                المكتبة الترفيهية
              </div>
            </div>
          </Link>
        </div>

        {/* شريط البحث البرتقالي الأصلي */}
        <div className={`w-full max-w-2xl mb-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <form className="flex gap-0 bg-transparent" action="/search" method="get">
            <input 
              type="text" 
              name="q"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج ..."
              className="flex-1 px-4 py-3 text-white bg-black bg-opacity-50 border border-gray-600 rounded-r-lg focus:outline-none focus:border-orange-500"
              style={{ direction: 'rtl' }}
            />
            <button 
              type="submit"
              className="px-8 py-3 text-white font-medium rounded-l-lg transition-colors"
              style={{ backgroundColor: '#f3951e' }}
            >
              بحث
            </button>
          </form>
        </div>

        {/* الأقسام الأربعة الرئيسية مطابقة للصورة - بالترتيب الصحيح من اليمين لليسار */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* أفلام - الأول من اليمين */}
          <Link href="/movies" className="block order-1">
            <div className="bg-black bg-opacity-40 border border-gray-600 rounded-lg p-6 text-center hover:bg-opacity-60 transition-all group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎬</div>
              <div className="text-white text-lg font-medium">أفلام</div>
            </div>
          </Link>

          {/* مسلسلات - الثاني من اليمين */}
          <Link href="/series" className="block order-2">
            <div className="bg-black bg-opacity-40 border border-gray-600 rounded-lg p-6 text-center hover:bg-opacity-60 transition-all group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📺</div>
              <div className="text-white text-lg font-medium">مسلسلات</div>
            </div>
          </Link>

          {/* تلفزيون - الثالث من اليمين */}
          <Link href="/shows" className="block order-3">
            <div className="bg-black bg-opacity-40 border border-gray-600 rounded-lg p-6 text-center hover:bg-opacity-60 transition-all group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📻</div>
              <div className="text-white text-lg font-medium">تلفزيون</div>
            </div>
          </Link>

          {/* منوعات - الأخير من اليسار */}
          <Link href="/mix" className="block order-4">
            <div className="bg-black bg-opacity-40 border border-gray-600 rounded-lg p-6 text-center hover:bg-opacity-60 transition-all group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
              <div className="text-white text-lg font-medium">منوعات</div>
            </div>
          </Link>
        </div>
      </main>

      {/* التذييل مطابق للصورة */}
      <footer className="relative z-10 mt-auto py-8">
        {/* أيقونات التواصل الاجتماعي */}
        <div className="flex justify-center space-x-4 space-x-reverse mb-4">
          <Link href="https://akw.to" className="text-white text-2xl hover:text-orange-500 transition-colors">🏠</Link>
          <Link href="https://www.facebook.com/akwamnet" className="text-white text-2xl hover:text-orange-500 transition-colors">📘</Link>
          <Link href="https://www.youtube.com/c/AKWAMnetwork" className="text-white text-2xl hover:text-orange-500 transition-colors">📺</Link>
          <Link href="https://akw.net.in/" className="text-white text-2xl hover:text-orange-500 transition-colors">📱</Link>
          <Link href="/contactus" className="text-white text-2xl hover:text-orange-500 transition-colors">📧</Link>
        </div>
        
        {/* روابط التذييل */}
        <div className="flex justify-center space-x-6 space-x-reverse text-sm text-gray-400 mb-4">
          <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
          <Link href="/ad-policy" className="hover:text-white transition-colors">سياسة الإعلانات</Link>
          <Link href="/contactus" className="hover:text-white transition-colors">اتصل بنا</Link>
        </div>
        
        {/* حقوق الطبع */}
        <div className="text-center text-gray-500 text-sm">
          جميع الحقوق محفوظة © شبكة اكوام 2025
        </div>
      </footer>

      {/* CSS خاص بالشعار الدائري الأصلي */}
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
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="rgba(243,149,30,0.1)"/></svg>');
          background-position: center -43%;
          background-repeat: no-repeat;
          background-size: 120%;
          cursor: pointer;
          transition: all 500ms;
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
          font-size: 20px;
          font-weight: 500;
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