import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import EnhancedSearch from "@/components/search/enhanced-search";

export default function AkSvHeader() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSections, setShowSections] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const sectionsRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectionsRef.current && !sectionsRef.current.contains(event.target as Node)) {
        setShowSections(false);
      }
    };

    if (showSections) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSections]);

  const handleSectionClick = (path: string) => {
    setLocation(path);
    setShowSections(false);
    setShowMobileMenu(false);
  };

  const categories = [
    { title: "أفلام", path: "/movies", icon: "icon-video-camera" },
    { title: "مسلسلات", path: "/series", icon: "icon-monitor" },
    { title: "البرامج", path: "/programs", icon: "icon-tv" },
    { title: "الألعاب", path: "/games", icon: "icon-game" },
    { title: "التطبيقات", path: "/applications", icon: "icon-mobile" },
    { title: "المسرحيات", path: "/theater", icon: "icon-theater" },
    { title: "المصارعة", path: "/wrestling", icon: "icon-wrestling" },
    { title: "الرياضة", path: "/sports", icon: "icon-sports" }
  ];

  return (
    <>
      {/* صندوق البحث الجانبي */}
      <div className={`search-box px-xl-5 ${showSearchBox ? 'active' : ''}`}>
        <div className="container search-container">
          <form onSubmit={handleSearch} className="search-form">
            <label htmlFor="searchBoxInput" className="d-flex align-items-center h-100 w-100 m-0">
              <button type="submit" className="px-3 ml-2 font-size-30">
                <i className="icon-search"></i>
              </button>
              <input 
                type="search" 
                name="q" 
                id="searchBoxInput" 
                placeholder="ابحث هنا"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </form>
          <div className="search-toggle" onClick={() => setShowSearchBox(false)}>
            <i className="icon-arrow-back"></i>
          </div>
        </div>
      </div>

      {/* القائمة الجانبية */}
      <div className={`main-menu ${showMobileMenu ? 'active' : ''}`}>
        <div className="container">
          <div className="menu-header d-flex justify-content-between align-items-center">
            <h3 className="text-white">الأقسام</h3>
            <button 
              className="close-menu text-white bg-transparent border-0"
              onClick={() => setShowMobileMenu(false)}
            >
              <i className="icon-close"></i>
            </button>
          </div>
          <nav className="menu-nav">
            {categories.map((category) => (
              <button
                key={category.path}
                onClick={() => handleSectionClick(category.path)}
                className="menu-item d-flex align-items-center text-white py-3 px-4 w-100 border-0 bg-transparent text-right"
              >
                <div className="icn ml-3">
                  <i className={category.icon}></i>
                </div>
                <div className="text">{category.title}</div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* الهيدر الرئيسي */}
      <div className="site-container">
        <div className="main-header-top"></div>
        <header className="main-header">
          <div className="container">
            <div className="row align-items-center">
              {/* الشعار */}
              <div className="col-auto">
                <h2 className="main-logo m-0">
                  <button onClick={() => setLocation("/ones")} className="d-inline-flex bg-transparent border-0">
                    <img src="/images/logo-white.svg" className="img-fluid" alt="اكوام" />
                  </button>
                </h2>
              </div>
              
              {/* زر الأقسام */}
              <div className="col-auto menu-toggle-container" ref={sectionsRef}>
                <button 
                  onClick={() => setShowSections(!showSections)}
                  className="menu-toggle d-flex align-items-center text-white bg-transparent border-0"
                >
                  <span className="icn"></span>
                  <div className="text font-size-18 mr-3">الأقسام</div>
                </button>
                
                {/* قائمة الأقسام المنسدلة */}
                {showSections && (
                  <div className="sections-dropdown">
                    <div className="dropdown-content">
                      {categories.map((category) => (
                        <button
                          key={category.path}
                          onClick={() => handleSectionClick(category.path)}
                          className="dropdown-item d-flex align-items-center text-white py-2 px-3 w-100 border-0 bg-transparent text-right"
                        >
                          <div className="icn ml-3">
                            <i className={category.icon}></i>
                          </div>
                          <div className="text">{category.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ml-auto"></div>
              
              {/* البحث المطور */}
              <div className="col-md-5 col-lg-6 search-container">
                <div className="search-form">
                  <EnhancedSearch 
                    onSearch={setSearchQuery}
                    placeholder="ابحث عن فيلم، مسلسل، برنامج..."
                    showTyped={true}
                    showResults={true}
                  />
                </div>
              </div>
              
              {/* أضيف حديثاً */}
              <div className="col-auto recently-container">
                <button 
                  onClick={() => setLocation("/recent")}
                  className="btn-recently bg-transparent border-0"
                >
                  <i className="icon-plus2 ml-2"></i>
                  <span>أضيف حديثا</span>
                </button>
              </div>
              
              {/* المستخدم */}
              <div className="col-auto user-profile-container">
                <div className="user-panel">
                  <button 
                    className="user-toggle d-block font-size-20 public bg-transparent border-0"
                    onClick={() => setLocation("/login")}
                  >
                    <i className="icon-user"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="main-header-height"></div>
      </div>

      {/* الخلفية الشفافة */}
      <div 
        className={`site-overlay ${showMobileMenu || showSearchBox ? 'active' : ''}`}
        onClick={() => {
          setShowMobileMenu(false);
          setShowSearchBox(false);
        }}
      ></div>
    </>
  );
}