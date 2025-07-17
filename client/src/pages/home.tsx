import React from 'react';
import SimpleHeader from '@/components/home/simple-header';
import SimpleNavigation from '@/components/home/simple-navigation';
import SimpleContentGrid from '@/components/home/simple-content-grid';

export default function Home() {
  return (
    <div className="min-h-screen bg-clean">
      <SimpleHeader />
      <SimpleNavigation />
      
      {/* المحتوى الرئيسي */}
      <main>
        <SimpleContentGrid 
          title="أحدث الأفلام" 
          endpoint="/api/content/movies" 
          viewAllLink="/movies"
        />
        
        <SimpleContentGrid 
          title="المسلسلات الشائعة" 
          endpoint="/api/content/series" 
          viewAllLink="/series"
        />
        
        <SimpleContentGrid 
          title="الألعاب الجديدة" 
          endpoint="/api/content/games" 
          viewAllLink="/games"
        />
        
        <SimpleContentGrid 
          title="التطبيقات المميزة" 
          endpoint="/api/content/applications" 
          viewAllLink="/applications"
        />
      </main>
      
      {/* الفوتر البسيط */}
      <footer className="bg-card-clean border-t mt-16">
        <div className="container-clean">
          <div className="py-8 text-center">
            <div className="text-xl font-bold text-primary mb-2">
              <span className="text-red-500">YEMEN</span>{' '}
              <span className="text-blue-500">FLIX</span>
            </div>
            <p className="text-muted-clean text-sm">
              منصة السينما اليمنية - جميع المحتويات متاحة مجاناً
            </p>
            <p className="text-muted-clean text-xs mt-2">
              © 2024 Yemen Flix. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}