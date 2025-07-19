import { Search, User, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* الشعار على اليمين */}
          <div className="flex items-center">
            <img 
              src="@assets/assets/images/logo-white.svg" 
              alt="أكوام" 
              className="h-8 w-auto"
            />
          </div>

          {/* شريط البحث في المنتصف */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن فيلم أو مسلسل أو أي شيء آخر..."
                className="w-full bg-gray-800/80 backdrop-blur-sm text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-orange-500 transition-colors"
                dir="rtl"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* أزرار التنقل على اليسار */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <button className="text-white hover:text-orange-500 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="flex items-center space-x-2 space-x-reverse text-white hover:text-orange-500 transition-colors">
              <User className="h-5 w-5" />
              <span className="text-sm">تسجيل دخول</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;