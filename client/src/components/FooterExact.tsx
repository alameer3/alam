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
          🏠
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
          📘
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
          e.target.style.borderColor = '#red';
          e.target.style.backgroundColor = 'red';
        }} onMouseLeave={(e) => {
          e.target.style.color = '#777';
          e.target.style.borderColor = '#777';
          e.target.style.backgroundColor = 'transparent';
        }}>
          📺
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

      {/* الروابط */}
      <div className="links text-center" style={{ marginBottom: '20px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-auto">
              <a href="/dmca" style={{
                color: '#777',
                textDecoration: 'none',
                margin: '0 15px',
                fontSize: '14px',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#777'}>
                سياسة الخصوصية
              </a>
            </div>
            <div className="col-auto">
              <a href="/contactus" style={{
                color: '#777',
                textDecoration: 'none',
                margin: '0 15px',
                fontSize: '14px',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#777'}>
                اتصل بنا
              </a>
            </div>
            <div className="col-auto">
              <a href="/ad-policy" style={{
                color: '#777',
                textDecoration: 'none',
                margin: '0 15px',
                fontSize: '14px',
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
                margin: '0 15px',
                fontSize: '14px',
                transition: 'color 0.3s'
              }} onMouseEnter={(e) => e.target.style.color = '#f3951e'} 
                 onMouseLeave={(e) => e.target.style.color = '#777'}>
                الإشعارات
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* حقوق النشر */}
      <div className="copyright text-center">
        <p style={{
          color: '#777',
          fontSize: '13px',
          margin: 0,
          lineHeight: '1.5'
        }}>
          جميع الحقوق محفوظة لـ شبكة اكوام © 2025
        </p>
        <p style={{
          color: '#666',
          fontSize: '12px',
          margin: '5px 0 0 0',
          lineHeight: '1.4'
        }}>
          شمس المواقع، الموقع العربي الاول لتحميل و مشاهدة الافلام, المسلسلات, الالعاب, البرامج و التطبيقات
        </p>
      </div>
    </footer>
  );
};

export default FooterExact;