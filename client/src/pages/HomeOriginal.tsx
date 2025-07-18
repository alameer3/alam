import { useState } from 'react';
import { Link } from 'wouter';
import AuthenticLayout from '../components/layout/AuthenticLayout';
import { Search } from 'lucide-react';

const HomeOriginal = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthenticLayout bodyClass="page-home">
      {/* خلفية الصفحة الرئيسية - مطابقة للصور الأصلية */}
      <div 
        className="min-h-screen relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/extracted_files/home/ak.sv/style/assets/images/bg-home.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#161619'
        }}
      >
        
        {/* المحتوى الرئيسي مطابق للصور الأصلية */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
          
          {/* الشعار الدائري الكبير - مطابق تماماً للصورة الأصلية */}
          <div className="mb-12">
            <div 
              className="w-64 h-64 rounded-full flex items-center justify-center relative"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.3) 100%)',
                border: '4px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* الدائرة الداخلية مع الشعار */}
              <div className="w-32 h-32 rounded-full bg-white bg-opacity-10 flex flex-col items-center justify-center">
                {/* المثلث الأبيض - مطابق للأصل */}
                <div className="mb-2">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L1 21h22L12 2z"/>
                  </svg>
                </div>
                {/* النص تحت المثلث */}
                <p className="text-white text-xs font-semibold">المكتبة الترفيهية</p>
              </div>
            </div>
          </div>

          {/* زر البحث البرتقالي - مطابق للأصل */}
          <div className="mb-8">
            <button 
              className="px-16 py-4 rounded-lg font-bold text-lg text-white transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: '#f3951e',
                boxShadow: '0 4px 15px rgba(243, 149, 30, 0.3)'
              }}
            >
              بحث
            </button>
          </div>
          
          {/* مربع البحث - مطابق للنص في الصورة الأصلية */}
          <div className="w-full max-w-4xl mb-16">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج تليفزيوني"
                className="w-full px-6 py-5 text-lg text-white placeholder-gray-300 border border-gray-600 rounded-lg transition-all focus:outline-none focus:border-orange-400"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(5px)'
                }}
              />
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            </div>
          </div>

          {/* الأقسام الأربعة - مطابقة تماماً للصور الأصلية */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full">
            
            {/* منوعات - الترتيب مطابق للصورة */}
            <Link href="/mix">
              <div className="group cursor-pointer">
                <div 
                  className="rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* أيقونة منوعات */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xl">منوعات</h3>
                </div>
              </div>
            </Link>

            {/* تلفزيون */}
            <Link href="/shows">
              <div className="group cursor-pointer">
                <div 
                  className="rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* أيقونة تلفزيون */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H3V5h18v10z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xl">تلفزيون</h3>
                </div>
              </div>
            </Link>

            {/* مسلسلات */}
            <Link href="/series">
              <div className="group cursor-pointer">
                <div 
                  className="rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* أيقونة مسلسلات */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xl">مسلسلات</h3>
                </div>
              </div>
            </Link>

            {/* أفلام */}
            <Link href="/movies">
              <div className="group cursor-pointer">
                <div 
                  className="rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* أيقونة أفلام */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xl">أفلام</h3>
                </div>
              </div>
            </Link>

          </div>

          {/* أيقونات التواصل الاجتماعي - مطابقة للأصل */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-6 space-x-reverse">
              {/* Facebook */}
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017.001"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </AuthenticLayout>
  );
};

export default HomeOriginal;