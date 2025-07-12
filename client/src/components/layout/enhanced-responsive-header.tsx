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
            
            <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg shadow-lg">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
              {!isMobile && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    𝐘𝐄𝐌𝐄𝐍 🇾🇪 𝐅𝐋𝐈𝐗
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    منصة السينما اليمنية
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
                { path: "/dashboard", label: "لوحة التحكم" },
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
          <div className="flex-1 max-w-md mx-4">
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
                  className={`w-full bg-muted/50 border-2 rounded-full py-2 px-4 pr-12 pl-4 transition-all duration-300 focus:border-primary focus:bg-background ${
                    isSearchFocused ? "shadow-lg shadow-primary/20" : ""
                  }`}
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
                
                {!isMobile && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleAdvancedSearch}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full p-2"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            
            {/* Theme Switcher - Hidden on Mobile */}
            {!isMobile && <AdvancedThemeSwitcher />}
            
            {/* Notifications */}
            <Link href="/notifications">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative rounded-full hover:bg-muted/50"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Quick Actions - Hidden on Mobile */}
            {!isMobile && (
              <>
                <Link href="/watchlists">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full hover:bg-muted/50"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                
                <Link href="/security">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full hover:bg-muted/50"
                  >
                    <Shield className="h-5 w-5" />
                  </Button>
                </Link>

              </>
            )}

            {/* User Menu */}
            <UserMenu isMobile={isMobile} />
          </div>
        </div>
      </div>
    </header>
  );
}