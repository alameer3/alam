// سكريبت لفحص API endpoints
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function debugAPI() {
  console.log('🔧 فحص API endpoints...\n');
  
  // 1. فحص المحتوى العام
  const allContent = await makeRequest('/api/content');
  console.log('1. المحتوى العام:', allContent.success ? `${allContent.data.content.length} عنصر من ${allContent.data.total}` : allContent.error);
  
  // 2. فحص الأفلام
  const movies = await makeRequest('/api/content/movies');
  console.log('2. الأفلام:', movies.success ? `${movies.data.content.length} فيلم من ${movies.data.total}` : movies.error);
  
  // 3. فحص المسلسلات
  const series = await makeRequest('/api/content/series');
  console.log('3. المسلسلات:', series.success ? `${series.data.content.length} مسلسل من ${series.data.total}` : series.error);
  
  // 4. فحص البرامج
  const programs = await makeRequest('/api/content/programs');
  console.log('4. البرامج:', programs.success ? `${programs.data.content.length} برنامج من ${programs.data.total}` : programs.error);
  
  // 5. فحص الألعاب
  const games = await makeRequest('/api/content/games');
  console.log('5. الألعاب:', games.success ? `${games.data.content.length} لعبة من ${games.data.total}` : games.error);
  
  // 6. فحص الإحصائيات
  const stats = await makeRequest('/api/stats');
  console.log('6. الإحصائيات:', stats.success ? `${stats.data.totalContent} محتوى إجمالي` : stats.error);
  
  // 7. فحص عينة من المحتوى
  if (allContent.success && allContent.data.content.length > 0) {
    console.log('\n📋 عينة من المحتوى:');
    allContent.data.content.slice(0, 5).forEach(item => {
      console.log(`- ${item.title} (${item.type})`);
    });
  }
}

debugAPI().catch(console.error);