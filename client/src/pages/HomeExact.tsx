import React from 'react';
import { Link } from 'wouter';

const HomeExact = () => {
  return (
    <div className="page-home">
      {/* خلفية سينمائية */}
      <style>
        {`
          body {
            background: linear-gradient(to bottom, rgba(0, 0, 0, .55), #000 100%), url('https://images.unsplash.com/photo-1489599408795-b2b7f3a7e4e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80') !important;
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
          }
          
          .page-home .home-site-btn-container {
            width: 258px;
            height: 258px;
            border-radius: 50%;
            position: relative;
            margin-right: auto;
            margin-left: auto;
            margin-bottom: 40px;
          }
          
          .page-home .home-site-btn-container::before, .page-home .home-site-btn-container::after {
            position: absolute;
            top: 50%;
            right: 50%;
            z-index: 2;
            content: "";
            border-radius: 50%;
            border: 2px solid #fff;
            transform: translate(50%, -50%);
            transition: all 500ms;
          }
          
          .page-home .home-site-btn-container::before {
            width: 100%;
            height: 100%;
          }
          
          .page-home .home-site-btn-container::after {
            width: 0;
            height: 0;
            border-color: transparent;
          }
          
          .page-home .home-site-btn-container .link {
            border-radius: 50%;
          }
          
          .page-home .home-site-btn-container:hover::before {
            width: 0;
            height: 0;
            border-color: transparent;
          }
          
          .page-home .home-site-btn-container:hover::after {
            width: 100%;
            height: 100%;
            border-color: #26baee;
          }
          
          .page-home .home-site-btn-container:hover .home-site-btn {
            border-color: #0d82ab;
            background-position: center 100%;
          }
          
          .page-home .home-site-btn-container:hover .home-site-btn .logo,
          .page-home .home-site-btn-container:hover .home-site-btn .text {
            opacity: 0;
          }
          
          .page-home .home-site-btn-container:hover .home-site-btn .logo {
            top: -100%;
          }
          
          .page-home .home-site-btn-container:hover .home-site-btn .text {
            bottom: 100%;
          }
          
          .page-home .home-site-btn {
            width: 230px;
            height: 230px;
            overflow: hidden;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            right: 50%;
            border: 5px solid #fff;
            background-color: #161619;
            transform: translate(50%, -50%);
            background-position: center -43%;
            background-repeat: no-repeat;
            background-size: 120%;
            background-image: url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
            transition: all 500ms;
          }
          
          .page-home .home-site-btn .logo {
            position: absolute;
            top: 50px;
            right: 50%;
            z-index: 2;
            transform: translate(50%);
            transition: all 500ms;
          }
          
          .page-home .home-site-btn .text {
            width: 100%;
            text-align: center;
            position: absolute;
            bottom: 55px;
            right: 50%;
            z-index: 2;
            transform: translate(50%);
            transition: all 500ms;
          }
          
          .main-categories-list .item {
            background-color: rgba(39, 39, 44, 0.8);
            border: 1px solid #4a4a51;
            border-radius: 3px;
            transition: all 0.3s;
          }
          
          .main-categories-list .item:hover {
            border-color: #f3951e;
            background-color: rgba(243, 149, 30, 0.1);
          }
          
          .main-categories-list .item .icn {
            font-size: 32px;
            margin-bottom: 10px;
          }
        `}
      </style>

      {/* الصفحة الرئيسية بالضبط كما في الموقع الأصلي */}
      <div className="container py-5 my-5">
        {/* الزر الدائري الرئيسي */}
        <div className="home-site-btn-container mt-5">
          <h1>
            <Link href="/" className="link" style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              zIndex: 10
            }}></Link>
          </h1>
          <div className="home-site-btn">
            <span className="logo">
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="87px" height="80px">
                <path fillRule="evenodd" fill="rgb(255, 255, 255)" 
                      d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
              </svg>
            </span>
            <span className="text font-size-20 font-weight-medium text-white">الصفحة الرئيسية</span>
          </div>
        </div>

        {/* صندوق البحث والأقسام */}
        <div className="widget-2 widget mb-4">
          <div className="widget-body row">
            <div className="col-lg-8 mx-auto">
              {/* نموذج البحث */}
              <form className="form d-flex no-gutters mb-20" action="/search" method="get">
                <div className="col pl-12">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="widget2SearchInput" 
                    name="q"
                    style={{
                      backgroundColor: '#27272c',
                      border: '1px solid #4a4a51',
                      color: '#fff',
                      padding: '15px 20px',
                      borderRadius: '5px 0 0 5px',
                      fontSize: '18px'
                    }}
                  />
                  <label htmlFor="widget2SearchInput" className="m-0" style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    color: '#999',
                    pointerEvents: 'none',
                    transition: 'all 0.3s'
                  }}>
                    <span className="label">ابحث عن فيلم او مسلسل او لعبة او برنامج ...</span>
                  </label>
                </div>
                <div className="col-auto">
                  <button 
                    type="submit" 
                    className="btn"
                    style={{
                      backgroundColor: '#f3951e',
                      color: '#fff',
                      border: 'none',
                      padding: '15px 30px',
                      borderRadius: '0 5px 5px 0',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  >
                    بحث
                  </button>
                </div>
              </form>

              {/* قائمة الأقسام الرئيسية */}
              <div className="main-categories-list">
                <div className="row">
                  <div className="col-lg col-4">
                    <Link href="/movies" className="item d-block text-center text-white py-3 h-100">
                      <div className="icn">
                        <i className="icon-video-camera" style={{ fontSize: '32px' }}>🎬</i>
                      </div>
                      <div className="font-size-16">أفلام</div>
                    </Link>
                  </div>
                  <div className="col-lg col-4">
                    <Link href="/series" className="item d-block text-center text-white py-3 h-100">
                      <div className="icn">
                        <i className="icon-monitor" style={{ fontSize: '32px' }}>📺</i>
                      </div>
                      <div className="font-size-16">مسلسلات</div>
                    </Link>
                  </div>
                  <div className="col-lg col-4">
                    <Link href="/shows" className="item d-block text-center text-white py-3 h-100">
                      <div className="icn">
                        <i className="icon-tv" style={{ fontSize: '32px' }}>📻</i>
                      </div>
                      <div className="font-size-16">تلفزيون</div>
                    </Link>
                  </div>
                  <div className="col-lg col-4">
                    <Link href="/mix" className="item d-block text-center text-white py-3 h-100">
                      <div className="icn">
                        <i className="icon-mix" style={{ fontSize: '32px' }}>🎮</i>
                      </div>
                      <div className="font-size-16">منوعات</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="main-categories-list-end"></div>
      </div>
    </div>
  );
};

export default HomeExact;