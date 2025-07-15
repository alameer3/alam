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
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Top Bar - ak.sv exact layout */}
        <div className="flex items-center justify-between py-3">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-reverse space-x-3 hover:opacity-80 transition-opacity duration-200">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
              <span className="text-lg font-bold">AK</span>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-800">
                اكوام
              </h1>
              <p className="text-xs text-gray-500">ak.sv</p>
            </div>
          </Link>

          {/* Search Bar - ak.sv style */}
          <div className="flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="ابحث عن الأفلام والمسلسلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-right border border-gray-300 focus:border-blue-500 rounded-lg bg-white text-gray-900 placeholder-gray-500 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-reverse space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm">
              <User className="h-4 w-4 ml-1" />
              تسجيل الدخول
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm">
              <Heart className="h-4 w-4 ml-1" />
              المفضلة
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Bar - ak.sv exact structure */}
        <nav className="hidden md:flex items-center justify-center space-x-reverse space-x-6 py-2 border-t border-gray-200">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center space-x-reverse space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive(item.href)
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
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