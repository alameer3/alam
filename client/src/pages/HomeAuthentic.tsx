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

        {/* شريط البحث البرتقالي مطابق للصورة الأصلية */}
        <div className={`w-full max-w-xl mb-6 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex bg-transparent">
            <input 
              type="text" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج او اغنية والمزيد ..."
              className="flex-1 px-4 py-2.5 text-white text-sm bg-gray-800 bg-opacity-80 border-0 rounded-r-md focus:outline-none focus:bg-opacity-100"
              style={{ 
                direction: 'rtl',
                backgroundColor: 'rgba(60, 60, 60, 0.9)'
              }}
            />
            <button 
              type="submit"
              className="px-6 py-2.5 text-black text-sm font-medium rounded-l-md transition-all hover:brightness-110"
              style={{ backgroundColor: '#f3951e' }}
            >
              بحث
            </button>
          </div>
        </div>

        {/* الأقسام الأربعة مطابقة تماماً للصورة الأصلية - بالترتيب الصحيح */}
        <div className={`grid grid-cols-4 gap-3 w-full max-w-xl mb-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* منوعات - الأول من اليمين كما في الصورة */}
          <Link href="/mix" className="block">
            <div className="border border-gray-600 rounded-md p-4 text-center hover:border-orange-500 transition-all group cursor-pointer" 
                 style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)', borderColor: 'rgba(100, 100, 100, 0.5)' }}>
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                {/* أيقونة منوعات مطابقة للصورة */}
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m-15 0A2.25 2.25 0 002.25 12v6.621a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18.621V12a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25zm0 0v.5a2.25 2.25 0 002.25 2.25h2.25a2.25 2.25 0 002.25-2.25v-.5m0 0a2.25 2.25 0 012.25-2.25h.75a2.25 2.25 0 012.25 2.25v.5"/>
                </svg>
              </div>
              <div className="text-white text-xs font-medium">منوعات</div>
            </div>
          </Link>

          {/* تلفزيون - الثاني من اليمين */}
          <Link href="/shows" className="block">
            <div className="border border-gray-600 rounded-md p-4 text-center hover:border-orange-500 transition-all group cursor-pointer"
                 style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)', borderColor: 'rgba(100, 100, 100, 0.5)' }}>
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                {/* أيقونة تلفزيون مطابقة للصورة */}
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h16.5c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"/>
                </svg>
              </div>
              <div className="text-white text-xs font-medium">تلفزيون</div>
            </div>
          </Link>

          {/* مسلسلات - الثالث من اليمين */}
          <Link href="/series" className="block">
            <div className="border border-gray-600 rounded-md p-4 text-center hover:border-orange-500 transition-all group cursor-pointer"
                 style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)', borderColor: 'rgba(100, 100, 100, 0.5)' }}>
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                {/* أيقونة مسلسلات مطابقة للصورة */}
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-13.5-7.5h21M7.5 10.5H6A1.5 1.5 0 004.5 9V6A1.5 1.5 0 016 4.5h1.5M16.5 4.5H18A1.5 1.5 0 0119.5 6v3A1.5 1.5 0 0118 10.5h-1.5m0 9H18a1.5 1.5 0 001.5-1.5v-3A1.5 1.5 0 0018 13.5h-1.5m-9 0H6A1.5 1.5 0 004.5 15v3A1.5 1.5 0 006 19.5h1.5"/>
                </svg>
              </div>
              <div className="text-white text-xs font-medium">مسلسلات</div>
            </div>
          </Link>

          {/* أفلام - الرابع من اليمين (الأخير في اليسار) */}
          <Link href="/movies" className="block">
            <div className="border border-gray-600 rounded-md p-4 text-center hover:border-orange-500 transition-all group cursor-pointer"
                 style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)', borderColor: 'rgba(100, 100, 100, 0.5)' }}>
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                {/* أيقونة أفلام مطابقة للصورة */}
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
                </svg>
              </div>
              <div className="text-white text-xs font-medium">أفلام</div>
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