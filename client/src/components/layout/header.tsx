import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, User, Crown, Heart, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchModal from "@/components/search/search-modal";
import AdvancedSearch from "@/components/search/advanced-search";
import FavoritesModal from "@/components/user/favorites-modal";
import { ThemeToggle } from "@/components/theme/theme-toggle";
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
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold hidden md:block">أكاديمية السينما</span>
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
            
            <ThemeToggle />
            
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
