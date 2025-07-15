import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, User, Crown, Heart, SlidersHorizontal, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchModal from "@/components/search/search-modal";
import AdvancedSearch from "@/components/search/advanced-search";
import FavoritesModal from "@/components/user/favorites-modal";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

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
    <header className="bg-background/95 backdrop-blur-md border-b border-border/50 fixed w-full top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileNavigation />
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-red-500 to-red-600 p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <img 
                  src="/assets/logo_1.png" 
                  alt="Yemen Flix Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                𝐘𝐄𝐌𝐄𝐍 🇾🇪 𝐅𝐋𝐈𝐗
              </span>
              <span className="text-xs text-muted-foreground -mt-1">منصة السينما اليمنية</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4 gap-2">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="البحث عن فيلم أو مسلسل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card/50 backdrop-blur-sm rounded-full py-2.5 px-4 pr-10 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
            </form>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="rounded-full border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="md:hidden rounded-full hover:bg-muted/50 transition-all duration-300"
            >
              <Search className="w-4 h-4" />
            </Button>
            
            {/* Favorites */}
            <FavoritesModal onContentSelect={handleContentClick}>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full hover:bg-muted/50 transition-all duration-300"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </FavoritesModal>
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-muted/50 transition-all duration-300 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Button>
            
            {/* Profile */}
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-muted/50 transition-all duration-300"
            >
              <User className="w-4 h-4" />
            </Button>
            
            {/* VIP Button */}
            <Button 
              size="sm"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-4 py-2"
            >
              <Crown className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">VIP</span>
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