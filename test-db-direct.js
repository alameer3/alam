import { db } from './server/db.js';
import { content } from './shared/schema.js';
import { eq, sql } from 'drizzle-orm';

async function testDatabaseDirect() {
  console.log('🔍 اختبار قاعدة البيانات مباشرة...');
  
  try {
    // Test direct database access like in DatabaseStorage
    const stats = await db.select({
      type: content.type,
      count: sql`count(*)`
    }).from(content)
      .where(eq(content.isActive, true))
      .groupBy(content.type);

    console.log('📊 النتائج من db.select:');
    console.log(stats);
    
    const result = { movies: 0, series: 0, tv: 0, misc: 0 };
    stats.forEach(stat => {
      console.log(`Type: ${stat.type}, Count: ${stat.count}`);
      if (stat.type === 'movie') result.movies = stat.count;
      else if (stat.type === 'series') result.series = stat.count;
      else if (stat.type === 'tv') result.tv = stat.count;
      else if (stat.type === 'misc') result.misc = stat.count;
    });

    console.log('📈 النتيجة النهائية:', result);
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
  }
}

testDatabaseDirect().catch(console.error);