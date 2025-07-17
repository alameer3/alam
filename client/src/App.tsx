import React from 'react';
import { Route, Switch } from 'wouter';
import './index.css';

// الصفحة الرئيسية الوحيدة المطلوبة
import OnesPage from './pages/ones';

function App() {
  return (
    <div className="App" dir="rtl">
      <Switch>
        <Route path="/" component={OnesPage} />
        <Route path="/ones" component={OnesPage} />
        <Route component={() => (
          <div className="container py-5 text-center">
            <h1 className="display-1">404</h1>
            <p className="fs-4">الصفحة غير موجودة</p>
            <a href="/" className="btn btn-primary">العودة للرئيسية</a>
          </div>
        )} />
      </Switch>
    </div>
  );
}

export default App;