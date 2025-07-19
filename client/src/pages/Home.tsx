import { useState } from 'react';
import { Link } from 'wouter';
import '../styles/home-authentic.css';
import '../styles/animations.css';

export default function Home() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="min-h-screen relative page-home" style={{ backgroundColor: '#161619' }}>
      
      {/* الخلفية السينمائية الأصلية مطابقة للصورة */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(22, 22, 25, 0.55), rgba(0, 0, 0, 0.8) 100%), url('/serverdata/images/home-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 min-h-screen">
        
        {/* هيدر أصلي محسن */}
        <header className="main-header">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <h2 className="main-logo m-0">
                  <Link href="/ones" className="inline-flex">
                    <img src="/client/public/logo-white.svg" className="img-fluid" alt="اكوام" style={{ maxHeight: '40px' }} />
                  </Link>
                </h2>
                <a href="#" className="menu-toggle flex items-center text-white transition">
                  <span className="text font-size-18 mr-3">الأقسام</span>
                </a>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="search-form hidden md:block">
                  <input 
                    type="text" 
                    placeholder="ابحث عن فيلم او مسلسل ..."
                    className="form-control"
                  />
                </div>
                <Link href="/recent" className="btn-recently">
                  <span>أضيف حديثا</span>
                </Link>
                <Link href="/login" className="text-white text-xl">
                  👤
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* المحتوى المركزي */}
        <div className="container mx-auto px-4 py-16">
          
          {/* الشعار الدائري الأصلي مطابق تماماً للموقع الأصلي */}
          <div className="home-site-btn-container mt-5">
            <Link href="/ones" className="link" style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: '100%', 
              height: '100%', 
              zIndex: 10,
              borderRadius: '50%' 
            }}></Link>
            <div 
              className="home-site-btn"
              style={{
                backgroundImage: `url('/serverdata/images/home-bg.webp')`,
                transition: 'background-position 5s'
              }}
            >
              <span className="logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="87px" height="80px">
                  <path 
                    fillRule="evenodd" 
                    fill="rgb(255, 255, 255)"
                    d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"
                  />
                </svg>
              </span>
              <span className="text font-size-20 font-weight-medium text-white">
                الصفحة الرئيسية
              </span>
            </div>
          </div>

          {/* شريط البحث الأصلي المتقدم مطابق تماماً */}
          <div className="widget-2 widget mb-4">
            <div className="widget-body row">
              <div className="col-lg-8 mx-auto">
                <form className="form d-flex no-gutters mb-20" method="get">
                  <div className="col pl-12">
                    <input 
                      type="text" 
                      className="form-control" 
                      id="widget2SearchInput"
                      name="q"
                      placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج ..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <label htmlFor="widget2SearchInput" className="m-0">
                      <span className="label"></span>
                    </label>
                    <div className="label-text d-none">
                      <p>ابحث عن فيلم او مسلسل او لعبة او برنامج ...</p>
                      <p>^200 مثال: الجزيرة</p>
                      <p>^400 مثال آخر: اسم مؤقت</p>
                      <p>^600 مثال: FIFA</p>
                      <p>^800 ابحث هنا في اكوام باسم الفيلم او المسلسل او اي لعبة او برنامج ترغب به</p>
                    </div>
                  </div>
                  <div className="col-auto">
                    <button type="submit" className="btn btn-orange">بحث</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* الأقسام الأربعة الأصلية مطابقة تماماً للموقع الأصلي */}
          <div className="main-categories-list">
            <div className="row">
              {/* أفلام */}
              <div className="col-lg col-4">
                <Link href="/movies" className="item d-block text-center text-white py-3 h-100">
                  <div className="icn">
                    <i className="icon-video-camera">🎬</i>
                  </div>
                  <div className="font-size-16">أفلام</div>
                </Link>
              </div>

              {/* مسلسلات */}
              <div className="col-lg col-4">
                <Link href="/series" className="item d-block text-center text-white py-3 h-100">
                  <div className="icn">
                    <i className="icon-monitor">📺</i>
                  </div>
                  <div className="font-size-16">مسلسلات</div>
                </Link>
              </div>

              {/* تلفزيون */}
              <div className="col-lg col-4">
                <Link href="/shows" className="item d-block text-center text-white py-3 h-100">
                  <div className="icn">
                    <i className="icon-tv">📡</i>
                  </div>
                  <div className="font-size-16">تلفزيون</div>
                </Link>
              </div>

              {/* منوعات */}
              <div className="col-lg col-4">
                <Link href="/mix" className="item d-block text-center text-white py-3 h-100">
                  <div className="icn">
                    <i className="icon-mix">🎮</i>
                  </div>
                  <div className="font-size-16">منوعات</div>
                </Link>
              </div>
            </div>
          </div>
          <div className="main-categories-list-end"></div>
        </div>
        
        {/* التذييل الأصلي */}
        <footer className="main-footer">
          
          {/* أيقونات التواصل الاجتماعي الأصلية */}
          <nav className="social flex justify-center mb-6">
            <a href="#" className="home transition">🏠</a>
            <a href="#" className="facebook transition">📘</a>
            <a href="#" className="facebook transition">📘</a>
            <a href="#" className="transition">📱</a>
            <a href="#" className="youtube transition">🎬</a>
            <a href="#" className="transition">📱</a>
            <a href="#" className="transition">✉️</a>
          </nav>

          {/* روابط التذييل الأصلية */}
          <div className="links flex justify-center flex-wrap mb-4">
            <a href="#" className="transition">أكوام</a>
            <a href="#" className="transition">اتصل بنا</a>
            <a href="#" className="transition">DMCA</a>
            <a href="#" className="transition">API</a>
            <a href="#" className="transition">حقوق الطبع</a>
            <a href="#" className="transition">سياسة الخصوصية</a>
          </div>

          {/* نص حقوق الطبع الأصلي */}
          <div className="text-center text-gray-500 text-sm">
            جميع الحقوق محفوظة لـ شبكة اكوام © 2025
          </div>
        </footer>
      </div>
    </div>
  );
}