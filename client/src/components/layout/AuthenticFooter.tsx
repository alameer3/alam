import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const AuthenticFooter = () => {
  return (
    <footer className="main-footer bg-gray-900 border-t border-gray-800 mt-16">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <img 
                src="/extracted_files/home/ak.sv/style/assets/images/logo-white.svg" 
                alt="اكوام" 
                className="h-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div className="text-3xl font-bold text-white hidden">اكوام</div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              شمس المواقع، الموقع العربي الاول لتحميل و مشاهدة الافلام, المسلسلات, الالعاب, البرامج و التطبيقات, التلفزيون, المسرحيات, المصارعة, الرياضة
            </p>
            
            {/* Social Links */}
            <div className="social flex space-x-4">
              <a 
                href="https://www.facebook.com/akwamnet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com/AKOAMsocial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center transition"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://www.youtube.com/c/AKWAMnetwork" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="/contactus" 
                className="w-10 h-10 rounded-full bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center transition"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/movies" className="text-gray-300 hover:text-white transition">
                  أفلام
                </Link>
              </li>
              <li>
                <Link href="/series" className="text-gray-300 hover:text-white transition">
                  مسلسلات
                </Link>
              </li>
              <li>
                <Link href="/shows" className="text-gray-300 hover:text-white transition">
                  تلفزيون
                </Link>
              </li>
              <li>
                <Link href="/mix" className="text-gray-300 hover:text-white transition">
                  منوعات
                </Link>
              </li>
              <li>
                <Link href="/recent" className="text-gray-300 hover:text-white transition">
                  أضيف حديثا
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">الدعم</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contactus" className="text-gray-300 hover:text-white transition">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-gray-300 hover:text-white transition">
                  سياسة DMCA
                </Link>
              </li>
              <li>
                <Link href="/ad-policy" className="text-gray-300 hover:text-white transition">
                  سياسة الإعلانات
                </Link>
              </li>
              <li>
                <a 
                  href="https://ak.sv/AKWAM-Notifications" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition"
                >
                  تطبيق الإشعارات
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              جميع الحقوق محفوظة لـ شبكة اكوام © 2025
            </div>
            <div className="flex space-x-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition">
                شروط الاستخدام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthenticFooter;