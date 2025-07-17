import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, User, HelpCircle, Menu, Film, Tv, MonitorPlay, Sparkles, BookOpen, Gamepad2, Smartphone, Drama, Zap, Trophy, Clock, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/images/logo-white.svg";

export default function AkSvHeader() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSections, setShowSections] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectionsRef.current && !sectionsRef.current.contains(event.target as Node)) {
        setShowSections(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showSections || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSections, showMobileMenu]);

  const handleSectionClick = (path: string) => {
    setLocation(path);
    setShowSections(false);
    setShowMobileMenu(false);
  };

  const categories = [
    {
      title: "أفلام",
      icon: Film,
      path: "/movies"
    },
    {
      title: "مسلسلات",
      icon: MonitorPlay,
      path: "/series"
    },
    {
      title: "الإعلانات",
      icon: Film,
      path: "/trailers"
    },
    {
      title: "البرامج",
      icon: BookOpen,
      path: "/programs"
    },
    {
      title: "الألعاب",
      icon: Gamepad2,
      path: "/games"
    },
    {
      title: "التطبيقات",
      icon: Smartphone,
      path: "/applications"
    },
    {
      title: "المسرحيات",
      icon: Drama,
      path: "/theater"
    },
    {
      title: "المصارعة",
      icon: Zap,
      path: "/wrestling"
    },
    {
      title: "الرياضة",
      icon: Trophy,
      path: "/sports"
    }
  ];

  return (
    <header className="akwam-dark-bg border-b border-gray-800 sticky top-0 z-50 akwam-transition" style={{ height: '70px' }}>
      {/* الهيدر العلوي */}
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* الجانب الأيمن - معلومات المستخدم وقائمة الجوال */}
          <div className="flex items-center gap-4">
            {/* قائمة الجوال */}
            <div className="md:hidden relative" ref={mobileMenuRef}>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-white akwam-hover akwam-transition"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* القائمة الجانبية للجوال */}
              {showMobileMenu && (
                <div className="absolute top-full right-0 mt-1 w-64 akwam-menu-bg akwam-radius shadow-lg border border-gray-700 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 akwam-primary-color text-sm font-semibold border-b border-gray-700">
                      الأقسام
                    </div>
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.path}
                          onClick={() => handleSectionClick(category.path)}
                          className="w-full px-4 py-2 text-right text-white akwam-hover akwam-transition flex items-center justify-end gap-2 text-sm"
                        >
                          {category.title}
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <User className="w-4 h-4" />
              <span>أهلاً بك، ضيف</span>
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>

          {/* الوسط - شريط البحث */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="البحث في الأفلام والمسلسلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pr-4 pl-12 akwam-menu-bg border-gray-700 text-white placeholder:text-white/60 text-sm akwam-radius"
                dir="rtl"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            </form>
          </div>

          {/* الجانب الأيسر - الشعار وأُضيف حديثاً وقائمة الأقسام */}
          <div className="flex items-center gap-4">
            {/* قائمة الأقسام - للجميع */}
            <div className="relative" ref={sectionsRef}>
              <button
                onClick={() => setShowSections(!showSections)}
                className="text-white akwam-hover akwam-transition flex items-center gap-2 text-sm"
              >
                الأقسام
                <ChevronDown className={`w-4 h-4 akwam-transition ${showSections ? 'rotate-180' : ''}`} />
              </button>
              
              {/* القائمة المنسدلة */}
              {showSections && (
                <div className="absolute top-full left-0 mt-1 w-48 akwam-menu-bg akwam-radius shadow-lg border border-gray-700 z-50">
                  <div className="py-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.path}
                          onClick={() => handleSectionClick(category.path)}
                          className="w-full px-4 py-2 text-right text-white akwam-hover akwam-transition flex items-center justify-end gap-2 text-sm"
                        >
                          {category.title}
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setLocation("/recent")}
              className="akwam-primary-color akwam-hover akwam-transition flex items-center gap-2 text-sm"
            >
              <Clock className="w-4 h-4" />
              أُضيف حديثاً
            </button>
            <button
              onClick={() => setLocation("/")}
              className="akwam-primary-color akwam-hover akwam-transition flex items-center gap-2"
            >
              <img 
                src={logoWhite} 
                alt="اكوام" 
                className="w-12 h-8 object-contain"
              />
              <span className="text-lg font-bold">اكوام</span>
            </button>
          </div>
        </div>
      </div>
      

    </header>
  );
}