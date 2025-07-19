import React from 'react';

const FooterExact = () => {
  return (
    <footer className="main-footer py-5" style={{
      backgroundColor: '#161619',
      borderTop: '1px solid #333'
    }}>
      {/* أيقونات التواصل الاجتماعي */}
      <nav className="social d-flex justify-content-center" style={{ marginBottom: '30px' }}>
        <a href="#" className="home mx-2" style={{
          width: '40px',
          height: '40px',
          color: '#777',
          fontSize: '16px',
          position: 'relative',
          borderRadius: '50%',
          border: '1px solid #777',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          transition: 'all 0.3s'
        }} onMouseEnter={(e) => {
          e.target.style.color = '#fff';
          e.target.style.borderColor = '#f3951e';
          e.target.style.backgroundColor = '#f3951e';
        }} onMouseLeave={(e) => {
          e.target.style.color = '#777';
          e.target.style.borderColor = '#777';
          e.target.style.backgroundColor = 'transparent';
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
          </svg>
        </a>
        
        <a href="#" className="facebook mx-2" style={{
          width: '40px',
          height: '40px',
          color: '#777',
          fontSize: '16px',
          position: 'relative',
          borderRadius: '50%',
          border: '1px solid #777',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          transition: 'all 0.3s'
        }} onMouseEnter={(e) => {
          e.target.style.color = '#fff';
          e.target.style.borderColor = '#3b5998';
          e.target.style.backgroundColor = '#3b5998';
        }} onMouseLeave={(e) => {
          e.target.style.color = '#777';
          e.target.style.borderColor = '#777';
          e.target.style.backgroundColor = 'transparent';
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        
        <a href="#" className="youtube mx-2" style={{
          width: '40px',
          height: '40px',
          color: '#777',
          fontSize: '16px',
          position: 'relative',
          borderRadius: '50%',
          border: '1px solid #777',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          transition: 'all 0.3s'
        }} onMouseEnter={(e) => {
          e.target.style.color = '#fff';
          e.target.style.borderColor = 'red';
          e.target.style.backgroundColor = 'red';
        }} onMouseLeave={(e) => {
          e.target.style.color = '#777';
          e.target.style.borderColor = '#777';
          e.target.style.backgroundColor = 'transparent';
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        
        <a href="#" className="telegram mx-2" style={{
          width: '40px',
          height: '40px',
          color: '#777',
          fontSize: '16px',
          position: 'relative',
          borderRadius: '50%',
          border: '1px solid #777',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          transition: 'all 0.3s'
        }} onMouseEnter={(e) => {
          e.target.style.color = '#fff';
          e.target.style.borderColor = '#08c';
          e.target.style.backgroundColor = '#08c';
        }} onMouseLeave={(e) => {
          e.target.style.color = '#777';
          e.target.style.borderColor = '#777';
          e.target.style.backgroundColor = 'transparent';
        }}>
          ✈️
        </a>
        
        <a href="#" className="email mx-2" style={{
          width: '40px',
          height: '40px',
          color: '#777',
          fontSize: '16px',
          position: 'relative',
          borderRadius: '50%',
          border: '1px solid #777',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          transition: 'all 0.3s'
        }} onMouseEnter={(e) => {
          e.target.style.color = '#fff';
          e.target.style.borderColor = '#f3951e';
          e.target.style.backgroundColor = '#f3951e';
        }} onMouseLeave={(e) => {
          e.target.style.color = '#777';
          e.target.style.borderColor = '#777';
          e.target.style.backgroundColor = 'transparent';
        }}>
          📧
        </a>
      </nav>

      {/* الروابط الأصلية من التذييل */}
      <div className="links text-center" style={{ marginBottom: '30px' }}>
        <div className="container">
          <div className="row justify-content-center" style={{ gap: '10px' }}>
            <div className="col-auto">
              <a href="/contactus" style={{
                color: '#777',
                textDecoration: 'none',
                margin: '0 8px',
                fontSize: '13px',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#777'}>
                اتصل بنا
              </a>
            </div>
            <div className="col-auto">
              <a href="/dmca" style={{
                color: '#777',
                textDecoration: 'none',
                margin: '0 8px',
                fontSize: '13px',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#777'}>
                DMCA
              </a>
            </div>
            <div className="col-auto">
              <a href="/ad-policy" style={{
                color: '#777',
                textDecoration: 'none',
                margin: '0 8px',
                fontSize: '13px',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#777'}>
                سياسة الإعلانات
              </a>
            </div>
            <div className="col-auto">
              <a href="/AKWAM-Notifications" style={{
                color: '#777',
                textDecoration: 'none',
                margin: '0 8px',
                fontSize: '13px',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#777'}>
                الإشعارات
              </a>
            </div>
            <div className="col-auto">
              <a href="/download" style={{
                color: '#777',
                textDecoration: 'none',
                margin: '0 8px',
                fontSize: '13px',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#777'}>
                تحميل التطبيق
              </a>
            </div>
            <div className="col-auto">
              <a href="/jobs" style={{
                color: '#777',
                textDecoration: 'none',
                margin: '0 8px',
                fontSize: '13px',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#777'}>
                الوظائف
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* حقوق النشر الأصلية */}
      <div className="copyright text-center">
        <p style={{
          color: '#666',
          fontSize: '12px',
          margin: '0 0 8px 0',
          lineHeight: '1.4'
        }}>
          جميع الحقوق محفوظة لـ شبكة اكوام © 2025
        </p>
        <p style={{
          color: '#555',
          fontSize: '11px',
          margin: 0,
          lineHeight: '1.3',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          شمس المواقع، الموقع العربي الاول لتحميل و مشاهدة الافلام, المسلسلات, الالعاب, البرامج و التطبيقات, التلفزيون, المسرحيات, المصارعة, الرياضة, تحميل و مشاهدة مباشرة
        </p>
      </div>
    </footer>
  );
};

export default FooterExact;