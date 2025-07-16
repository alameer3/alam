// فحص محتوى قاعدة البيانات مباشرة
const { dbManager } = require('./server/database/database-manager.js');

async function checkContent() {
  console.log('🔧 فحص محتوى قاعدة البيانات...\n');
  
  try {
    // فحص المحتوى العام
    const allContent = await dbManager.getContent();
    console.log('1. المحتوى العام:', allContent.content.length, 'عنصر');
    
    // فحص الأفلام
    const movies = await dbManager.getContent({ type: 'movie' });
    console.log('2. الأفلام:', movies.content.length, 'فيلم');
    
    // فحص المسلسلات
    const series = await dbManager.getContent({ type: 'series' });
    console.log('3. المسلسلات:', series.content.length, 'مسلسل');
    
    // فحص البرامج
    const programs = await dbManager.getContent({ type: 'program' });
    console.log('4. البرامج:', programs.content.length, 'برنامج');
    
    // فحص الألعاب
    const games = await dbManager.getContent({ type: 'game' });
    console.log('5. الألعاب:', games.content.length, 'لعبة');
    
    // فحص الأنواع الموجودة
    console.log('\n📋 أنواع المحتوى الموجودة:');
    const types = {};
    allContent.content.forEach(item => {
      types[item.type] = (types[item.type] || 0) + 1;
    });
    
    Object.entries(types).forEach(([type, count]) => {
      console.log(`- ${type}: ${count} عنصر`);
    });
    
    // عرض عينة من كل نوع
    console.log('\n📋 عينة من كل نوع:');
    Object.keys(types).forEach(type => {
      const items = allContent.content.filter(item => item.type === type).slice(0, 2);
      console.log(`\n${type}:`);
      items.forEach(item => {
        console.log(`  - ${item.title || item.title_ar} (ID: ${item.id})`);
      });
    });
    
  } catch (error) {
    console.error('خطأ:', error);
  }
}

checkContent();