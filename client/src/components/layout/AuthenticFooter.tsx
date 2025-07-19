import { Facebook, Twitter, Youtube, Instagram, Mail, Phone } from 'lucide-react';

const AuthenticFooter = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* معلومات الموقع */}
          <div className="space-y-4">
            <img 
              src="@assets/assets/images/logo-white.svg" 
              alt="أكوام" 
              className="h-8 w-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              الموقع العربي الأول لتحميل ومشاهدة الأفلام والمسلسلات العربية والأجنبية بجودة عالية
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/movies" className="text-gray-400 hover:text-orange-500 transition-colors">الأفلام</a></li>
              <li><a href="/series" className="text-gray-400 hover:text-orange-500 transition-colors">المسلسلات</a></li>
              <li><a href="/shows" className="text-gray-400 hover:text-orange-500 transition-colors">البرامج</a></li>
              <li><a href="/mix" className="text-gray-400 hover:text-orange-500 transition-colors">منوعات</a></li>
            </ul>
          </div>

          {/* الدعم */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الدعم</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/contactus" className="text-gray-400 hover:text-orange-500 transition-colors">اتصل بنا</a></li>
              <li><a href="/dmca" className="text-gray-400 hover:text-orange-500 transition-colors">DMCA</a></li>
              <li><a href="/ad-policy" className="text-gray-400 hover:text-orange-500 transition-colors">سياسة الإعلانات</a></li>
            </ul>
          </div>

          {/* التواصل الاجتماعي */}
          <div>
            <h3 className="text-lg font-semibold mb-4">تابعنا</h3>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@akwam.com</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+966 12 345 6789</span>
              </div>
            </div>
          </div>
        </div>

        {/* الحقوق */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              جميع الحقوق محفوظة © 2025 أكوام. تم التطوير بواسطة فريق أكوام
            </p>
            <div className="flex space-x-6 space-x-reverse mt-4 md:mt-0 text-sm">
              <a href="/dmca" className="text-gray-400 hover:text-orange-500 transition-colors">DMCA</a>
              <a href="/contactus" className="text-gray-400 hover:text-orange-500 transition-colors">اتصل بنا</a>
              <a href="/ad-policy" className="text-gray-400 hover:text-orange-500 transition-colors">سياسة الإعلانات</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthenticFooter;