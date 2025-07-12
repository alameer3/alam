#!/usr/bin/env node
/**
 * نظام إدارة الجلسات - مشروع YEMEN 🇾🇪 FLIX
 * يحفظ ويستأنف التطويرات تلقائياً
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SessionManager {
  constructor() {
    this.sessionFile = '.session-state.json';
    this.backupDir = '.sessions-backup';
    this.init();
  }

  init() {
    // إنشاء مجلد النسخ الاحتياطية
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir);
    }
  }

  // بدء جلسة جديدة
  startSession() {
    const sessionData = {
      sessionId: Date.now(),
      startTime: new Date().toISOString(),
      projectName: 'YEMEN 🇾🇪 FLIX',
      version: '2.0.0',
      databaseConnected: false,
      activeFeatures: [],
      filesModified: [],
      newFiles: [],
      lastActivity: new Date().toISOString(),
      status: 'active'
    };

    this.saveSession(sessionData);
    console.log('🚀 تم بدء جلسة تطوير جديدة');
    return sessionData;
  }

  // حفظ حالة الجلسة
  saveSession(sessionData) {
    try {
      sessionData.lastActivity = new Date().toISOString();
      fs.writeFileSync(this.sessionFile, JSON.stringify(sessionData, null, 2));
      
      // إنشاء نسخة احتياطية
      const backupFile = path.join(this.backupDir, `session-${sessionData.sessionId}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(sessionData, null, 2));
      
      return true;
    } catch (error) {
      console.error('❌ خطأ في حفظ الجلسة:', error.message);
      return false;
    }
  }

  // استئناف آخر جلسة
  resumeSession() {
    try {
      if (fs.existsSync(this.sessionFile)) {
        const sessionData = JSON.parse(fs.readFileSync(this.sessionFile, 'utf8'));
        console.log('✅ تم استئناف الجلسة السابقة');
        console.log(`📅 بدأت في: ${new Date(sessionData.startTime).toLocaleString('ar-EG')}`);
        console.log(`⏰ آخر نشاط: ${new Date(sessionData.lastActivity).toLocaleString('ar-EG')}`);
        return sessionData;
      }
    } catch (error) {
      console.error('❌ خطأ في استئناف الجلسة:', error.message);
    }
    
    return this.startSession();
  }

  // تسجيل نشاط في الجلسة
  logActivity(activity, details = {}) {
    const sessionData = this.resumeSession();
    
    if (!sessionData.activities) {
      sessionData.activities = [];
    }
    
    sessionData.activities.push({
      timestamp: new Date().toISOString(),
      activity,
      details
    });
    
    this.saveSession(sessionData);
  }

  // إنهاء الجلسة
  endSession() {
    try {
      if (fs.existsSync(this.sessionFile)) {
        const sessionData = JSON.parse(fs.readFileSync(this.sessionFile, 'utf8'));
        sessionData.endTime = new Date().toISOString();
        sessionData.status = 'completed';
        
        // حفظ النسخة النهائية
        const finalBackup = path.join(this.backupDir, `session-final-${sessionData.sessionId}.json`);
        fs.writeFileSync(finalBackup, JSON.stringify(sessionData, null, 2));
        
        console.log('🏁 تم إنهاء الجلسة بنجاح');
        return sessionData;
      }
    } catch (error) {
      console.error('❌ خطأ في إنهاء الجلسة:', error.message);
    }
  }
}

module.exports = SessionManager;