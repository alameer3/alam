import React, { useEffect } from 'react';

// الصفحة الرئيسية المطابقة لموقع ak.sv
const OnesPage: React.FC = () => {
  useEffect(() => {
    // تطبيق تأثير الكتابة بدون مكتبات خارجية
    const searchInput = document.getElementById('typed-search');
    if (searchInput) {
      const texts = ['ابحث عن فيلم', 'ابحث عن مسلسل', 'ابحث عن برنامج'];
      let currentTextIndex = 0;
      let currentCharIndex = 0;
      let isDeleting = false;
      
      const typeEffect = () => {
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
        
        setTimeout(typeEffect, typeSpeed);
      };
      
      typeEffect();
    }
  }, []);

  return (
    <div id="page-container" className="sidebar-o sidebar-dark enable-page-overlay side-scroll page-header-fixed page-header-dark main-content-narrow">
      {/* Header */}
      <header id="page-header">
        <div className="content-header">
          <div className="d-flex align-items-center">
            {/* الشعار */}
            <div className="d-flex align-items-center">
              <a className="link-fx font-w600 font-size-h5 text-white" href="/">
                <img src="/logo-white.svg" alt="اكوام" style={{ height: '40px' }} />
                <span className="ml-2">اكوام</span>
              </a>
            </div>
            
            {/* مساحة فارغة */}
            <div className="flex-fill"></div>
            
            {/* البحث */}
            <div className="d-flex align-items-center">
              <form className="form-inline" action="/search" method="get">
                <div className="form-group">
                  <input
                    type="search"
                    className="form-control form-control-alt"
                    id="typed-search"
                    name="q"
                    placeholder="البحث..."
                    autoComplete="off"
                  />
                </div>
                <button type="submit" className="btn btn-alt-primary ml-2">
                  <i className="fa fa-search"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main id="main-container" className="main-content">
        <div className="hero-bg" style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          minHeight: '100vh',
          padding: '60px 0'
        }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                {/* قسم البحث الرئيسي */}
                <div className="text-center mb-5">
                  <h1 className="h2 text-white mb-3">شمس المواقع</h1>
                  <p className="text-white-75 mb-4">
                    الموقع العربي الاول لتحميل و مشاهدة الافلام, المسلسلات, الالعاب, البرامج و التطبيقات
                  </p>
                  
                  {/* شريط البحث */}
                  <div className="search-section mb-5">
                    <div className="search-wrapper">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="ابحث عن فيلم أو مسلسل..."
                        style={{
                          borderRadius: '25px',
                          border: 'none',
                          padding: '12px 20px',
                          fontSize: '16px'
                        }}
                      />
                      <button
                        type="submit"
                        className="btn btn-warning btn-lg"
                        style={{
                          borderRadius: '25px',
                          padding: '12px 30px',
                          marginLeft: '10px'
                        }}
                      >
                        بحث
                      </button>
                    </div>
                  </div>
                </div>

                {/* الأقسام */}
                <div className="categories-section">
                  <h3 className="text-white text-center mb-4">الأقسام</h3>
                  <div className="row">
                    <div className="col-md-3 col-sm-6 mb-3">
                      <div className="category-card text-center p-4" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease'
                      }}>
                        <i className="fas fa-film fa-3x text-warning mb-3"></i>
                        <h5 className="text-white">الأفلام</h5>
                        <p className="text-white-75">أحدث الأفلام العربية والأجنبية</p>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-3">
                      <div className="category-card text-center p-4" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease'
                      }}>
                        <i className="fas fa-tv fa-3x text-warning mb-3"></i>
                        <h5 className="text-white">المسلسلات</h5>
                        <p className="text-white-75">أفضل المسلسلات والدراما</p>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-3">
                      <div className="category-card text-center p-4" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease'
                      }}>
                        <i className="fas fa-gamepad fa-3x text-warning mb-3"></i>
                        <h5 className="text-white">الألعاب</h5>
                        <p className="text-white-75">أحدث الألعاب والتطبيقات</p>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-3">
                      <div className="category-card text-center p-4" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease'
                      }}>
                        <i className="fas fa-microphone fa-3x text-warning mb-3"></i>
                        <h5 className="text-white">البرامج</h5>
                        <p className="text-white-75">برامج ومنوعات متنوعة</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnesPage;