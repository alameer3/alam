import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Home, 
  Film, 
  Video, 
  Tv, 
  Globe, 
  User, 
  Heart, 
  Settings,
  LogOut,
  Menu,
  X,
  Play
} from "lucide-react";

export default function AkHeader() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "الرئيسية", href: "/", icon: Home, color: "text-red-600" },
    { name: "الأفلام", href: "/movies", icon: Film, color: "text-blue-600" },
    { name: "المسلسلات", href: "/series", icon: Video, color: "text-green-600" },
    { name: "البرامج", href: "/shows", icon: Tv, color: "text-purple-600" },
    { name: "المحتوى المميز", href: "/ones", icon: Play, color: "text-yellow-600" },
    { name: "منوعات", href: "/mix", icon: Globe, color: "text-orange-600" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-reverse space-x-3">
            <div className="bg-gradient-to-r from-red-600 via-white to-black p-2 rounded-lg shadow-lg">
              <span className="text-xl font-bold">🇾🇪</span>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">اكوام</h1>
              <p className="text-xs text-gray-300">ak.sv - الموقع العربي الأول</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="ابحث في ak.sv عن الأفلام والمسلسلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-right border-2 border-white/30 focus:border-yellow-400 rounded-full text-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 rounded-full p-2"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback>YF</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className="w-4 h-4 mr-2" />
                  المفضلة
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  الإعدادات
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="w-4 h-4 mr-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8 py-4 border-t border-gray-200">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-white" : item.color}`} />
                <span className="font-medium">{item.name}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start space-x-2 px-4 py-3 ${
                      isActive(item.href)
                        ? "bg-red-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-white" : item.color}`} />
                    <span className="font-medium">{item.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}