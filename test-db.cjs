const Database = require('better-sqlite3');
const path = require('path');

// فتح قاعدة البيانات
const db = new Database(path.join(__dirname, 'serverdata/database.db'));

console.log('🔧 فحص قاعدة البيانات...');

// فحص جميع المحتوى
const allContent = db.prepare('SELECT COUNT(*) as count FROM content').get();
console.log('📊 إجمالي المحتوى:', allContent.count);

// فحص الأفلام
const movies = db.prepare('SELECT COUNT(*) as count FROM content WHERE type = ?').get('movie');
console.log('🎬 الأفلام:', movies.count);

// فحص المسلسلات
const series = db.prepare('SELECT COUNT(*) as count FROM content WHERE type = ?').get('series');
console.log('📺 المسلسلات:', series.count);

// فحص البرامج
const programs = db.prepare('SELECT COUNT(*) as count FROM content WHERE type = ?').get('program');
console.log('📻 البرامج:', programs.count);

// فحص الألعاب
const games = db.prepare('SELECT COUNT(*) as count FROM content WHERE type = ?').get('game');
console.log('🎮 الألعاب:', games.count);

// عرض عينة من المحتوى
console.log('\n📋 عينة من المحتوى:');
const sample = db.prepare('SELECT title, type FROM content LIMIT 10').all();
sample.forEach(item => {
  console.log(`- ${item.title} (${item.type})`);
});

// فحص الأنواع الموجودة
console.log('\n🏷️ الأنواع الموجودة:');
const types = db.prepare('SELECT DISTINCT type FROM content').all();
types.forEach(type => {
  console.log(`- ${type.type}`);
});

db.close();