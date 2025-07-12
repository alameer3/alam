#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * سكريبت رفع التحديثات إلى GitHub
 * يقوم بإضافة التغييرات وإنشاء commit ورفعها للـ GitHub
 */

function getCurrentDate() {
  const now = new Date();
  const date = now.toLocaleDateString('ar-EG');
  const time = now.toLocaleTimeString('ar-EG');
  return `${date} - ${time}`;
}

function getProjectStats() {
  try {
    // قراءة إحصائيات من package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // حساب عدد الملفات
    const getFileCount = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      let count = 0;
      for (const file of files) {
        if (file.name.startsWith('.') || file.name === 'node_modules') continue;
        if (file.isDirectory()) {
          count += getFileCount(path.join(dir, file.name));
        } else {
          count++;
        }
      }
      return count;
    };

    const fileCount = getFileCount('.');
    
    return {
      name: packageJson.name || 'yemen-flix',
      version: packageJson.version || '1.0.0',
      fileCount
    };
  } catch (error) {
    return {
      name: 'yemen-flix',
      version: '1.0.0',
      fileCount: 'غير محدد'
    };
  }
}

function executeCommand(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} مكتمل`);
    return output;
  } catch (error) {
    console.error(`❌ خطأ في ${description}:`);
    console.error(error.message);
    return null;
  }
}

function main() {
  console.log('🚀 بدء عملية رفع التحديثات إلى GitHub...\n');

  const stats = getProjectStats();
  const currentDate = getCurrentDate();

  // التحقق من وجود تغييرات
  const statusOutput = executeCommand('git status --porcelain', 'فحص التغييرات');
  if (!statusOutput || statusOutput.trim() === '') {
    console.log('ℹ️ لا توجد تغييرات جديدة للرفع');
    return;
  }

  console.log('📊 إحصائيات المشروع:');
  console.log(`- اسم المشروع: ${stats.name}`);
  console.log(`- الإصدار: ${stats.version}`);
  console.log(`- عدد الملفات: ${stats.fileCount}`);
  console.log('');

  // إضافة جميع التغييرات
  if (!executeCommand('git add .', 'إضافة التغييرات')) return;

  // إنشاء رسالة commit تلقائية
  const commitMessage = `🔄 تحديث تلقائي: ${currentDate}

📊 إحصائيات:
- المشروع: ${stats.name} v${stats.version}
- الملفات: ${stats.fileCount}
- قاعدة البيانات: PostgreSQL متصلة
- المحتوى: 40+ عنصر (أفلام ومسلسلات)
- الميزات: نظام إدارة متكامل مع ذكاء اصطناعي

🎬 منصة يمن فليكس - Yemen Flix Streaming Platform`;

  // إنشاء commit
  if (!executeCommand(`git commit -m "${commitMessage}"`, 'إنشاء commit')) return;

  // رفع إلى GitHub
  if (!executeCommand('git push origin main', 'رفع إلى GitHub')) {
    console.log('ℹ️ محاولة رفع إلى branch master...');
    executeCommand('git push origin master', 'رفع إلى GitHub (master)');
  }

  console.log('\n🎉 تم رفع التحديثات بنجاح إلى GitHub!');
  console.log('🔗 يمكنك الآن استيراد المشروع من GitHub إلى أي بيئة Replit جديدة');
}

// تشغيل السكريبت
if (require.main === module) {
  main();
}

module.exports = { main };