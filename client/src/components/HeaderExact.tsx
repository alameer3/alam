import React, { useState } from 'react';
import { Link } from 'wouter';

const HeaderExact = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  return (
    <>
      {/* القائمة الجانبية */}
      <div className={`main-menu ${menuActive ? 'active' : ''}`} style={{
        position: 'fixed',
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 45,
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: '#27272c',
        width: '100%',
        top: '70px',
        borderTop: '1px solid #111114',
        opacity: menuActive ? 1 : 0,
        visibility: menuActive ? 'visible' : 'hidden',
        transition: '0.5s',
        height: 'calc(100% - 70px)'
      }}>
        <div className="d-flex flex-column" style={{ height: '100%' }}>
          <div className="my-auto w-100">
            <div className="menu d-flex flex-wrap justify-content-center">
              <Link href="/movies" className="item" style={{
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 20px',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#fff'}>
                <div className="icn ml-3" style={{ fontSize: '48px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4H18Z"/>
                  </svg>
                </div>
                <div className="text" style={{ minWidth: '70px', fontSize: '22px', textAlign: 'right' }}>أفلام</div>
              </Link>
              
              <Link href="/series" className="item" style={{
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 20px',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#fff'}>
                <div className="icn ml-3" style={{ fontSize: '48px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"/>
                  </svg>
                </div>
                <div className="text" style={{ minWidth: '70px', fontSize: '22px', textAlign: 'right' }}>مسلسلات</div>
              </Link>
              
              <Link href="/shows" className="item" style={{
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 20px',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#fff'}>
                <div className="icn ml-3" style={{ fontSize: '48px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20,6H22V8H20V6M20,10H22V12H20V10M20,14H22V16H20V14M8,6H18V8H8V6M8,10H18V12H8V10M8,14H18V16H8V14M4,8H6V6H4V8M4,12H6V10H4V12M4,16H6V14H4V16Z"/>
                  </svg>
                </div>
                <div className="text" style={{ minWidth: '70px', fontSize: '22px', textAlign: 'right' }}>تلفزيون</div>
              </Link>
              
              <Link href="/mix" className="item" style={{
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 20px',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#fff'}>
                <div className="icn ml-3" style={{ fontSize: '48px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.5,4A5.5,5.5 0 0,0 2,9.5C2,10.82 2.39,12.04 3.07,13.06L7.5,8.64L11.93,13.07C12.61,12.05 13,10.83 13,9.5A5.5,5.5 0 0,0 7.5,4M18.5,9C17.18,9 15.96,9.39 14.94,10.07L19.36,14.5L14.93,18.93C15.95,19.61 17.17,20 18.5,20A5.5,5.5 0 0,0 24,14.5A5.5,5.5 0 0,0 18.5,9Z"/>
                  </svg>
                </div>
                <div className="text" style={{ minWidth: '70px', fontSize: '22px', textAlign: 'right' }}>منوعات</div>
              </Link>
            </div>
          </div>
          
          {/* أيقونات التواصل الاجتماعي */}
          <nav className="social d-flex justify-content-center" style={{ padding: '20px 0' }}>
            <a href="#" className="home mx-2" style={{
              width: '40px',
              height: '40px',
              color: '#777',
              fontSize: '12px',
              position: 'relative',
              borderRadius: '50%',
              border: '1px solid #777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'all 0.3s'
            }}>🏠</a>
            
            <a href="#" className="facebook mx-2" style={{
              width: '40px',
              height: '40px',
              color: '#777',
              fontSize: '12px',
              position: 'relative',
              borderRadius: '50%',
              border: '1px solid #777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'all 0.3s'
            }}>📘</a>
            
            <a href="#" className="youtube mx-2" style={{
              width: '40px',
              height: '40px',
              color: '#777',
              fontSize: '12px',
              position: 'relative',
              borderRadius: '50%',
              border: '1px solid #777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'all 0.3s'
            }}>📺</a>
            
            <a href="#" className="email mx-2" style={{
              width: '40px',
              height: '40px',
              color: '#777',
              fontSize: '12px',
              position: 'relative',
              borderRadius: '50%',
              border: '1px solid #777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'all 0.3s'
            }}>📧</a>
          </nav>
        </div>
      </div>

      {/* شريط البحث المنفصل */}
      <div className={`search-box px-xl-5`} style={{
        width: '100%',
        height: '70px',
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 52,
        opacity: searchActive ? 1 : 0,
        visibility: searchActive ? 'visible' : 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(22,22,25,.2)',
        transition: '0.5s'
      }}>
        <div className="container search-container">
          <form action="/search" className="search-form" method="get" style={{ minHeight: '70px' }}>
            <label htmlFor="searchBoxInput" className="d-flex align-items-center h-100 w-100 m-0">
              <button type="submit" className="px-3 ml-2" style={{ 
                fontSize: '30px', 
                border: 'none', 
                background: 'transparent',
                color: '#f3951e'
              }}>🔍</button>
              <input 
                type="search" 
                name="q" 
                id="searchBoxInput" 
                placeholder="ابحث هنا"
                style={{
                  width: '100%',
                  height: '70px',
                  border: 'none',
                  fontSize: '24px',
                  backgroundColor: 'transparent',
                  color: '#161619',
                  outline: 'none'
                }}
              />
            </label>
          </form>
          <div className="search-toggle" onClick={() => setSearchActive(false)} style={{
            fontSize: '24px',
            position: 'absolute',
            top: '50%',
            left: '20px',
            zIndex: 5,
            cursor: 'pointer',
            transform: 'translateY(-50%)',
            color: '#f3951e'
          }}>←</div>
        </div>
      </div>

      {/* الهيدر الرئيسي */}
      <div className="main-header-top"></div>
      <header className="main-header" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: 'rgba(22, 22, 25, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #333',
        height: '70px'
      }}>
        <div className="container">
          <div className="row align-items-center" style={{ height: '70px' }}>
            {/* الشعار */}
            <div className="col-auto">
              <h2 className="main-logo m-0">
                <Link href="/" className="d-inline-flex" style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#fff',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="35" viewBox="0 0 87 80" fill="white" style={{ marginLeft: '10px' }}>
                      <path fillRule="evenodd" 
                            d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"/>
                    </svg>
                    اكوام
                  </div>
                </Link>
              </h2>
            </div>
            
            {/* زر القائمة */}
            <div className="col-auto menu-toggle-container">
              <button 
                className="menu-toggle d-flex align-items-center"
                onClick={() => setMenuActive(!menuActive)}
                style={{
                  color: menuActive ? '#f3951e' : '#fff',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span className="icn" style={{
                  width: '20px',
                  height: '15px',
                  position: 'relative',
                  marginLeft: '10px'
                }}>
                  <span style={{
                    display: 'block',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'currentColor',
                    marginBottom: '4px',
                    transition: 'all 0.3s'
                  }}></span>
                  <span style={{
                    display: 'block',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'currentColor',
                    marginBottom: '4px',
                    transition: 'all 0.3s'
                  }}></span>
                  <span style={{
                    display: 'block',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'currentColor',
                    transition: 'all 0.3s'
                  }}></span>
                </span>
                <div className="text" style={{ fontSize: '18px' }}>الأقسام</div>
              </button>
            </div>
            
            <div className="ml-auto"></div>
            
            {/* شريط البحث في الهيدر - مطابق للأصلي */}
            <div className="col-md-5 col-lg-6 search-container d-none d-md-block">
              <div className="search-form" style={{ position: 'relative' }}>
                <form action="/search" method="get">
                  <input 
                    type="text" 
                    id="headerSearchInput" 
                    name="q"
                    style={{
                      width: '100%',
                      height: '40px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      color: '#fff',
                      padding: '0 45px 0 15px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                  />
                  <label 
                    htmlFor="headerSearchInput"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '15px',
                      transform: 'translateY(-50%)',
                      color: '#ccc',
                      pointerEvents: 'none',
                      transition: 'all 0.3s',
                      fontSize: '13px'
                    }}
                  >
                    ابحث عن فيلم او مسلسل ...
                  </label>
                  <button type="submit" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#f3951e',
                    fontSize: '16px',
                    cursor: 'pointer',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>🔍</button>
                </form>
              </div>
            </div>
            
            {/* زر البحث للجوال */}
            <div className="col-auto d-md-none">
              <button 
                onClick={() => setSearchActive(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                🔍
              </button>
            </div>
            
            {/* زر "أضيف حديثاً" الأصلي */}
            <div className="col-auto recently-container d-none d-lg-block">
              <Link href="/recent" className="btn-recently" style={{
                backgroundColor: 'transparent',
                color: '#fff',
                padding: '8px 15px',
                borderRadius: '20px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3951e';
                e.target.style.borderColor = '#f3951e';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '8px' }}>
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                </svg>
                <span>أضيف حديثا</span>
              </Link>
            </div>
            
            {/* ملف المستخدم الأصلي */}
            <div className="col-auto user-profile-container">
              <div className="user-panel">
                <Link href="/login" className="user-toggle d-block" style={{
                  fontSize: '20px',
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} onMouseEnter={(e) => {
                  e.target.style.color = '#f3951e';
                  e.target.style.borderColor = '#f3951e';
                }} onMouseLeave={(e) => {
                  e.target.style.color = '#fff';
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* مساحة للهيدر الثابت */}
      <div className="main-header-height" style={{ height: '70px' }}></div>
    </>
  );
};

export default HeaderExact;