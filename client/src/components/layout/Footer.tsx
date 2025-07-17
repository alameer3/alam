// تم إزالة استيراد wouter لتجنب الأخطاء

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <svg width="40" height="33" viewBox="0 0 87 80" fill="none">
                <defs>
                  <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#007bff"/>
                    <stop offset="50%" stopColor="#28a745"/>
                    <stop offset="100%" stopColor="#6f42c1"/>
                  </linearGradient>
                </defs>
                <path d="M43.5 0L87 20V60L43.5 80L0 60V20L43.5 0Z" fill="url(#footerLogoGradient)"/>
                <text x="43.5" y="45" textAnchor="middle" fill="white" fontSize="10" fontFamily="STC-Bold">أكوام</text>
              </svg>
              <h3 className="text-xl font-bold">أكوام</h3>
            </div>
            <p className="text-gray-400 text-sm">
              الموقع العربي الأول لتحميل ومشاهدة الأفلام والمسلسلات العربية والأجنبية
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/movies" className="text-gray-400 hover:text-white transition-colors">أفلام</a></li>
              <li><a href="/series" className="text-gray-400 hover:text-white transition-colors">مسلسلات</a></li>
              <li><a href="/shows" className="text-gray-400 hover:text-white transition-colors">برامج</a></li>
              <li><a href="/mix" className="text-gray-400 hover:text-white transition-colors">منوعات</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">الفئات</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/category/arabic" className="text-gray-400 hover:text-white transition-colors">عربي</a></li>
              <li><a href="/category/foreign" className="text-gray-400 hover:text-white transition-colors">أجنبي</a></li>
              <li><a href="/category/turkish" className="text-gray-400 hover:text-white transition-colors">تركي</a></li>
              <li><a href="/category/korean" className="text-gray-400 hover:text-white transition-colors">كوري</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</a></li>
              <li><a href="/dmca" className="text-gray-400 hover:text-white transition-colors">سياسة DMCA</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">شروط الاستخدام</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 أكوام. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;