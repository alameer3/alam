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

export function ImprovedResponsiveHeader() {
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-2">
          
          {/* النافذة اليسرى: التنقل المحمول والشعار */}
          <div className="flex items-center gap-2">
            {(isMobile || isTablet) && <MobileNavigation />}
            
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg shadow-lg">
                <Film className="h-5 w-5 text-primary-foreground" />
              </div>
              {!isMobile && (
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    𝐘𝐄𝐌𝐄𝐍 🇾🇪 𝐅𝐋𝐈𝐗
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    منصة السينما اليمنية
                  </p>
                </div>
              )}
              {isMobile && (
                <span className="text-sm font-bold text-primary">YEMEN FLIX</span>
              )}
            </Link>
          </div>

          {/* التنقل المكتبي */}
          {!isMobile && !isTablet && (
            <nav className="hidden lg:flex items-center space-x-4 space-x-reverse">
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
                    size="sm"
                    className={`relative transition-all duration-200 ${
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

          {/* شريط البحث */}
          <div className={`flex-1 mx-2 ${isMobile ? "max-w-40" : "max-w-md"}`}>
            <form onSubmit={handleSearch} className="relative">
              <div className={`relative transition-all duration-200 ${
                isSearchFocused ? "scale-105" : ""
              }`}>
                <Input
                  type="text"
                  placeholder={isMobile ? "بحث..." : "البحث عن فيلم أو مسلسل..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full bg-muted/50 border-2 rounded-full transition-all duration-200 focus:border-primary focus:bg-background ${
                    isMobile ? "py-1 px-2 pr-8 pl-2 text-sm" : "py-2 px-4 pr-10 pl-4"
                  } ${isSearchFocused ? "shadow-lg shadow-primary/20" : ""}`}
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className={`absolute ${isMobile ? "right-1 top-1" : "right-2 top-2"} h-6 w-6 p-0 hover:bg-primary/10`}
                >
                  <Search className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                </Button>
                
                {/* زر البحث المتقدم */}
                {!isMobile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAdvancedSearch}
                    className="absolute left-2 top-2 h-6 px-2 text-xs text-muted-foreground hover:text-primary"
                  >
                    <SlidersHorizontal className="h-3 w-3 mr-1" />
                    متقدم
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* الأيقونات والإجراءات */}
          <div className="flex items-center gap-1">
            
            {/* الإشعارات */}
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              className="relative"
              onClick={() => navigate("/notifications")}
            >
              <Bell className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* مبدل الثيم - مخفي في الهاتف */}
            {!isMobile && <AdvancedThemeSwitcher />}

            {/* قائمة المستخدم */}
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