import { useState } from 'react';
import { Link } from 'wouter';
import AuthenticLayout from '../components/layout/AuthenticLayout';
import { Search } from 'lucide-react';

const HomeOriginal = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthenticLayout bodyClass="page-home">
      {/* خلفية الصفحة الرئيسية بالتصميم الأصلي */}
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: `url('/extracted_files/home/ak.sv/style/assets/images/bg-home.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* طبقة تعتيم */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        {/* المحتوى الرئيسي */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
          
          {/* الشعار الدائري الرئيسي */}
          <div className="mb-12">
            <div className="relative">
              {/* الدائرة الخارجية */}
              <div className="w-64 h-64 rounded-full border-4 border-white border-opacity-30 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                {/* الدائرة الداخلية مع الشعار */}
                <div className="w-40 h-40 rounded-full bg-white bg-opacity-10 flex flex-col items-center justify-center text-center p-4">
                  {/* الأيقونة المثلثية */}
                  <div className="w-16 h-16 mb-2 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L1 21h22L12 2z" stroke="white" strokeWidth="2" fill="white"/>
                    </svg>
                  </div>
                  {/* النص التحتي */}
                  <p className="text-white text-sm font-bold">المكتبة الترفيهية</p>
                </div>
              </div>
            </div>
          </div>

          {/* قسم البحث */}
          <div className="w-full max-w-3xl mb-16 text-center">
            {/* زر البحث البرتقالي */}
            <div className="mb-8">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-md font-bold text-lg transition-colors duration-300 shadow-lg">
                بحث
              </button>
            </div>
            
            {/* مربع البحث */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج تليفزيوني"
                className="w-full bg-gray-900 bg-opacity-60 border border-gray-600 rounded-lg px-6 py-5 text-white placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:bg-opacity-80 transition-all text-lg backdrop-blur-sm"
              />
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            </div>
          </div>

          {/* الأقسام الرئيسية - تصميم الموقع الأصلي */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full">
            
            {/* منوعات */}
            <Link href="/mix">
              <div className="group cursor-pointer">
                <div className="bg-gray-800 bg-opacity-70 hover:bg-orange-600 hover:bg-opacity-90 rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-gray-600 border-opacity-30">
                  {/* أيقونة منوعات */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xl group-hover:text-yellow-100">منوعات</h3>
                </div>
              </div>
            </Link>

            {/* تلفزيون */}
            <Link href="/shows">
              <div className="group cursor-pointer">
                <div className="bg-gray-800 bg-opacity-70 hover:bg-orange-600 hover:bg-opacity-90 rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-gray-600 border-opacity-30">
                  {/* أيقونة تلفزيون */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H3V5h18v10z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xl group-hover:text-yellow-100">تلفزيون</h3>
                </div>
              </div>
            </Link>

            {/* مسلسلات */}
            <Link href="/series">
              <div className="group cursor-pointer">
                <div className="bg-gray-800 bg-opacity-70 hover:bg-orange-600 hover:bg-opacity-90 rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-gray-600 border-opacity-30">
                  {/* أيقونة مسلسلات */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xl group-hover:text-yellow-100">مسلسلات</h3>
                </div>
              </div>
            </Link>

            {/* أفلام */}
            <Link href="/movies">
              <div className="group cursor-pointer">
                <div className="bg-gray-800 bg-opacity-70 hover:bg-orange-600 hover:bg-opacity-90 rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-gray-600 border-opacity-30">
                  {/* أيقونة أفلام */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xl group-hover:text-yellow-100">أفلام</h3>
                </div>
              </div>
            </Link>

          </div>

          {/* أيقونات التواصل الاجتماعي في الأسفل */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-6 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017.001"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
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