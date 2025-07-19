import { Route, Switch } from 'wouter';
import './index.css';

// الصفحات الأصلية المطابقة للموقع الأصلي
import HomeAuthentic from './pages/HomeAuthentic';
import MoviesAuthentic from './pages/MoviesAuthentic';
import SeriesAuthentic from './pages/SeriesAuthentic';
import ShowsAuthentic from './pages/ShowsAuthentic';
import MixAuthentic from './pages/MixAuthentic';
import ContentViewAuthentic from './pages/ContentViewAuthentic';

// ملفات الخطوط والأيقونات
import IconFont from './components/IconFont';

function App() {
  return (
    <div className="App" dir="rtl">
      <IconFont />
      <Switch>
        {/* الصفحة الرئيسية - التصميم الأصلي المطابق */}
        <Route path="/" component={HomeAuthentic} />
        <Route path="/ones" component={HomeAuthentic} />
        
        {/* صفحات الأقسام الأصلية */}
        <Route path="/movies" component={MoviesAuthentic} />
        <Route path="/series" component={SeriesAuthentic} />
        <Route path="/shows" component={ShowsAuthentic} />
        <Route path="/mix" component={MixAuthentic} />
        
        {/* صفحات عرض المحتوى */}
        <Route path="/movie/:id" component={ContentViewAuthentic} />
        <Route path="/series/:id" component={ContentViewAuthentic} />
        <Route path="/show/:id" component={ContentViewAuthentic} />
        <Route path="/mix/:id" component={ContentViewAuthentic} />
        

        
        {/* صفحة 404 */}
        <Route component={() => (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <p className="text-xl text-gray-300 mb-8">الصفحة غير موجودة</p>
              <a href="/" className="text-orange-500 hover:text-orange-400 transition-colors">العودة للرئيسية</a>
            </div>
          </div>
        )} />
      </Switch>
    </div>
  );
}

export default App;