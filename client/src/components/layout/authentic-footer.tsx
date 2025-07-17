export default function AuthenticFooter() {
  return (
    <footer className="main-footer py-5">
      <nav className="social d-flex justify-content-center">
        <a href="/ones" className="home mx-2"><i className="icon-home"></i></a>
        <a href="https://www.facebook.com/akwamnet" target="_blank" className="facebook mx-2"><i className="icon-facebook"></i></a>
        <a href="https://www.facebook.com/groups/AKOAMweb" target="_blank" className="facebook mx-2"><i className="icon-facebook"></i></a>
        <a href="https://akw.net.in/" target="_blank" className="app-store mx-2"><i className="icon-app-store"></i></a>
        <a href="https://www.youtube.com/c/AKWAMnetwork" target="_blank" className="youtube mx-2"><i className="icon-youtube"></i></a>
        <a href="/contactus" className="email mx-2"><i className="icon-email"></i></a>
      </nav>

      <nav className="links d-flex justify-content-center mt-3">
        <a href="/ones" className="mx-2">اكوام</a>
        <a href="/old" target="_blank" className="mx-2">الموقع القديم</a>
        <a href="/dmca" className="mx-2">DMCA</a>
        <a href="/ad-policy" className="mx-2">AD-P</a>
        <a href="https://ak-news.com" target="_blank" className="mx-2">اكوام نيوز</a>
        <a href="https://akw.net.co" target="_blank" className="mx-2">شبكة اكوام</a>
      </nav>

      <p className="copyright mb-0 font-size-12 text-center mt-3">
        جميع الحقوق محفوظة لـ شبكة اكوام © 2025
      </p>
    </footer>
  );
}