import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 space-x-reverse mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-orange-400 bg-black flex items-center justify-center">
                <span className="text-xl font-bold text-orange-400">AK.SV</span>
              </div>
              <span className="text-2xl font-bold text-white">أكوام يمني</span>
            </div>
            <p className="text-gray-300 mb-4">
              منصة يمنية رائدة لتحميل ومشاهدة الأفلام والمسلسلات والبرامج العربية والأجنبية
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-300 hover:text-orange-400">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-orange-400">الرئيسية</Link></li>
              <li><Link href="/movies" className="text-gray-300 hover:text-orange-400">الأفلام</Link></li>
              <li><Link href="/series" className="text-gray-300 hover:text-orange-400">المسلسلات</Link></li>
              <li><Link href="/programs" className="text-gray-300 hover:text-orange-400">البرامج</Link></li>
              <li><Link href="/trailers" className="text-gray-300 hover:text-orange-400">الإعلانات</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">الدعم</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-orange-400">مركز المساعدة</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400">اتصل بنا</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400">سياسة الخصوصية</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400">شروط الاستخدام</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 أكوام يمني AK.SV. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
