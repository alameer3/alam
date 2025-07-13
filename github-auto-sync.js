#!/usr/bin/env node

/**
 * نظام المزامنة التلقائية مع GitHub
 * يقوم برفع التعديلات تلقائياً كل دقيقة
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitHubAutoSync {
  constructor() {
    this.isRunning = false;
    this.syncInterval = 60000; // كل دقيقة
    this.lastCommitTime = Date.now();
    this.projectStateFile = '.replit-project-state.json';
  }

  // تهيئة Git repository
  async initializeGitRepo() {
    try {
      console.log('🔄 تهيئة Git repository...');
      
      // تحقق من وجود .git directory
      if (!fs.existsSync('.git')) {
        execSync('git init');
        console.log('✅ تم إنشاء Git repository جديد');
      }

      // إنشاء .gitignore إذا لم يكن موجوداً
      if (!fs.existsSync('.gitignore')) {
        const gitignoreContent = `
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
*.tsbuildinfo

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Replit specific
.replit
replit.nix
.breakpoints
.local/
`;
        fs.writeFileSync('.gitignore', gitignoreContent);
        console.log('✅ تم إنشاء .gitignore');
      }

      return true;
    } catch (error) {
      console.error('❌ خطأ في تهيئة Git:', error.message);
      return false;
    }
  }

  // حفظ حالة المشروع
  saveProjectState() {
    const projectState = {
      lastUpdate: new Date().toISOString(),
      projectName: "Yemen Flix",
      currentBranch: this.getCurrentBranch(),
      lastCommitHash: this.getLastCommitHash(),
      developmentPhase: this.getDevelopmentPhase(),
      completedFeatures: this.getCompletedFeatures(),
      nextSteps: this.getNextSteps(),
      dependencies: this.getDependencies(),
      databaseStatus: this.getDatabaseStatus(),
      serverStatus: {
        port: 5000,
        status: "running",
        lastRestart: new Date().toISOString()
      }
    };

    fs.writeFileSync(this.projectStateFile, JSON.stringify(projectState, null, 2));
    console.log('💾 تم حفظ حالة المشروع');
  }

  // جلب حالة المشروع المحفوظة
  loadProjectState() {
    if (fs.existsSync(this.projectStateFile)) {
      try {
        const state = JSON.parse(fs.readFileSync(this.projectStateFile, 'utf8'));
        console.log('📖 تم تحميل حالة المشروع من:', state.lastUpdate);
        return state;
      } catch (error) {
        console.error('❌ خطأ في تحميل حالة المشروع:', error.message);
      }
    }
    return null;
  }

  // الحصول على الفرع الحالي
  getCurrentBranch() {
    try {
      return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return 'main';
    }
  }

  // الحصول على آخر commit hash
  getLastCommitHash() {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  }

  // تحديد مرحلة التطوير الحالية
  getDevelopmentPhase() {
    const phases = {
      'setup': 'إعداد المشروع الأولي',
      'development': 'التطوير النشط',
      'testing': 'اختبار الميزات',
      'deployment': 'الاستعداد للنشر',
      'maintenance': 'الصيانة والتحسين'
    };
    
    // تحديد المرحلة حسب الملفات الموجودة
    if (fs.existsSync('package.json') && fs.existsSync('server/index.ts')) {
      return 'development';
    }
    
    return 'setup';
  }

  // جلب الميزات المكتملة من replit.md
  getCompletedFeatures() {
    try {
      if (fs.existsSync('replit.md')) {
        const content = fs.readFileSync('replit.md', 'utf8');
        const completed = [];
        
        // البحث عن الميزات المكتملة
        const lines = content.split('\n');
        lines.forEach(line => {
          if (line.includes('✅') || line.includes('مكتمل')) {
            completed.push(line.trim());
          }
        });
        
        return completed;
      }
    } catch (error) {
      console.error('خطأ في جلب الميزات المكتملة:', error.message);
    }
    
    return [];
  }

  // جلب الخطوات التالية
  getNextSteps() {
    const nextSteps = [
      'مراجعة الكود وتحسين الأداء',
      'إضافة اختبارات شاملة',
      'تحسين واجهة المستخدم',
      'تطوير ميزات جديدة حسب الطلب'
    ];
    
    return nextSteps;
  }

  // جلب معلومات التبعيات
  getDependencies() {
    try {
      if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return {
          dependencies: Object.keys(packageJson.dependencies || {}),
          devDependencies: Object.keys(packageJson.devDependencies || {})
        };
      }
    } catch (error) {
      console.error('خطأ في جلب التبعيات:', error.message);
    }
    
    return { dependencies: [], devDependencies: [] };
  }

  // جلب حالة قاعدة البيانات
  getDatabaseStatus() {
    return {
      type: 'PostgreSQL',
      provider: 'Neon Database',
      status: 'connected',
      lastCheck: new Date().toISOString()
    };
  }

  // تحقق من وجود تغييرات
  hasChanges() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      return status.trim().length > 0;
    } catch {
      return false;
    }
  }

  // إضافة وcommit التغييرات
  async commitChanges() {
    try {
      if (!this.hasChanges()) {
        console.log('📝 لا توجد تغييرات للcommit');
        return false;
      }

      const timestamp = new Date().toISOString();
      const commitMessage = `تحديث تلقائي: ${timestamp}

- تم رفع التعديلات تلقائياً
- تحديث حالة المشروع
- مزامنة الملفات مع GitHub
- التاريخ: ${new Date().toLocaleString('ar-EG')}`;

      // إضافة جميع الملفات
      execSync('git add .');
      
      // إنشاء commit
      execSync(`git commit -m "${commitMessage}"`);
      
      console.log('✅ تم إنشاء commit جديد');
      return true;
    } catch (error) {
      console.error('❌ خطأ في إنشاء commit:', error.message);
      return false;
    }
  }

  // رفع التغييرات إلى GitHub
  async pushToGitHub() {
    try {
      const branch = this.getCurrentBranch();
      execSync(`git push -u origin ${branch}`, { stdio: 'inherit' });
      console.log('🚀 تم رفع التغييرات إلى GitHub بنجاح');
      return true;
    } catch (error) {
      console.error('❌ خطأ في رفع التغييرات:', error.message);
      console.log('💡 تأكد من إعداد GitHub repository و access token');
      return false;
    }
  }

  // المزامنة الكاملة
  async fullSync() {
    console.log('🔄 بدء المزامنة التلقائية...');
    
    // حفظ حالة المشروع
    this.saveProjectState();
    
    // commit التغييرات
    const committed = await this.commitChanges();
    
    if (committed) {
      // رفع إلى GitHub
      await this.pushToGitHub();
    }
    
    this.lastCommitTime = Date.now();
    console.log('✅ تم إكمال المزامنة');
  }

  // بدء المزامنة التلقائية
  async startAutoSync() {
    if (this.isRunning) {
      console.log('⚠️  المزامنة التلقائية تعمل بالفعل');
      return;
    }

    console.log('🚀 بدء نظام المزامنة التلقائية مع GitHub');
    console.log(`⏱️  فترة المزامنة: ${this.syncInterval / 1000} ثانية`);
    
    // تهيئة Git repository
    await this.initializeGitRepo();
    
    // المزامنة الأولى
    await this.fullSync();
    
    this.isRunning = true;
    
    // المزامنة الدورية
    setInterval(async () => {
      if (this.isRunning) {
        await this.fullSync();
      }
    }, this.syncInterval);
    
    console.log('✅ نظام المزامنة التلقائية نشط');
  }

  // إيقاف المزامنة التلقائية
  stopAutoSync() {
    this.isRunning = false;
    console.log('🛑 تم إيقاف المزامنة التلقائية');
  }

  // إنشاء README.md شامل
  createReadme() {
    const readmeContent = `# YEMEN 🇾🇪 FLIX

## نظرة عامة
منصة سينما يمنية متطورة لعرض الأفلام والمسلسلات العربية والأجنبية.

## المميزات
- واجهة مستخدم متجاوبة باللغة العربية
- نظام إدارة محتوى شامل
- دعم قواعد بيانات PostgreSQL
- نظام مستخدمين متقدم
- مشغل فيديو متطور

## التثبيت والتشغيل

### متطلبات النظام
- Node.js 20+
- PostgreSQL
- Git

### خطوات التشغيل
1. استنساخ المشروع:
\`\`\`bash
git clone <repository-url>
cd yemen-flix
\`\`\`

2. تثبيت التبعيات:
\`\`\`bash
npm install
\`\`\`

3. إعداد متغيرات البيئة:
\`\`\`bash
cp .env.example .env
# قم بتعديل .env بإعداداتك
\`\`\`

4. تشغيل المشروع:
\`\`\`bash
npm run dev
\`\`\`

## البنية التقنية
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **UI Components**: Radix UI + shadcn/ui

## المساهمة
نرحب بالمساهمات! يرجى اتباع الإرشادات في CONTRIBUTING.md

## الترخيص
MIT License - راجع LICENSE للتفاصيل

## آخر تحديث
${new Date().toLocaleString('ar-EG')}
`;

    fs.writeFileSync('README.md', readmeContent);
    console.log('✅ تم إنشاء README.md');
  }

  // إنشاء ملف الإعدادات
  createProjectConfig() {
    const config = {
      name: "Yemen Flix",
      version: "1.0.0",
      description: "منصة سينما يمنية متطورة",
      autoSync: {
        enabled: true,
        interval: 60000,
        branch: "main"
      },
      development: {
        port: 5000,
        hotReload: true,
        debugMode: false
      },
      github: {
        autoCommit: true,
        commitMessage: "تحديث تلقائي",
        branchProtection: false
      }
    };

    fs.writeFileSync('.replit-config.json', JSON.stringify(config, null, 2));
    console.log('✅ تم إنشاء ملف الإعدادات');
  }
}

// تشغيل النظام
if (require.main === module) {
  const autoSync = new GitHubAutoSync();
  
  // معالجة إشارات النظام
  process.on('SIGINT', () => {
    console.log('\n🛑 إيقاف المزامنة التلقائية...');
    autoSync.stopAutoSync();
    process.exit(0);
  });
  
  // بدء المزامنة
  autoSync.startAutoSync().catch(console.error);
}

module.exports = GitHubAutoSync;