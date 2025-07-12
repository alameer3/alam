// Clear cache and reload data
console.log('🗑️  تنظيف الcache...');

// Send request to clear cache
fetch('http://localhost:5000/api/admin/clear-cache', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}).then(response => {
  if (response.ok) {
    console.log('✅ تم تنظيف الcache بنجاح');
    
    // Test the stats endpoint
    return fetch('http://localhost:5000/api/content/stats?nocache=true');
  } else {
    console.error('❌ فشل في تنظيف الcache');
  }
}).then(response => response.json())
.then(data => {
  console.log('📊 إحصائيات المحتوى الجديدة:', data);
})
.catch(error => {
  console.error('❌ خطأ:', error);
});