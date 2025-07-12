import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function debugStats() {
  console.log('🔍 فحص إحصائيات المحتوى...');
  
  try {
    // Test direct database query
    const result = await pool.query(`
      SELECT type, COUNT(*) as count 
      FROM content 
      WHERE is_active = true 
      GROUP BY type 
      ORDER BY count DESC;
    `);
    
    console.log('📊 نتائج قاعدة البيانات المباشرة:');
    console.log(result.rows);
    
    // Test total count
    const totalResult = await pool.query(`
      SELECT COUNT(*) as total FROM content WHERE is_active = true;
    `);
    
    console.log('📈 إجمالي المحتوى:', totalResult.rows[0].total);
    
    // Test API endpoint directly
    const response = await fetch('http://localhost:5000/api/content/stats');
    const apiResult = await response.json();
    
    console.log('🔗 نتيجة API:');
    console.log(apiResult);
    
  } catch (error) {
    console.error('❌ خطأ في فحص الإحصائيات:', error);
  } finally {
    await pool.end();
  }
}

debugStats().catch(console.error);