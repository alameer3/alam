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
        
        {/* الشعار الدائري المركزي الأصلي مطابق للصورة */}
        <div className={`mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <Link href="/ones" className="block">
            <div className="relative w-40 h-40 mx-auto">
              {/* الدوائر الخارجية */}
              <div className="absolute inset-0 border-4 border-white rounded-full"></div>
              <div className="absolute inset-2 border-2 border-white rounded-full"></div>
              
              {/* الخلفية الداخلية */}
              <div className="absolute inset-4 bg-gray-800 rounded-full flex flex-col items-center justify-center">
                {/* الشعار المثلثي */}
                <div className="mb-1">
                  <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
                    <path d="M16 0L32 28H0L16 0Z" fill="white"/>
                  </svg>
                </div>
                
                {/* النص */}
                <div className="text-white text-xs font-medium text-center leading-tight">
                  المكتبة الترفيهية
                </div>
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

        {/* الأقسام الأربعة الرئيسية مطابقة للصورة الأصلية */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* منوعات - الأول من اليمين */}
          <Link href="/mix" className="block">
            <div className="bg-black bg-opacity-50 border border-gray-600 rounded-lg p-4 text-center hover:bg-opacity-70 transition-all group">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14-7l-14 14m14 0L5 4" />
                </svg>
              </div>
              <div className="text-white text-sm font-medium">منوعات</div>
            </div>
          </Link>

          {/* تلفزيون - الثاني من اليمين */}
          <Link href="/shows" className="block">
            <div className="bg-black bg-opacity-50 border border-gray-600 rounded-lg p-4 text-center hover:bg-opacity-70 transition-all group">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-white text-sm font-medium">تلفزيون</div>
            </div>
          </Link>

          {/* مسلسلات - الثالث من اليمين */}
          <Link href="/series" className="block">
            <div className="bg-black bg-opacity-50 border border-gray-600 rounded-lg p-4 text-center hover:bg-opacity-70 transition-all group">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v1H6V4a1 1 0 011-1V2m8 0H8m0 0v2m8-2v2m-8-2H6m2 0v2m8-2H16M6 6h12v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <div className="text-white text-sm font-medium">مسلسلات</div>
            </div>
          </Link>

          {/* أفلام - الرابع من اليمين */}
          <Link href="/movies" className="block">
            <div className="bg-black bg-opacity-50 border border-gray-600 rounded-lg p-4 text-center hover:bg-opacity-70 transition-all group">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 2v2m6-2v2M5 8h14M9 12h6" />
                </svg>
              </div>
              <div className="text-white text-sm font-medium">أفلام</div>
            </div>
          </Link>

        </div>
      </main>

      {/* التذييل مطابق للصورة الأصلية */}
      <footer className="relative z-10 mt-auto py-12">
        {/* أيقونات التواصل الاجتماعي */}
        <div className={`flex justify-center space-x-6 space-x-reverse mb-6 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Link href="#" className="w-8 h-8 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-sm">🏠</span>
          </Link>
          <Link href="#" className="w-8 h-8 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-sm">f</span>
          </Link>
          <Link href="#" className="w-8 h-8 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-sm">📺</span>
          </Link>
          <Link href="#" className="w-8 h-8 bg-gray-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-sm">@</span>
          </Link>
        </div>
        
        {/* روابط التذييل */}
        <div className="flex justify-center space-x-6 space-x-reverse text-xs text-gray-400 mb-4">
          <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
          <Link href="#" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
          <Link href="#" className="hover:text-white transition-colors">شروط الاستخدام</Link>
          <Link href="#" className="hover:text-white transition-colors">اتصل بنا</Link>
          <Link href="#" className="hover:text-white transition-colors">الإعلانات</Link>
          <Link href="#" className="hover:text-white transition-colors">اتفاقية الاستخدام</Link>
        </div>
        
        {/* حقوق الطبع والنشر */}
        <div className="text-center text-gray-500 text-xs">
          جميع الحقوق محفوظة © شبكة اكوام 2025
        </div>
      </footer>


    </div>
  );
}