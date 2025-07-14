import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, User, Crown, Heart, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchModal from "@/components/search/search-modal";
import AdvancedSearch from "@/components/search/advanced-search";
import FavoritesModal from "@/components/user/favorites-modal";
import { AdvancedThemeSwitcher } from "@/components/theme/advanced-theme-switcher";
import { Content } from "@shared/schema";

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(true);
    }
  };

  const handleContentClick = (content: Content) => {
    window.location.href = `/content/${content.id}`;
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - تصميم مميز يجمع الشعارين */}
          <Link href="/" className="flex items-center space-x-4 space-x-reverse group">
            {/* الشعار الرئيسي مع تأثيرات متقدمة */}
            <div className="relative">
              {/* خلفية متوهجة */}
              <div className="absolute inset-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-sm group-hover:blur-md transition-all duration-500"></div>
              
              {/* الشعار مع إطار ذهبي */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-gradient-to-br from-yellow-400 to-red-500 shadow-2xl transform group-hover:rotate-3 group-hover:scale-110 transition-all duration-500">
                <img 
                  src="/assets/logo_1.png" 
                  alt="Yemen Flix Logo" 
                  className="w-full h-full object-cover"
                />
                {/* تأثير اللمعان */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </div>

            {/* النص مع تأثيرات متقدمة */}
            <div className="hidden md:flex items-center relative">
              {/* خلفية متوهجة للنص */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-lg blur-sm group-hover:blur-md transition-all duration-500"></div>
              
              {/* النص الرئيسي */}
              <div className="relative">
                <img 
                  src="/assets/logo_2.png" 
                  alt="YEMEN FLIX" 
                  className="h-8 filter drop-shadow-lg transform group-hover:scale-105 transition-all duration-500"
                />
                
                {/* خط تحت النص يظهر عند التمرير */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-700"></div>
              </div>
              
              {/* شارة "PREMIUM" صغيرة */}
              <div className="ml-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full opacity-80 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300">
                HD
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 gap-2">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="البحث عن فيلم أو مسلسل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              </div>
            </form>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="rounded-full"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="md:hidden"
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <AdvancedThemeSwitcher />
            
            <FavoritesModal onContentSelect={handleContentClick}>
              <Button 
                variant="ghost" 
                className="hover:bg-muted"
              >
                <Heart className="w-5 h-5" />
                <span className="hidden lg:inline ml-2">المفضلة</span>
              </Button>
            </FavoritesModal>
            

            

            
            <Button variant="ghost" className="flex items-center space-x-2 space-x-reverse hover:bg-muted">
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">أهلاً بك</span>
            </Button>
            
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Crown className="w-4 h-4 ml-2" />
              اشتراك VIP
            </Button>
          </div>
        </div>
      </div>

      {/* Search Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onContentClick={handleContentClick}
      />
      
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onContentClick={handleContentClick}
      />
    </header>
  );
}
