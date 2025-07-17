import { Link } from "wouter";
import { Search } from "lucide-react";

const Header = () => {
  return (
    <header className="main-header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="main-logo">
            <svg width="60" height="50" viewBox="0 0 87 80" fill="none" className="transition-all duration-300 hover:scale-110">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#007bff"/>
                  <stop offset="50%" stopColor="#28a745"/>
                  <stop offset="100%" stopColor="#6f42c1"/>
                </linearGradient>
              </defs>
              <path d="M43.5 0L87 20V60L43.5 80L0 60V20L43.5 0Z" fill="url(#logoGradient)"/>
              <text x="43.5" y="45" textAnchor="middle" fill="white" fontSize="12" fontFamily="STC-Bold">أكوام</text>
            </svg>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link href="/" className="nav-link">الرئيسية</Link>
            <Link href="/movies" className="nav-link">أفلام</Link>
            <Link href="/series" className="nav-link">مسلسلات</Link>
            <Link href="/shows" className="nav-link">برامج</Link>
            <Link href="/mix" className="nav-link">منوعات</Link>
          </nav>

          {/* Search */}
          <div className="search-form relative">
            <input
              type="text"
              placeholder="ابحث هنا..."
              className="search-input"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2">
            <span className="sr-only">Open menu</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;