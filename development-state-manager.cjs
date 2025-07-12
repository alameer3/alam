#!/usr/bin/env node
/**
 * نظام إدارة حالة التطوير - مشروع YEMEN 🇾🇪 FLIX
 * يحفظ حالة التطوير ويستأنف العمل من آخر نقطة
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('@neondatabase/serverless');

// إعداد قاعدة البيانات
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// ملف حالة التطوير
const STATE_FILE = '.development-state.json';

class DevelopmentStateManager {
  constructor() {
    this.stateFile = path.join(__dirname, STATE_FILE);
    this.currentState = this.loadState();
  }

  // تحميل حالة التطوير المحفوظة
  loadState() {
    try {
      if (fs.existsSync(this.stateFile)) {
        const data = fs.readFileSync(this.stateFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.log('⚠️ خطأ في قراءة ملف الحالة:', error.message);
    }
    
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      projectStatus: 'initialized',
      completedFeatures: [],
      databaseSetup: false,
      currentDevelopmentPhase: 'setup',
      migrations: [],
      installedPackages: [],
      configFiles: [],
      activeFeatures: {},
      bugFixes: [],
      performance: {},
      lastSession: null
    };
  }

  // حفظ الحالة الحالية
  saveState() {
    try {
      this.currentState.lastUpdated = new Date().toISOString();
      this.currentState.lastSession = new Date().toISOString();
      
      fs.writeFileSync(this.stateFile, JSON.stringify(this.currentState, null, 2));
      console.log('✅ تم حفظ حالة التطوير بنجاح');
      return true;
    } catch (error) {
      console.log('❌ خطأ في حفظ الحالة:', error.message);
      return false;
    }
  }

  // تحديث حالة الميزة
  updateFeatureStatus(featureName, status, details = {}) {
    if (!this.currentState.activeFeatures[featureName]) {
      this.currentState.activeFeatures[featureName] = {
        name: featureName,
        createdAt: new Date().toISOString(),
        status: 'started',
        progress: 0,
        files: [],
        dependencies: []
      };
    }

    this.currentState.activeFeatures[featureName] = {
      ...this.currentState.activeFeatures[featureName],
      status,
      lastUpdated: new Date().toISOString(),
      ...details
    };

    if (status === 'completed') {
      this.currentState.completedFeatures.push(featureName);
    }

    this.saveState();
  }

  // تسجيل إصلاح خطأ
  recordBugFix(bugDescription, solution, files = []) {
    const bugFix = {
      id: Date.now(),
      description: bugDescription,
      solution,
      files,
      fixedAt: new Date().toISOString()
    };

    this.currentState.bugFixes.push(bugFix);
    this.saveState();
  }

  // تسجيل migration قاعدة البيانات
  recordMigration(migrationName, description, sqlCommands = []) {
    const migration = {
      id: Date.now(),
      name: migrationName,
      description,
      sqlCommands,
      executedAt: new Date().toISOString()
    };

    this.currentState.migrations.push(migration);
    this.currentState.databaseSetup = true;
    this.saveState();
  }

  // فحص صحة قاعدة البيانات
  async checkDatabaseHealth() {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT 1 as health');
      client.release();
      
      this.currentState.databaseSetup = result.rows.length > 0;
      console.log('✅ قاعدة البيانات متصلة وتعمل بشكل صحيح');
      return true;
    } catch (error) {
      console.log('❌ مشكلة في الاتصال بقاعدة البيانات:', error.message);
      this.currentState.databaseSetup = false;
      return false;
    }
  }

  // استعادة حالة التطوير
  async restoreState() {
    console.log('🔄 استعادة حالة التطوير...');
    
    // فحص قاعدة البيانات
    const dbHealthy = await this.checkDatabaseHealth();
    
    if (!dbHealthy) {
      console.log('⚠️ يتطلب إعادة إعداد قاعدة البيانات');
      return { requiresDbSetup: true };
    }

    // فحص الملفات المطلوبة
    const missingFiles = this.checkRequiredFiles();
    
    if (missingFiles.length > 0) {
      console.log('⚠️ ملفات مفقودة:', missingFiles);
      return { missingFiles };
    }

    console.log('✅ حالة التطوير مستعادة بنجاح');
    return { 
      success: true, 
      state: this.currentState,
      lastSession: this.currentState.lastSession
    };
  }

  // فحص الملفات المطلوبة
  checkRequiredFiles() {
    const requiredFiles = [
      'shared/schema.ts',
      'server/db.ts',
      'server/storage.ts',
      'server/routes.ts',
      'server/index.ts',
      'client/src/App.tsx',
      'client/src/main.tsx'
    ];

    const missingFiles = [];
    
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(__dirname, file))) {
        missingFiles.push(file);
      }
    }

    return missingFiles;
  }

  // تصدير حالة التطوير
  exportState() {
    const exportData = {
      ...this.currentState,
      exportedAt: new Date().toISOString(),
      projectInfo: {
        name: 'YEMEN 🇾🇪 FLIX',
        version: '2.0.0',
        description: 'منصة بث سينمائي عربية متطورة'
      }
    };

    const exportFile = `development-backup-${Date.now()}.json`;
    fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));
    
    console.log(`📁 تم تصدير حالة التطوير إلى: ${exportFile}`);
    return exportFile;
  }

  // طباعة تقرير الحالة
  printStatusReport() {
    console.log('\n📊 تقرير حالة التطوير - YEMEN 🇾🇪 FLIX');
    console.log('=' .repeat(50));
    console.log(`📅 آخر تحديث: ${this.currentState.lastUpdated}`);
    console.log(`🗄️ حالة قاعدة البيانات: ${this.currentState.databaseSetup ? '✅ متصلة' : '❌ غير متصلة'}`);
    console.log(`🎯 المرحلة الحالية: ${this.currentState.currentDevelopmentPhase}`);
    console.log(`✅ الميزات المكتملة: ${this.currentState.completedFeatures.length}`);
    console.log(`🔧 الميزات النشطة: ${Object.keys(this.currentState.activeFeatures).length}`);
    console.log(`🐛 الأخطاء المصلحة: ${this.currentState.bugFixes.length}`);
    console.log(`🗃️ Migrations: ${this.currentState.migrations.length}`);
    
    if (this.currentState.lastSession) {
      console.log(`⏰ آخر جلسة: ${new Date(this.currentState.lastSession).toLocaleString('ar-EG')}`);
    }
    
    console.log('=' .repeat(50));
  }
}

// تشغيل النظام
if (require.main === module) {
  async function main() {
    const manager = new DevelopmentStateManager();
    
    const command = process.argv[2];
    
    switch (command) {
      case 'restore':
        const result = await manager.restoreState();
        console.log(JSON.stringify(result, null, 2));
        break;
        
      case 'save':
        manager.saveState();
        break;
        
      case 'export':
        manager.exportState();
        break;
        
      case 'status':
        manager.printStatusReport();
        break;
        
      case 'fix':
        const bugDescription = process.argv[3] || 'إصلاح عام';
        const solution = process.argv[4] || 'تم الإصلاح';
        manager.recordBugFix(bugDescription, solution);
        break;
        
      default:
        console.log('الأوامر المتاحة:');
        console.log('  restore - استعادة حالة التطوير');
        console.log('  save - حفظ الحالة الحالية');
        console.log('  export - تصدير نسخة احتياطية');
        console.log('  status - عرض تقرير الحالة');
        console.log('  fix "وصف الخطأ" "الحل" - تسجيل إصلاح خطأ');
        break;
    }
  }
  
  main().catch(console.error);
}

module.exports = DevelopmentStateManager;