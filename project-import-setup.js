#!/usr/bin/env node

/**
 * نظام الاستيراد الذكي للمشروع
 * يتعرف على حالة المشروع تلقائياً عند الاستيراد من GitHub
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectImportSetup {
  constructor() {
    this.projectStateFile = '.replit-project-state.json';
    this.configFile = '.replit-config.json';
    this.progressFile = '.local/state/replit/agent/progress_tracker.md';
  }

  // تحقق من وجود المشروع
  detectProject() {
    console.log('🔍 فحص المشروع...');
    
    const indicators = {
      hasPackageJson: fs.existsSync('package.json'),
      hasServerDir: fs.existsSync('server'),
      hasClientDir: fs.existsSync('client'),
      hasDatabase: fs.existsSync('server/db.ts'),
      hasReplit: fs.existsSync('replit.md'),
      hasProjectState: fs.existsSync(this.projectStateFile)
    };
    
    console.log('📊 نتائج الفحص:');
    Object.entries(indicators).forEach(([key, value]) => {
      const status = value ? '✅' : '❌';
      console.log(`  ${status} ${key}`);
    });
    
    return indicators;
  }

  // تحليل حالة المشروع
  analyzeProjectState() {
    console.log('🔬 تحليل حالة المشروع...');
    
    const analysis = {
      projectType: 'Unknown',
      developmentPhase: 'Unknown',
      completedFeatures: [],
      requiredDependencies: [],
      databaseStatus: 'Not configured',
      lastUpdate: null
    };
    
    // تحليل نوع المشروع
    if (fs.existsSync('package.json')) {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      analysis.projectType = packageJson.name || 'Yemen Flix';
      analysis.requiredDependencies = Object.keys(packageJson.dependencies || {});
    }
    
    // تحليل حالة قاعدة البيانات
    if (fs.existsSync('server/db.ts')) {
      analysis.databaseStatus = 'Configured';
    }
    
    // تحليل الميزات المكتملة من replit.md
    if (fs.existsSync('replit.md')) {
      const content = fs.readFileSync('replit.md', 'utf8');
      const lines = content.split('\n');
      
      lines.forEach(line => {
        if (line.includes('✅') || line.includes('مكتمل')) {
          analysis.completedFeatures.push(line.trim());
        }
      });
    }
    
    // تحليل آخر حالة محفوظة
    if (fs.existsSync(this.projectStateFile)) {
      const savedState = JSON.parse(fs.readFileSync(this.projectStateFile, 'utf8'));
      analysis.lastUpdate = savedState.lastUpdate;
      analysis.developmentPhase = savedState.developmentPhase;
    }
    
    console.log('📈 تحليل المشروع مكتمل');
    return analysis;
  }

  // إنشاء دليل الاستيراد
  createImportGuide() {
    const guideContent = `# دليل استيراد مشروع Yemen Flix

## نظرة عامة
هذا الدليل يساعدك على استيراد وتشغيل المشروع بسهولة في بيئة Replit.

## خطوات الاستيراد

### 1. الاستيراد من GitHub
\`\`\`bash
# في Replit، اختر "Import from GitHub"
# أدخل رابط المشروع: https://github.com/your-username/yemen-flix
\`\`\`

### 2. التشغيل التلقائي
\`\`\`bash
# سيتم تشغيل هذا الأمر تلقائياً
node project-import-setup.js
\`\`\`

### 3. تثبيت التبعيات
\`\`\`bash
npm install
\`\`\`

### 4. إعداد قاعدة البيانات
\`\`\`bash
# إنشاء قاعدة بيانات PostgreSQL في Replit
# أو استخدام Neon Database
\`\`\`

### 5. تشغيل المشروع
\`\`\`bash
npm run dev
\`\`\`

## الملفات المهمة

### ملف حالة المشروع (\`.replit-project-state.json\`)
يحتوي على:
- آخر تحديث
- المرحلة الحالية من التطوير
- الميزات المكتملة
- الخطوات التالية

### ملف التكوين (\`.replit-config.json\`)
يحتوي على:
- إعدادات المشروع
- إعدادات المزامنة التلقائية
- إعدادات التطوير

### ملف تتبع التقدم (\`.local/state/replit/agent/progress_tracker.md\`)
يحتوي على:
- قائمة مراجعة الاستيراد
- حالة كل خطوة
- تتبع التقدم

## الميزات المكتملة
- ✅ واجهة مستخدم متجاوبة
- ✅ نظام إدارة المحتوى
- ✅ قاعدة بيانات PostgreSQL
- ✅ نظام المستخدمين
- ✅ مشغل فيديو متطور

## الخطوات التالية
1. التحقق من اتصال قاعدة البيانات
2. تحديث متغيرات البيئة
3. اختبار جميع الميزات
4. بدء التطوير الجديد

## استكشاف الأخطاء

### مشكلة: لا تعمل قاعدة البيانات
**الحل**: تحقق من متغير DATABASE_URL في إعدادات البيئة

### مشكلة: فشل في تثبيت التبعيات
**الحل**: امسح مجلد node_modules وشغل npm install مرة أخرى

### مشكلة: خطأ في المنفذ
**الحل**: تأكد من أن المنفذ 5000 متاح

## الدعم
إذا واجهت أي مشكلة، راجع:
- ملف replit.md للتفاصيل التقنية
- ملف .replit-project-state.json لحالة المشروع
- سجلات الخادم في وحدة التحكم

## تحديث: ${new Date().toLocaleString('ar-EG')}
`;

    fs.writeFileSync('IMPORT_GUIDE.md', guideContent);
    console.log('✅ تم إنشاء دليل الاستيراد');
  }

  // إنشاء ملف الإعداد التلقائي
  createAutoSetupScript() {
    const setupScript = `#!/bin/bash

# سكريبت الإعداد التلقائي لمشروع Yemen Flix

echo "🚀 بدء الإعداد التلقائي..."

# تحقق من Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت"
    exit 1
fi

# تحقق من npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm غير مثبت"
    exit 1
fi

# تثبيت التبعيات
echo "📦 تثبيت التبعيات..."
npm install

# إنشاء مجلدات مطلوبة
mkdir -p .local/state/replit/agent
mkdir -p logs

# إنشاء ملف متغيرات البيئة إذا لم يكن موجوداً
if [ ! -f .env ]; then
    echo "📝 إنشاء ملف .env..."
    cp .env.example .env
fi

# تشغيل سكريبت الإعداد
echo "⚙️  تشغيل إعداد المشروع..."
node project-import-setup.js

# تشغيل المشروع
echo "🎬 تشغيل Yemen Flix..."
npm run dev

echo "✅ تم إكمال الإعداد بنجاح!"
`;

    fs.writeFileSync('auto-setup.sh', setupScript);
    
    // جعل الملف قابل للتنفيذ
    try {
      execSync('chmod +x auto-setup.sh');
    } catch (error) {
      console.log('⚠️  لم يتم تغيير صلاحيات الملف');
    }
    
    console.log('✅ تم إنشاء سكريبت الإعداد التلقائي');
  }

  // إنشاء ملف .env.example
  createEnvExample() {
    const envExample = `# إعدادات البيئة لمشروع Yemen Flix

# قاعدة البيانات
DATABASE_URL=postgresql://username:password@localhost:5432/yemen_flix

# إعدادات الخادم
NODE_ENV=development
PORT=5000

# إعدادات الأمان
JWT_SECRET=your-jwt-secret-key-here
SESSION_SECRET=your-session-secret-key-here

# إعدادات المزامنة التلقائية
GITHUB_TOKEN=your-github-token-here
GITHUB_REPO=your-username/yemen-flix

# إعدادات اختيارية
OPENAI_API_KEY=your-openai-api-key-here
STRIPE_SECRET_KEY=your-stripe-secret-key-here

# إعدادات التطوير
DEBUG=true
HOT_RELOAD=true
`;

    fs.writeFileSync('.env.example', envExample);
    console.log('✅ تم إنشاء ملف .env.example');
  }

  // إنشاء progress tracker
  createProgressTracker() {
    const progressContent = `# تتبع تقدم استيراد المشروع

## حالة الاستيراد
- [ ] 1. فحص المشروع والتعرف على الملفات
- [ ] 2. تحليل حالة التطوير السابقة
- [ ] 3. تثبيت التبعيات المطلوبة
- [ ] 4. إعداد قاعدة البيانات
- [ ] 5. تشغيل الخادم
- [ ] 6. التحقق من عمل جميع الميزات
- [ ] 7. إنشاء نظام المزامنة التلقائية
- [ ] 8. اختبار شامل للمشروع

## الميزات المكتملة
- ✅ واجهة مستخدم متجاوبة
- ✅ نظام إدارة المحتوى
- ✅ قاعدة بيانات PostgreSQL
- ✅ نظام المستخدمين والمصادقة
- ✅ مشغل فيديو متطور
- ✅ لوحة التحكم الإدارية

## الخطوات التالية
1. التحقق من اتصال قاعدة البيانات
2. تحديث البيانات والمحتوى
3. اختبار جميع الميزات
4. إضافة ميزات جديدة حسب الحاجة

## آخر تحديث: ${new Date().toLocaleString('ar-EG')}
`;

    // إنشاء المجلد إذا لم يكن موجوداً
    const dir = path.dirname(this.progressFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(this.progressFile, progressContent);
    console.log('✅ تم إنشاء ملف تتبع التقدم');
  }

  // تشغيل الإعداد الكامل
  async runSetup() {
    console.log('🎬 بدء إعداد مشروع Yemen Flix...');
    
    // فحص المشروع
    const indicators = this.detectProject();
    
    // تحليل الحالة
    const analysis = this.analyzeProjectState();
    
    // إنشاء الملفات المطلوبة
    this.createImportGuide();
    this.createAutoSetupScript();
    this.createEnvExample();
    this.createProgressTracker();
    
    // حفظ حالة المشروع
    const projectState = {
      lastUpdate: new Date().toISOString(),
      importDate: new Date().toISOString(),
      projectIndicators: indicators,
      analysis: analysis,
      setupComplete: true,
      nextSteps: [
        'تحقق من إعدادات قاعدة البيانات',
        'تحديث متغيرات البيئة',
        'اختبار جميع الميزات',
        'بدء التطوير الجديد'
      ]
    };
    
    fs.writeFileSync(this.projectStateFile, JSON.stringify(projectState, null, 2));
    
    console.log('✅ تم إكمال الإعداد بنجاح!');
    console.log('📖 راجع IMPORT_GUIDE.md للتعليمات التفصيلية');
    console.log('🚀 شغل npm run dev لبدء المشروع');
    
    return projectState;
  }
}

// تشغيل الإعداد
if (require.main === module) {
  const setup = new ProjectImportSetup();
  setup.runSetup().catch(console.error);
}

module.exports = ProjectImportSetup;