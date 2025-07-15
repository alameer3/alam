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
  Play,
  Star,
  Clock,
  Calendar
} from "lucide-react";

export default function AkAuthenticHeader() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation matching ak.sv structure
  const navigation = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "الأفلام", href: "/movies", icon: Film },
    { name: "المسلسلات", href: "/series", icon: Video },
    { name: "البرامج", href: "/shows", icon: Tv },
    { name: "اضيف حديثاً", href: "/ones", icon: Clock },
    { name: "المنوعات", href: "/mix", icon: Globe }
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
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl sticky top-0 z-50 border-b border-red-500/20">
      <div className="container mx-auto px-4">
        {/* Top Bar - enhanced ak.sv layout */}
        <div className="flex items-center justify-between py-4">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-reverse space-x-4 hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-red-600 via-white to-black p-3 rounded-xl shadow-2xl">
              <span className="text-2xl font-bold">🇾🇪</span>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                اكوام
              </h1>
              <p className="text-sm text-gray-300 font-semibold">ak.sv</p>
            </div>
          </Link>

          {/* Search Bar - enhanced centered design */}
          <div className="flex-1 max-w-3xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="ابحث عن الأفلام والمسلسلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 text-right border-2 border-slate-600 focus:border-red-500 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white placeholder-gray-400 text-lg font-medium shadow-inner"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            </form>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-reverse space-x-6">
            <Button variant="ghost" size="lg" className="text-white hover:bg-red-600/20 px-6 py-3 rounded-xl font-semibold">
              <User className="h-5 w-5 ml-2" />
              تسجيل الدخول
            </Button>
            <Button variant="ghost" size="lg" className="text-white hover:bg-red-600/20 px-6 py-3 rounded-xl font-semibold">
              <Heart className="h-5 w-5 ml-2" />
              المفضلة
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation Bar - enhanced ak.sv structure */}
        <nav className="hidden md:flex items-center justify-center space-x-reverse space-x-8 py-4 border-t border-slate-700/50">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center space-x-reverse space-x-3 px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                isActive(item.href)
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/25 transform scale-105"
                  : "text-gray-300 hover:text-white hover:bg-slate-800/50 hover:scale-105"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-slate-800 rounded-lg mt-2 p-4 border border-slate-700">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-reverse space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-slate-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}