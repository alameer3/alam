import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Film, Tv, MonitorPlay, Sparkles, BookOpen, Gamepad2, Smartphone, Drama, Zap, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AkSvHomepage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    {
      title: "أفلام",
      icon: Film,
      path: "/movies",
      color: "from-red-500 to-red-600"
    },
    {
      title: "للتلفزيون",
      icon: Tv,
      path: "/television",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "مسلسلات",
      icon: MonitorPlay,
      path: "/series",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "منوعات",
      icon: Sparkles,
      path: "/mix",
      color: "from-green-500 to-green-600"
    },
    {
      title: "البرامج والكورسات",
      icon: BookOpen,
      path: "/programs",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      title: "الألعاب",
      icon: Gamepad2,
      path: "/games",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "التطبيقات",
      icon: Smartphone,
      path: "/applications",
      color: "from-pink-500 to-pink-600"
    },
    {
      title: "المسرحيات",
      icon: Drama,
      path: "/theater",
      color: "from-amber-500 to-amber-600"
    },
    {
      title: "المصارعة",
      icon: Zap,
      path: "/wrestling",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "الرياضة",
      icon: Trophy,
      path: "/sports",
      color: "from-teal-500 to-teal-600"
    }
  ];

  const socialLinks = [
    { icon: "🌐", url: "#", name: "الموقع" },
    { icon: "📧", url: "#", name: "البريد" },
    { icon: "📱", url: "#", name: "التطبيق" },
    { icon: "📞", url: "#", name: "الاتصال" },
    { icon: "💬", url: "#", name: "الدعم" },
    { icon: "📢", url: "#", name: "الإعلانات" },
    { icon: "ℹ️", url: "#", name: "المعلومات" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* خلفية الصورة */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1489599363418-c1da4a2b7bdf?q=80&w=1920&h=1080&fit=crop')`
        }}
      />
      
      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
        
        {/* الشعار */}
        <div className="mb-12">
          <div className="w-48 h-48 rounded-full border-4 border-orange-400 bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-orange-400">AK.SV</div>
              <div className="text-sm font-bold text-white">أكوام يمني</div>
            </div>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="w-full max-w-2xl mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex">
              <Input
                type="text"
                placeholder="البحث في الأفلام والمسلسلات والبرامج التلفزيونية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pr-6 pl-16 text-lg bg-black/30 border-white/20 text-white placeholder:text-white/70 backdrop-blur-sm rounded-l-full"
                dir="rtl"
              />
              <Button
                type="submit"
                className="h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-r-full"
              >
                بحث
              </Button>
            </div>
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/70" />
          </form>
        </div>

        {/* التصنيفات الأساسية */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-16">
          {categories.map((category) => (
            <button
              key={category.path}
              onClick={() => setLocation(category.path)}
              className="group relative"
            >
              <div className="w-32 h-32 rounded-2xl bg-black/40 backdrop-blur-sm border-2 border-white/30 flex flex-col items-center justify-center gap-3 hover:bg-black/60 transition-all duration-300 group-hover:scale-110 shadow-xl">
                <category.icon className="w-10 h-10 text-white group-hover:text-orange-400 transition-colors" />
                <span className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">{category.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* روابط التواصل الاجتماعي */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {socialLinks.map((link, index) => (
            <button
              key={index}
              className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/50 transition-all duration-300 hover:scale-110"
              title={link.name}
            >
              <span className="text-lg">{link.icon}</span>
            </button>
          ))}
        </div>

        {/* معلومات الموقع */}
        <div className="text-center text-white/70 text-sm">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <span>سياسة الخصوصية</span>
            <span>•</span>
            <span>شروط الخدمة</span>
            <span>•</span>
            <span>DMCA</span>
            <span>•</span>
            <span>اتصل بنا</span>
            <span>•</span>
            <span>الأسئلة الشائعة</span>
            <span>•</span>
            <span>الدعم</span>
          </div>
          <div className="text-xs">
            جميع الحقوق محفوظة © 2025 • أكوام يمني AK.SV
          </div>
        </div>
      </div>

      {/* معلومات المستخدم في الأعلى */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span>أهلاً بك، ضيف</span>
            <span className="text-green-400">●</span>
          </div>
          <div className="text-orange-400 text-lg font-bold flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-orange-400 bg-orange-500/10 flex items-center justify-center">
              <span className="text-xs font-bold">AK</span>
            </div>
            أكوام يمني
          </div>
        </div>
      </div>
    </div>
  );
}