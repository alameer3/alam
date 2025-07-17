export default function AkSvEnhancedFooter() {
  return (
    <footer className="main-footer py-5">
      {/* روابط وسائل التواصل الاجتماعي - مطابقة للموقع الأصلي */}
      <nav className="social d-flex justify-content-center">
        <a href="/ones" className="home mx-2"><i className="icon-home"></i></a>
        <a href="https://www.facebook.com/akwamnet" target="_blank" className="facebook mx-2"><i className="icon-facebook"></i></a>
        <a href="https://www.facebook.com/groups/AKOAMweb" target="_blank" className="facebook mx-2"><i className="icon-facebook"></i></a>
        <a href="https://akw.net.in/" target="_blank" className="app-store mx-2"><i className="icon-app-store"></i></a>
        <a href="https://www.youtube.com/c/AKWAMnetwork" target="_blank" className="youtube mx-2"><i className="icon-youtube"></i></a>
        <a href="/AKWAM-Notifications" target="_blank" className="app-store mx-2"><i className="icon-app-store"></i></a>
        <a href="/contactus" className="email mx-2"><i className="icon-email"></i></a>
      </nav>

      {/* نص حقوق الطبع والنشر */}
      <div className="text-center mt-3">
        <p className="text-white-50 font-size-14 mb-0">
          جميع الحقوق محفوظة لـ شبكة اكوام © 2025
        </p>
      </div>

      {/* روابط إضافية */}
      <div className="footer-links text-center mt-3 d-none">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="footer-nav">
                <a href="/ad-policy" className="text-white-50 mx-2 font-size-12">سياسة الإعلانات</a>
                <a href="/dmca" className="text-white-50 mx-2 font-size-12">حقوق الطبع والنشر</a>
                <a href="/contactus" className="text-white-50 mx-2 font-size-12">اتصل بنا</a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}