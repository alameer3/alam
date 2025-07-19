import { Route, Switch } from 'wouter';
import './index.css';

// الصفحات الأصلية المطابقة للموقع الأصلي
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Shows from './pages/Shows';
import Mix from './pages/Mix';
import ContentView from './pages/ContentView';

// ملفات الخطوط والأيقونات
import IconFont from './components/IconFont';

function App() {
  return (
    <div className="App" dir="rtl">
      <IconFont />
      <Switch>
        {/* الصفحة الرئيسية - التصميم الأصلي المطابق */}
        <Route path="/" component={Home} />
        <Route path="/ones" component={Home} />
        
        {/* صفحات الأقسام الأصلية */}
        <Route path="/movies" component={Movies} />
        <Route path="/series" component={Series} />
        <Route path="/shows" component={Shows} />
        <Route path="/mix" component={Mix} />
        
        {/* صفحات عرض المحتوى */}
        <Route path="/movie/:id" component={ContentView} />
        <Route path="/series/:id" component={ContentView} />
        <Route path="/show/:id" component={ContentView} />
        <Route path="/mix/:id" component={ContentView} />
        

        
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