import { Link } from "wouter";
import { Film, Tv, MonitorSpeaker, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const categoryCards = [
  {
    href: "/miscellaneous",
    label: "منوعات",
    icon: Sparkles,
    color: "bg-gradient-to-br from-pink-600 to-purple-700",
    description: "موسيقى وبرامج متنوعة"
  },
  {
    href: "/television", 
    label: "تلفزيون",
    icon: MonitorSpeaker,
    color: "bg-gradient-to-br from-purple-600 to-indigo-700",
    description: "برامج تلفزيونية ووثائقيات"
  },
  {
    href: "/series",
    label: "مسلسلات", 
    icon: Tv,
    color: "bg-gradient-to-br from-green-600 to-emerald-700",
    description: "مسلسلات عربية وأجنبية"
  },
  {
    href: "/movies",
    label: "أفلام",
    icon: Film,
    color: "bg-gradient-to-br from-red-600 to-orange-700", 
    description: "أحدث الأفلام العربية والعالمية"
  }
];

export function AkStyleHero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <img 
                    src="/assets/logo_1.png" 
                    alt="Yemen Flix" 
                    className="w-20 h-20 object-contain"
                  />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wide">
              𝐘𝐄𝐌𝐄𝐍 🇾🇪 𝐅𝐋𝐈𝐗
            </h1>
            <p className="text-xl text-gray-300 mb-4">منصة السينما اليمنية</p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="ابحث عن الأفلام والمسلسلات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 bg-black/40 border-white/20 text-white placeholder-gray-400 text-lg px-6 rounded-full backdrop-blur-md focus:border-red-500 focus:ring-red-500/20"
            />
            <Button className="absolute left-2 top-2 h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              بحث
            </Button>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
          {categoryCards.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.href} href={category.href}>
                <div className={`${category.color} rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-3xl group relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative z-10 text-center">
                    <IconComponent className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-xl font-bold mb-2">{category.label}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{category.description}</p>
                  </div>
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Links */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
          <span>جميع الحقوق محفوظة</span>
          <span>•</span>
          <span>Yemen Flix 2025</span>
          <span>•</span>
          <span>منصة المشاهدة الأولى</span>
        </div>
      </div>
    </div>
  );
}