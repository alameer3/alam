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
          
          .main-categories-list .item .icn i {
            font-size: 28px;
            display: block;
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
            <span className="text font-size-20 font-weight-medium text-white">المكتبة الترفيهية</span>
          </div>
        </div>

        {/* صندوق البحث والأقسام */}
        <div className="widget-2 widget mb-4">
          <div className="widget-body row">
            <div className="col-lg-8 mx-auto">
              {/* نموذج البحث الأصلي */}
              <form className="form d-flex no-gutters mb-20" action="/search" method="get">
                <div className="col" style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="widget2SearchInput" 
                    name="q"
                    placeholder=""
                    style={{
                      backgroundColor: '#161619',
                      border: '1px solid #4a4a51',
                      color: '#fff',
                      padding: '15px 20px',
                      borderRadius: '5px 0 0 5px',
                      fontSize: '16px',
                      height: '50px'
                    }}
                  />
                  <label htmlFor="widget2SearchInput" className="m-0" style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    color: '#999',
                    pointerEvents: 'none',
                    transition: 'all 0.3s',
                    fontSize: '14px'
                  }}>
                    ابحث عن فيلم او مسلسل او لعبة او برنامج ...
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
                      padding: '0 25px',
                      borderRadius: '0 5px 5px 0',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      height: '50px',
                      minWidth: '80px'
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
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4H18Z"/>
                        </svg>
                      </div>
                      <div className="font-size-16">أفلام</div>
                    </Link>
                  </div>
                  <div className="col-lg col-4">
                    <Link href="/series" className="item d-block text-center text-white py-3 h-100">
                      <div className="icn">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"/>
                        </svg>
                      </div>
                      <div className="font-size-16">مسلسلات</div>
                    </Link>
                  </div>
                  <div className="col-lg col-4">
                    <Link href="/shows" className="item d-block text-center text-white py-3 h-100">
                      <div className="icn">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20,6H22V8H20V6M20,10H22V12H20V10M20,14H22V16H20V14M8,6H18V8H8V6M8,10H18V12H8V10M8,14H18V16H8V14M4,8H6V6H4V8M4,12H6V10H4V12M4,16H6V14H4V16Z"/>
                        </svg>
                      </div>
                      <div className="font-size-16">تلفزيون</div>
                    </Link>
                  </div>
                  <div className="col-lg col-4">
                    <Link href="/mix" className="item d-block text-center text-white py-3 h-100">
                      <div className="icn">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.5,4A5.5,5.5 0 0,0 2,9.5C2,10.82 2.39,12.04 3.07,13.06L7.5,8.64L11.93,13.07C12.61,12.05 13,10.83 13,9.5A5.5,5.5 0 0,0 7.5,4M18.5,9C17.18,9 15.96,9.39 14.94,10.07L19.36,14.5L14.93,18.93C15.95,19.61 17.17,20 18.5,20A5.5,5.5 0 0,0 24,14.5A5.5,5.5 0 0,0 18.5,9Z"/>
                        </svg>
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