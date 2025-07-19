import { useState } from 'react';
import { Link } from 'wouter';

export default function Home() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#161619' }}>
      
      {/* الخلفية السينمائية الأصلية مطابقة للصورة */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(22, 22, 25, 0.55), rgba(0, 0, 0, 0.8) 100%), url('/serverdata/images/home-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* هيدر بسيط في الأعلى */}
        <div className="flex justify-between items-center p-6">
          <div className="text-white text-lg">
            ⚙ اختر خدمة
          </div>
          <div className="text-white text-xl font-bold">
            △ اكوام
          </div>
        </div>

        {/* المحتوى المركزي */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          
          {/* الشعار الدائري الأصلي مطابق للصورة */}
          <div className="mb-12">
            <div 
              className="relative w-64 h-64 mx-auto cursor-pointer group"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.1))'
              }}
            >
              {/* الحدود المزدوجة */}
              <div className="absolute inset-0 rounded-full border-2 border-white opacity-80"></div>
              <div className="absolute inset-2 rounded-full border border-white opacity-60"></div>
              
              {/* الدائرة الداخلية */}
              <div className="absolute inset-4 rounded-full bg-gray-900 flex flex-col items-center justify-center text-white">
                {/* شعار الثلاثي */}
                <svg className="w-12 h-12 mb-2" viewBox="0 0 87 80" fill="none">
                  <path 
                    fillRule="evenodd" 
                    fill="white"
                    d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"
                  />
                </svg>
                
                {/* النص */}
                <div className="text-center text-sm font-bold">
                  المكتبة الترفيهية
                </div>
              </div>
              
              {/* رابط غير مرئي للنقر */}
              <Link href="/ones" className="absolute inset-0 rounded-full z-10"></Link>
            </div>
          </div>

          {/* شريط البحث البرتقالي الأصلي */}
          <div className="w-full max-w-2xl mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن فيلم او مسلسل أو حلقة او لعبة والخ..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full px-6 py-4 rounded-lg text-white placeholder-gray-300 border-none outline-none text-right"
                style={{ 
                  backgroundColor: 'rgba(39, 39, 44, 0.8)',
                  fontSize: '16px'
                }}
              />
              <button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded text-white font-bold transition-colors"
                style={{ backgroundColor: '#f3951e' }}
              >
                بحث
              </button>
            </div>
          </div>

          {/* الأقسام الأربعة الأصلية مطابقة للصورة */}
          <div className="grid grid-cols-4 gap-6 w-full max-w-4xl">
            
            {/* أفلام */}
            <Link href="/movies" className="group">
              <div 
                className="flex flex-col items-center p-6 rounded-lg transition-all duration-300 hover:border-orange-500 border-2 border-transparent"
                style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)' }}
              >
                <div className="text-4xl mb-3">🎬</div>
                <div className="text-white font-bold text-lg">أفلام</div>
              </div>
            </Link>

            {/* مسلسلات */}
            <Link href="/series" className="group">
              <div 
                className="flex flex-col items-center p-6 rounded-lg transition-all duration-300 hover:border-orange-500 border-2 border-transparent"
                style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)' }}
              >
                <div className="text-4xl mb-3">📺</div>
                <div className="text-white font-bold text-lg">مسلسلات</div>
              </div>
            </Link>

            {/* تلفزيون */}
            <Link href="/shows" className="group">
              <div 
                className="flex flex-col items-center p-6 rounded-lg transition-all duration-300 hover:border-orange-500 border-2 border-transparent"
                style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)' }}
              >
                <div className="text-4xl mb-3">📡</div>
                <div className="text-white font-bold text-lg">تلفزيون</div>
              </div>
            </Link>

            {/* منوعات */}
            <Link href="/mix" className="group">
              <div 
                className="flex flex-col items-center p-6 rounded-lg transition-all duration-300 hover:border-orange-500 border-2 border-transparent"
                style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)' }}
              >
                <div className="text-4xl mb-3">🎮</div>
                <div className="text-white font-bold text-lg">منوعات</div>
              </div>
            </Link>

          </div>
        </div>

        {/* التذييل مع أيقونات التواصل الاجتماعي */}
        <div className="p-6">
          
          {/* أيقونات التواصل الاجتماعي */}
          <div className="flex justify-center space-x-4 space-x-reverse mb-4">
            <a href="#" className="text-white hover:text-orange-500 transition-colors text-xl">
              🏠
            </a>
            <a href="#" className="text-white hover:text-orange-500 transition-colors text-xl">
              📘
            </a>
            <a href="#" className="text-white hover:text-orange-500 transition-colors text-xl">
              📘
            </a>
            <a href="#" className="text-white hover:text-orange-500 transition-colors text-xl">
              📱
            </a>
            <a href="#" className="text-white hover:text-orange-500 transition-colors text-xl">
              🎬
            </a>
            <a href="#" className="text-white hover:text-orange-500 transition-colors text-xl">
              📱
            </a>
            <a href="#" className="text-white hover:text-orange-500 transition-colors text-xl">
              ✉️
            </a>
          </div>

          {/* روابط التذييل */}
          <div className="flex justify-center space-x-4 space-x-reverse text-sm text-gray-400 mb-2">
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white transition-colors">حقوق الطبع</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
            <a href="#" className="hover:text-white transition-colors">DMCA</a>
            <a href="#" className="hover:text-white transition-colors">اتصل بنا</a>
            <a href="#" className="hover:text-white transition-colors">أكوام</a>
          </div>

          {/* نص حقوق الطبع */}
          <div className="text-center text-gray-500 text-xs">
            جميع الحقوق محفوظة لـ شبكة اكوام © 2025
          </div>
        </div>

      </div>
    </div>
  );
}