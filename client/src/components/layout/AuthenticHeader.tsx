import { useState } from 'react';
import { Link } from 'wouter';
import { Search, Menu, Plus, User, Home, Facebook, Youtube, Mail } from 'lucide-react';

const AuthenticHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <>
      {/* Site Overlay */}
      {(isMenuOpen || isSearchOpen) && (
        <div 
          className="site-overlay fixed inset-0 bg-black bg-opacity-85 z-30 cursor-pointer"
          onClick={() => {
            setIsMenuOpen(false);
            setIsSearchOpen(false);
          }}
        />
      )}

      {/* Search Box */}
      <div className={`search-box ${isSearchOpen ? 'active' : ''}`}>
        <div className="container mx-auto">
          <form className="flex items-center">
            <button type="submit" className="px-3 ml-2">
              <Search size={20} />
            </button>
            <input 
              type="search" 
              name="q" 
              placeholder="ابحث هنا" 
              className="flex-1"
            />
          </form>
          <div 
            className="search-toggle absolute top-1/2 left-8 transform -translate-y-1/2 cursor-pointer"
            onClick={toggleSearch}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className={`main-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="d-flex flex-column h-full">
          <div className="my-auto w-full">
            <div className="menu flex flex-wrap justify-center py-8">
              <Link href="/movies" className="item transition">
                <div className="icn ml-3">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4H18Z"/>
                  </svg>
                </div>
                <div className="text">أفلام</div>
              </Link>
              <Link href="/series" className="item transition">
                <div className="icn ml-3">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"/>
                  </svg>
                </div>
                <div className="text">مسلسلات</div>
              </Link>
              <Link href="/shows" className="item transition">
                <div className="icn ml-3">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.16,3L6.75,4.41L9.34,7H4C2.89,7 2,7.89 2,9V19C2,20.11 2.89,21 4,21H20C21.11,21 22,20.11 22,19V9C22,7.89 21.11,7 20,7H14.66L17.25,4.41L15.84,3L12,6.84L8.16,3Z"/>
                  </svg>
                </div>
                <div className="text">تلفزيون</div>
              </Link>
              <Link href="/mix" className="item transition">
                <div className="icn ml-3">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5,3C3.89,3 3,3.9 3,5V19C3,20.1 3.89,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3H5M5,5H19V19H5V5Z"/>
                  </svg>
                </div>
                <div className="text">منوعات</div>
              </Link>
            </div>
          </div>
          <nav className="social flex justify-center pb-8">
            <a href="https://akw.to" className="home mx-2 w-10 h-10 rounded-full border border-gray-500 text-gray-500 hover:text-white hover:border-white flex items-center justify-center transition">
              <Home size={16} />
            </a>
            <a href="https://www.facebook.com/akwamnet" target="_blank" className="facebook mx-2 w-10 h-10 rounded-full border border-gray-500 text-gray-500 hover:text-white hover:border-blue-600 hover:bg-blue-600 flex items-center justify-center transition">
              <Facebook size={16} />
            </a>
            <a href="https://www.youtube.com/c/AKWAMnetwork" target="_blank" className="youtube mx-2 w-10 h-10 rounded-full border border-gray-500 text-gray-500 hover:text-white hover:border-red-600 hover:bg-red-600 flex items-center justify-center transition">
              <Youtube size={16} />
            </a>
            <a href="/contactus" className="email mx-2 w-10 h-10 rounded-full border border-gray-500 text-gray-500 hover:text-white hover:border-white flex items-center justify-center transition">
              <Mail size={16} />
            </a>
          </nav>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header fixed top-0 w-full z-40 bg-opacity-90 backdrop-blur-sm border-b border-gray-800" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="main-logo">
                <img 
                  src="/extracted_files/home/ak.sv/style/assets/images/logo-white.svg" 
                  alt="اكوام" 
                  className="h-8"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'block';
                  }}
                />
                <div className="text-2xl font-bold text-white hidden">اكوام</div>
              </Link>
            </div>
            
            <div className="flex items-center mr-4">
              <button 
                onClick={toggleMenu}
                className={`menu-toggle flex items-center text-white transition hover:text-orange-400 ${isMenuOpen ? 'text-orange-400' : ''}`}
              >
                <Menu className="w-6 h-6 ml-3" />
                <div className="text font-size-18">الأقسام</div>
              </button>
            </div>

            <div className="flex-1"></div>

            {/* Search Container */}
            <div className="search-container flex-1 max-w-md mx-4 hidden md:block">
              <div className="search-form relative">
                <form className="relative">
                  <input 
                    type="text" 
                    name="q"
                    placeholder="ابحث عن فيلم او مسلسل ..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                  />
                  <button className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                    <Search size={20} />
                  </button>
                </form>
              </div>
            </div>

            {/* Recently Added Button */}
            <div className="recently-container hidden lg:block">
              <Link href="/recent" className="btn-recently flex items-center bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition">
                <Plus size={16} className="ml-2" />
                <span>أضيف حديثا</span>
              </Link>
            </div>

            {/* User Profile */}
            <div className="user-profile-container">
              <div className="user-panel">
                <button className="user-toggle text-white hover:text-orange-400 p-2 transition">
                  <User size={20} />
                </button>
              </div>
            </div>

            {/* Mobile Search Toggle */}
            <button 
              onClick={toggleSearch}
              className="search-toggle md:hidden text-white hover:text-orange-400 p-2 transition"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default AuthenticHeader;