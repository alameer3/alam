import React, { useEffect } from 'react';

// الصفحة الرئيسية المطابقة بالضبط لموقع ak.sv الأصلي
const OnesPage: React.FC = () => {
  useEffect(() => {
    // تحميل ملفات CSS الأصلية
    const loadOriginalStyles = () => {
      const cssFiles = [
        '/fonts/fonts.css',
        '/css/plugins_orig.css',
        '/css/style_orig.css',
        '/css/akwam_orig.css',
        '/css/home_orig.css'
      ];
      
      cssFiles.forEach(file => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = file;
        document.head.appendChild(link);
      });
    };
    
    loadOriginalStyles();
    
    // تحميل JavaScript الأصلي
    const script = document.createElement('script');
    script.src = '/js/akwam_orig.js';
    document.head.appendChild(script);
    
    // تطبيق تأثير الكتابة على البحث
    const typedEffect = () => {
      const searchInput = document.querySelector('.widget-2 .form-control');
      if (searchInput) {
        const texts = ['ابحث عن فيلم', 'ابحث عن مسلسل', 'ابحث عن برنامج', 'ابحث عن مسرحية'];
        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        
        const typeText = () => {
          const currentText = texts[currentTextIndex];
          
          if (isDeleting) {
            searchInput.setAttribute('placeholder', currentText.substring(0, currentCharIndex - 1));
            currentCharIndex--;
          } else {
            searchInput.setAttribute('placeholder', currentText.substring(0, currentCharIndex + 1));
            currentCharIndex++;
          }
          
          let typeSpeed = 100;
          
          if (isDeleting) {
            typeSpeed /= 2;
          }
          
          if (!isDeleting && currentCharIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
          } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % texts.length;
          }
          
          setTimeout(typeText, typeSpeed);
        };
        
        typeText();
      }
    };
    
    setTimeout(typedEffect, 1000);
  }, []);

  return (
    <>
      {/* الهيدر الرئيسي */}
      <header className="main-header">
        <div className="container">
          <div className="main-logo">
            <a href="/">
              <div className="logo">
                <svg width="87" height="80" viewBox="0 0 87 80" fill="none">
                  <path d="M43.5 0L87 20V60L43.5 80L0 60V20L43.5 0Z" fill="#f3951e"/>
                  <text x="43.5" y="45" textAnchor="middle" fill="white" fontSize="24" fontFamily="STC-Bold">A</text>
                </svg>
              </div>
            </a>
          </div>
          
          <div className="search-container d-none d-md-block">
            <form className="search-form" action="/search" method="get">
              <input type="search" name="q" placeholder="البحث..." />
              <button type="submit">
                <i className="icon-search">🔍</i>
              </button>
            </form>
          </div>
          
          <div className="user-panel">
            <div className="user-toggle">
              <i className="icon-user">👤</i>
            </div>
            <div className="login-panel">
              <a href="/login" className="btn btn-orange btn-sm">تسجيل الدخول</a>
            </div>
          </div>
          
          <div className="search-toggle d-md-none">
            <i className="icon-search">🔍</i>
          </div>
          
          <div className="menu-toggle">
            <i className="icon-menu">☰</i>
          </div>
        </div>
      </header>

      {/* القائمة الرئيسية */}
      <nav className="main-menu">
        <div className="menu">
          <a href="/movies" className="item">
            <div className="icn">🎬</div>
            <div className="text">الأفلام</div>
          </a>
          <a href="/series" className="item">
            <div className="icn">📺</div>
            <div className="text">المسلسلات</div>
          </a>
          <a href="/shows" className="item">
            <div className="icn">🖥️</div>
            <div className="text">التلفزيون</div>
          </a>
          <a href="/mix" className="item">
            <div className="icn">🔀</div>
            <div className="text">منوعات</div>
          </a>
        </div>
      </nav>

      {/* صندوق البحث المنبثق */}
      <div className="search-box">
        <form action="/search" method="get">
          <input type="search" name="q" placeholder="ابحث عن فيلم أو مسلسل..." />
          <button type="submit">🔍</button>
        </form>
        <div className="search-toggle">✕</div>
      </div>

      {/* طبقة التغطية */}
      <div className="site-overlay"></div>

      {/* المحتوى الرئيسي */}
      <main className="main-content">
        {/* ارتفاع الهيدر */}
        <div className="main-header-height"></div>
        
        {/* المحتوى */}
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* الزر الرئيسي */}
              <div className="home-site-btn-container fade-in-up">
                <div className="home-site-btn glow-effect">
                  <a href="/" className="link"></a>
                  <div className="logo">
                    <svg width="87" height="80" viewBox="0 0 87 80" fill="none">
                      <path d="M43.5 0L87 20V60L43.5 80L0 60V20L43.5 0Z" fill="#f3951e"/>
                      <text x="43.5" y="45" textAnchor="middle" fill="white" fontSize="24" fontFamily="STC-Bold">A</text>
                    </svg>
                  </div>
                  <div className="text">شمس المواقع</div>
                </div>
              </div>

              {/* الويدجيت الرئيسي */}
              <div className="widget-2 fade-in-up">
                <div className="widget-body">
                  <div className="form">
                    <form action="/search" method="get">
                      <div className="row no-gutters">
                        <div className="col">
                          <input 
                            type="search" 
                            className="form-control" 
                            name="q" 
                            placeholder="ابحث عن فيلم أو مسلسل..."
                            autoComplete="off"
                          />
                          <label>
                            <span className="label">ابحث عن فيلم أو مسلسل...</span>
                          </label>
                        </div>
                        <div className="col-auto">
                          <button type="submit" className="btn-orange">بحث</button>
                        </div>
                      </div>
                    </form>
                  </div>
                  
                  {/* قائمة الأقسام الرئيسية */}
                  <div className="main-categories-list">
                    <div className="row">
                      <div className="col-lg col-4">
                        <a href="/movies" className="item zoom-effect">
                          <div className="icn">🎬</div>
                          <div className="font-size-16">الأفلام</div>
                        </a>
                      </div>
                      <div className="col-lg col-4">
                        <a href="/series" className="item zoom-effect">
                          <div className="icn">📺</div>
                          <div className="font-size-16">المسلسلات</div>
                        </a>
                      </div>
                      <div className="col-lg col-4">
                        <a href="/shows" className="item zoom-effect">
                          <div className="icn">🖥️</div>
                          <div className="font-size-16">التلفزيون</div>
                        </a>
                      </div>
                      <div className="col-lg col-4">
                        <a href="/mix" className="item zoom-effect">
                          <div className="icn">🔀</div>
                          <div className="font-size-16">منوعات</div>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="main-categories-list-end"></div>
                </div>
              </div>
              
              {/* الإعلانات */}
              <div className="ads fade-in-up">
                <center>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '20px',
                    borderRadius: '10px',
                    color: 'white',
                    marginBottom: '20px'
                  }}>
                    مساحة إعلانية
                  </div>
                </center>
              </div>
            </div>
          </div>
        </div>
        
        {/* الفوتر */}
        <footer className="main-footer">
          <div className="container">
            <div className="social">
              <a href="https://facebook.com/akwamnetwork" className="facebook" target="_blank" rel="noopener">
                <i className="icon-facebook">📘</i>
              </a>
              <a href="https://youtube.com/akwamnetwork" className="youtube" target="_blank" rel="noopener">
                <i className="icon-youtube">📺</i>
              </a>
              <a href="mailto:info@akwam.net" className="email">
                <i className="icon-email">📧</i>
              </a>
              <a href="/app" className="app-store">
                <i className="icon-app-store">📱</i>
              </a>
              <a href="/" className="home">
                <i className="icon-home">🏠</i>
              </a>
            </div>
            
            <div className="links">
              <a href="/dmca">سياسة الخصوصية</a>
              <a href="/ads">سياسة الإعلانات</a>
              <a href="/contact">اتصل بنا</a>
              <a href="/about">من نحن</a>
            </div>
            
            <div className="copyright">
              <p>&copy; 2024 موقع أكوام. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>
      </main>
      
      {/* تأثيرات الخلفية */}
      <div className="particles-background"></div>
      <div className="light-effect"></div>
    </>
  );
};

export default OnesPage;