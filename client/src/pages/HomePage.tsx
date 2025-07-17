import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Typed: any;
  }
}

const HomePage: React.FC = () => {
  const typedElementRef = useRef<HTMLSpanElement>(null);
  const typedInstance = useRef<any>(null);

  useEffect(() => {
    // تطبيق كلاس الصفحة الرئيسية
    document.body.classList.add('body-home');

    // إعداد Typed.js (بعد تحميل المكتبة)
    const initTyped = () => {
      if (window.Typed && typedElementRef.current) {
        typedInstance.current = new window.Typed(typedElementRef.current, {
          strings: [
            'ابحث عن أفلام مميزة...',
            'ابحث عن مسلسلات رائعة...',
            'ابحث عن برامج مشوقة...',
            'ابحث عن ألعاب ممتعة...',
            'ابحث عن محتوى متنوع...'
          ],
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 2000,
          loop: true,
          showCursor: true,
          cursorChar: '|'
        });
      }
    };

    // تأخير لضمان تحميل المكتبات
    setTimeout(initTyped, 500);

    return () => {
      document.body.classList.remove('body-home');
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    const query = input.value.trim();
    
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          مرحباً بك في اكوام
        </h1>
        <p className="hero-subtitle">
          شمس المواقع، الموقع العربي الأول لتحميل ومشاهدة الأفلام والمسلسلات
        </p>

        <div className="hero-search">
          <div className="search-container">
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder=""
                  autoComplete="off"
                />
                <button type="submit" className="search-btn">
                  <i className="icon-search"></i>
                </button>
              </div>
            </form>
            <div className="typed-text">
              <span ref={typedElementRef}></span>
            </div>
          </div>
        </div>
      </div>

      {/* الأقسام السريعة */}
      <div className="quick-sections">
        <a href="/movies" className="quick-section">
          <div className="icon">
            🎬
          </div>
          <div className="text">أفلام</div>
        </a>
        <a href="/series" className="quick-section">
          <div className="icon">
            📺
          </div>
          <div className="text">مسلسلات</div>
        </a>
        <a href="/shows" className="quick-section">
          <div className="icon">
            📻
          </div>
          <div className="text">تلفزيون</div>
        </a>
        <a href="/mix" className="quick-section">
          <div className="icon">
            🎭
          </div>
          <div className="text">منوعات</div>
        </a>
      </div>

      {/* تأثيرات الجسيمات */}
      <div className="particles">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;