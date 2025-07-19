import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

// الصفحة الرئيسية المطابقة تماماً للموقع الأصلي
import HomeExact from './pages/HomeExact';
import HeaderExact from './components/HeaderExact';
import FooterExact from './components/FooterExact';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Shows from './pages/Shows';
import Mix from './pages/Mix';
import ContentView from './pages/ContentView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App" style={{
        backgroundColor: '#161619',
        color: '#fff',
        fontFamily: 'akoam, Arial, Helvetica, sans-serif',
        direction: 'rtl',
        textAlign: 'right',
        minHeight: '100vh'
      }}>
        <HeaderExact />
        <Switch>
          {/* الصفحة الرئيسية - مطابقة تماماً للموقع الأصلي */}
          <Route path="/" component={HomeExact} />
          <Route path="/ones" component={HomeExact} />
        
          {/* صفحات الأقسام */}
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
            <div style={{
              minHeight: '100vh',
              backgroundColor: '#161619',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{
                  fontSize: '6rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  marginBottom: '1rem'
                }}>404</h1>
                <p style={{
                  fontSize: '1.25rem',
                  color: '#999',
                  marginBottom: '2rem'
                }}>الصفحة غير موجودة</p>
                <a href="/" style={{
                  color: '#f3951e',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  transition: 'color 0.3s'
                }} onMouseEnter={(e) => e.target.style.color = '#d17a0a'}
                   onMouseLeave={(e) => e.target.style.color = '#f3951e'}>
                  العودة للرئيسية
                </a>
              </div>
            </div>
          )} />
        </Switch>
        <FooterExact />
      </div>
    </QueryClientProvider>
  );
}

export default App;