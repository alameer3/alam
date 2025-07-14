import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MobileNavigation } from "./mobile-navigation";
import { AdvancedThemeSwitcher } from "@/components/theme/advanced-theme-switcher";
import { useResponsive } from "./responsive-layout";
import { useAuthData } from "@/hooks/useAuth";
import { UserMenu } from "./user-menu";
import { 
  Search, 
  Bell, 
  User, 
  Heart, 
  Film, 
  Crown,
  Shield,
  Settings,
  SlidersHorizontal,

} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function EnhancedResponsiveHeader() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuthData();
  const { isMobile, isTablet } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications] = useState(3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAdvancedSearch = () => {
    navigate("/search");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Mobile Navigation & Logo */}
          <div className="flex items-center gap-3">
            <MobileNavigation />
            
            <Link href="/" className="flex items-center gap-3 group">
              {/* شعار متحرك ومتطور */}
              <div className="relative">
                {/* هالة متوهجة */}
                <div className="absolute inset-0 w-10 h-10 rounded-xl bg-red-500/20 blur-md group-hover:bg-red-500/40 group-hover:scale-125 transition-all duration-700"></div>
                
                {/* إطار الشعار */}
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-gradient-to-br from-red-400 to-orange-600 shadow-2xl backdrop-blur-sm">
                  <img 
                    src="/assets/logo_1.png" 
                    alt="شعار يمن فليكس" 
                    className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                  />
                  
                  {/* شريط لامع يتحرك */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
                </div>
                
                {/* نبضة ضوئية */}
                <div className="absolute inset-0 w-10 h-10 rounded-xl border-2 border-red-400/50 scale-100 group-hover:scale-150 opacity-100 group-hover:opacity-0 transition-all duration-1000"></div>
              </div>

              {!isMobile && (
                <div className="relative">
                  {/* خلفية النص */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-lg group-hover:from-red-500/10 transition-all duration-500"></div>
                  
                  <div className="relative">
                    <img 
                      src="/assets/logo_2.png" 
                      alt="YEMEN FLIX" 
                      className="h-6 filter contrast-125 group-hover:contrast-150 transform group-hover:scale-105 transition-all duration-300"
                    />
                    
                    {/* خط تحتي متحرك */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-500"></div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground group-hover:text-red-400 transition-colors duration-300">
                    منصة السينما اليمنية
                    <span className="inline-block ml-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">⭐</span>
                  </p>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {!isMobile && !isTablet && (
            <nav className="hidden lg:flex items-center space-x-6 space-x-reverse">
              {[
                { path: "/", label: "الرئيسية" },
                { path: "/movies", label: "أفلام" },
                { path: "/series", label: "مسلسلات" },
                { path: "/television", label: "تلفزيون" },
                { path: "/miscellaneous", label: "متنوع" },
              ].map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button 
                    variant={location === item.path ? "secondary" : "ghost"}
                    className={`relative transition-all duration-300 ${
                      location === item.path 
                        ? "text-primary font-semibold" 
                        : "hover:text-primary"
                    }`}
                  >
                    {item.label}
                    {location === item.path && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </Button>
                </Link>
              ))}
            </nav>
          )}

          {/* Search Bar */}
          <div className={`flex-1 mx-2 ${isMobile ? "max-w-xs" : "max-w-md"}`}>
            <form onSubmit={handleSearch} className="relative">
              <div className={`relative transition-all duration-300 ${
                isSearchFocused ? "scale-105" : ""
              }`}>
                <Input
                  type="text"
                  placeholder={isMobile ? "بحث..." : "البحث عن فيلم أو مسلسل..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full bg-muted/50 border-2 rounded-full transition-all duration-300 focus:border-primary focus:bg-background ${
                    isMobile ? "py-1.5 px-3 pr-10 pl-3 text-sm" : "py-2 px-4 pr-12 pl-4"
                  } ${isSearchFocused ? "shadow-lg shadow-primary/20" : ""}`}
                />
                <Button
                  type="submit"
                  size={isMobile ? "sm" : "icon"}
                  variant="ghost"
                  className={`absolute ${isMobile ? "right-1 top-1" : "right-2 top-2"} h-8 w-8 p-0 hover:bg-primary/10`}
                >
                  <Search className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                </Button>
                
                {/* Advanced Search Button */}
                {!isMobile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAdvancedSearch}
                    className="absolute left-2 top-2 h-8 px-2 text-xs text-muted-foreground hover:text-primary"
                  >
                    <SlidersHorizontal className="h-3 w-3 mr-1" />
                    متقدم
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            
            {/* Notifications */}
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              className="relative"
            >
              <Bell className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className={`absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs ${
                    isMobile ? "text-xs" : "text-xs"
                  }`}
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Theme Switcher */}
            {!isMobile && <AdvancedThemeSwitcher />}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size={isMobile ? "sm" : "icon"}>
                    <User className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>الحساب</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    تسجيل الدخول
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/register")}>
                    إنشاء حساب جديد
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}