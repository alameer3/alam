import { Link } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AkOriginalHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="ak-header sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-reverse space-x-3">
            <div className="ak-logo">
              اكوام
            </div>
            <div className="text-xs text-muted-foreground hidden md:block">
              شمس المواقع
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-reverse space-x-6">
            <Link to="/" className="ak-nav-link">الرئيسية</Link>
            <Link to="/movies" className="ak-nav-link">أفلام</Link>
            <Link to="/series" className="ak-nav-link">مسلسلات</Link>
            <Link to="/shows" className="ak-nav-link">تلفزيون</Link>
            <Link to="/ones" className="ak-nav-link">المضاف حديثاً</Link>
            <Link to="/mix" className="ak-nav-link">منوعات</Link>
          </nav>

          {/* Search */}
          <div className="flex items-center space-x-reverse space-x-3">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ak-search w-64 pl-10 pr-4"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border mt-4 pt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="ak-nav-link block" onClick={() => setIsMenuOpen(false)}>الرئيسية</Link>
              <Link to="/movies" className="ak-nav-link block" onClick={() => setIsMenuOpen(false)}>أفلام</Link>
              <Link to="/series" className="ak-nav-link block" onClick={() => setIsMenuOpen(false)}>مسلسلات</Link>
              <Link to="/shows" className="ak-nav-link block" onClick={() => setIsMenuOpen(false)}>تلفزيون</Link>
              <Link to="/ones" className="ak-nav-link block" onClick={() => setIsMenuOpen(false)}>المضاف حديثاً</Link>
              <Link to="/mix" className="ak-nav-link block" onClick={() => setIsMenuOpen(false)}>منوعات</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}