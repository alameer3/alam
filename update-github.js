#!/usr/bin/env node
/**
 * سكريبت رفع التحديثات إلى GitHub - محسن
 * يقوم بإضافة التغييرات وإنشاء commit ورفعها للـ GitHub
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getCurrentDate() {
  const now = new Date();
  return now.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getProjectStats() {
  const stats = {
    files: 0,
    lines: 0,
    jsFiles: 0,
    tsFiles: 0,
    components: 0
  };

  function countFiles(dir) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          countFiles(filePath);
        } else if (stat.isFile()) {
          stats.files++;
          
          if (file.endsWith('.js')) stats.jsFiles++;
          if (file.endsWith('.ts') || file.endsWith('.tsx')) stats.tsFiles++;
          if (file.includes('component') || file.includes('Component')) stats.components++;
          
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            stats.lines += content.split('\n').length;
          } catch (e) {
            // تجاهل الملفات الثنائية
          }
        }
      });
    } catch (e) {
      // تجاهل الأخطاء
    }
  }

  countFiles('.');
  return stats;
}

function executeCommand(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} مكتمل`);
    return result;
  } catch (error) {
    console.error(`❌ خطأ في ${description}: ${error.message}`);
    return null;
  }
}

function main() {
  console.log('🚀 بدء رفع التحديثات إلى GitHub - YEMEN 🇾🇪 FLIX');
  console.log('=' .repeat(60));

  // فحص وجود git
  const gitStatus = executeCommand('git status --porcelain', 'فحص حالة Git');
  if (gitStatus === null) {
    console.error('❌ خطأ: المجلد الحالي ليس Git repository');
    console.log('💡 تشغيل: git init لتهيئة Git repository');
    return;
  }

  // حفظ حالة التطوير
  executeCommand('node development-state-manager.cjs save', 'حفظ حالة التطوير');

  // إضافة جميع التغييرات
  executeCommand('git add .', 'إضافة جميع التغييرات');

  // التحقق من وجود تغييرات
  const changes = executeCommand('git diff --cached --name-only', 'فحص التغييرات');
  if (!changes || changes.trim() === '') {
    console.log('ℹ️ لا توجد تغييرات جديدة للرفع');
    return;
  }

  // عرض الملفات المُغيّرة
  console.log('\n📁 الملفات المُغيّرة:');
  changes.split('\n').filter(f => f.trim()).forEach(file => {
    console.log(`   • ${file}`);
  });

  // إنشاء رسالة commit
  const currentDate = getCurrentDate();
  const stats = getProjectStats();
  
  const commitMessage = `تحديث المشروع - ${currentDate}

📊 إحصائيات المشروع:
• إجمالي الملفات: ${stats.files}
• إجمالي الأسطر: ${stats.lines.toLocaleString()}
• ملفات JavaScript: ${stats.jsFiles}
• ملفات TypeScript: ${stats.tsFiles}
• المكونات: ${stats.components}

🔧 التحسينات:
• تحديث نظام إدارة الحالة
• تحسين واجهة المستخدم
• إضافة ميزات جديدة
• إصلاح مشاكل وتحسينات

📝 الحالة: نشط ومُحدث
🏷️ المرحلة: تطوير مستمر`;

  // إنشاء commit
  const commitResult = executeCommand(
    `git commit -m "${commitMessage}"`,
    'إنشاء commit'
  );

  if (commitResult === null) {
    console.error('❌ فشل في إنشاء commit');
    return;
  }

  // رفع التحديثات
  const pushResult = executeCommand('git push origin main', 'رفع التحديثات إلى GitHub');
  
  if (pushResult === null) {
    console.error('❌ فشل في رفع التحديثات');
    console.log('💡 تأكد من:');
    console.log('   • وجود اتصال بالإنترنت');
    console.log('   • صحة رابط GitHub repository');
    console.log('   • صلاحيات الوصول لـ repository');
    return;
  }

  // عرض النتيجة
  console.log('\n' + '=' .repeat(60));
  console.log('✅ تم رفع التحديثات بنجاح!');
  console.log(`📅 التاريخ: ${currentDate}`);
  console.log(`📊 الملفات المُحدثة: ${changes.split('\n').filter(f => f.trim()).length}`);
  console.log(`💻 إجمالي الأسطر: ${stats.lines.toLocaleString()}`);
  console.log('🔗 يمكنك الآن رؤية التحديثات على GitHub');
  console.log('=' .repeat(60));
}

// تشغيل السكريبت
main();
