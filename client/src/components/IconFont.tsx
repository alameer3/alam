// مكون الأيقونات المخصصة لموقع أكوام
export const IconFont = () => {
  const cssContent = `
    @font-face {
      font-family: 'akoam';
      src: url('/fonts/STC-Bold.woff2') format('woff2'),
           url('/fonts/STC-Bold.woff') format('woff'),
           url('/fonts/STC-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
    }
    
    @font-face {
      font-family: 'akoam';
      src: url('/fonts/STC-Regular.woff2') format('woff2'),
           url('/fonts/STC-Regular.woff') format('woff'),
           url('/fonts/STC-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }

    /* أيقونات أكوام الأصلية */
    .icon-video-camera::before { content: "🎬"; }
    .icon-monitor::before { content: "📺"; }
    .icon-tv::before { content: "📻"; }
    .icon-mix::before { content: "🎯"; }
    .icon-home::before { content: "🏠"; }
    .icon-facebook::before { content: "📘"; }
    .icon-twitter::before { content: "🐦"; }
    .icon-youtube::before { content: "📺"; }
    .icon-app-store::before { content: "📱"; }
    .icon-email::before { content: "📧"; }
    .icon-user::before { content: "👤"; }
    
    /* تعريف الخط الأساسي */
    body {
      font-family: 'akoam', 'STC', Arial, sans-serif;
      direction: rtl;
      text-align: right;
    }
    
    /* ألوان أكوام الأصلية */
    :root {
      --akwam-primary: #f3951e;
      --akwam-dark: #161619;
      --akwam-secondary: #27272c;
      --akwam-border: #1e1e21;
    }
  `;

  return (
    <style dangerouslySetInnerHTML={{ __html: cssContent }} />
  );
};

export default IconFont;