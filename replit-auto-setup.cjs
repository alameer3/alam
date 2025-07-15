#!/usr/bin/env node
/**
 * نظام التعريف التلقائي لـ Replit
 * يتعرف على ملفات قاعدة البيانات ويُعدها تلقائياً عند بدء الجلسة
 */

const fs = require('fs');
const path = require('path');

class ReplitAutoSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.serverdbPath = path.join(this.projectRoot, 'serverdb');
    this.databasePath = path.join(this.serverdbPath, 'database.json');
    this.imagesPath = path.join(this.serverdbPath, 'images');
    this.setupComplete = false;
  }

  log(message) {
    console.log(`🔧 [Replit Auto-Setup] ${message}`);
  }

  error(message) {
    console.error(`❌ [Replit Auto-Setup] ${message}`);
  }

  success(message) {
    console.log(`✅ [Replit Auto-Setup] ${message}`);
  }

  /**
   * فحص وإنشاء مجلد serverdb
   */
  async setupServerDBFolder() {
    if (!fs.existsSync(this.serverdbPath)) {
      this.log('إنشاء مجلد serverdb...');
      fs.mkdirSync(this.serverdbPath, { recursive: true });
    }

    if (!fs.existsSync(this.imagesPath)) {
      this.log('إنشاء مجلد serverdb/images...');
      fs.mkdirSync(this.imagesPath, { recursive: true });
    }

    return true;
  }

  /**
   * فحص وجود ملف قاعدة البيانات
   */
  async checkDatabaseFile() {
    if (fs.existsSync(this.databasePath)) {
      this.success('تم العثور على ملف قاعدة البيانات database.json');
      
      // التحقق من صحة البيانات
      try {
        const data = JSON.parse(fs.readFileSync(this.databasePath, 'utf8'));
        if (data.users && data.categories && data.genres && data.content) {
          this.success(`قاعدة البيانات محملة بنجاح:
            - المستخدمون: ${data.users.length}
            - الفئات: ${data.categories.length}
            - الأنواع: ${data.genres.length}
            - المحتوى: ${data.content.length}`);
          return true;
        }
      } catch (error) {
        this.error('ملف قاعدة البيانات تالف، سيتم إعادة إنشاؤه');
        return false;
      }
    }
    
    this.log('لم يتم العثور على ملف قاعدة البيانات، سيتم إنشاؤه...');
    return false;
  }

  /**
   * إنشاء ملف قاعدة البيانات الأساسي
   */
  async createDatabaseFile() {
    const defaultData = {
      users: [
        {
          id: 1,
          username: "admin",
          email: "admin@yemenflix.com",
          password: "$2b$10$abc123def456ghi789jkl",
          role: "admin",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      categories: [
        { id: 1, name: "عربي", nameEn: "Arabic", description: "أفلام ومسلسلات عربية", isActive: true },
        { id: 2, name: "يمني", nameEn: "Yemeni", description: "إنتاج يمني أصيل", isActive: true },
        { id: 3, name: "أجنبي", nameEn: "Foreign", description: "أفلام ومسلسلات أجنبية", isActive: true },
        { id: 4, name: "هندي", nameEn: "Indian", description: "أفلام بوليوود", isActive: true },
        { id: 5, name: "تركي", nameEn: "Turkish", description: "مسلسلات تركية", isActive: true },
        { id: 6, name: "كوري", nameEn: "Korean", description: "أفلام ومسلسلات كورية", isActive: true },
        { id: 7, name: "مصري", nameEn: "Egyptian", description: "أفلام ومسلسلات مصرية", isActive: true },
        { id: 8, name: "خليجي", nameEn: "Gulf", description: "إنتاج خليجي", isActive: true },
        { id: 9, name: "وثائقي", nameEn: "Documentary", description: "أفلام وثائقية", isActive: true },
        { id: 10, name: "رسوم متحركة", nameEn: "Animation", description: "أفلام رسوم متحركة", isActive: true }
      ],
      genres: [
        { id: 1, name: "أكشن", nameEn: "Action", description: "أفلام الحركة والإثارة", isActive: true },
        { id: 2, name: "كوميدي", nameEn: "Comedy", description: "أفلام كوميدية", isActive: true },
        { id: 3, name: "دراما", nameEn: "Drama", description: "أفلام درامية", isActive: true },
        { id: 4, name: "رومانسي", nameEn: "Romance", description: "أفلام رومانسية", isActive: true },
        { id: 5, name: "إثارة", nameEn: "Thriller", description: "أفلام إثارة ومغامرة", isActive: true },
        { id: 6, name: "رعب", nameEn: "Horror", description: "أفلام رعب", isActive: true },
        { id: 7, name: "جريمة", nameEn: "Crime", description: "أفلام جريمة", isActive: true },
        { id: 8, name: "عائلي", nameEn: "Family", description: "أفلام عائلية", isActive: true },
        { id: 9, name: "تاريخي", nameEn: "Historical", description: "أفلام تاريخية", isActive: true },
        { id: 10, name: "سيرة ذاتية", nameEn: "Biography", description: "أفلام سيرة ذاتية", isActive: true },
        { id: 11, name: "مغامرة", nameEn: "Adventure", description: "أفلام مغامرة", isActive: true },
        { id: 12, name: "خيال", nameEn: "Fantasy", description: "أفلام خيال", isActive: true },
        { id: 13, name: "خيال علمي", nameEn: "Sci-Fi", description: "أفلام خيال علمي", isActive: true },
        { id: 14, name: "حروب", nameEn: "War", description: "أفلام حروب", isActive: true },
        { id: 15, name: "موسيقي", nameEn: "Musical", description: "أفلام موسيقية", isActive: true }
      ],
      content: []
    };

    fs.writeFileSync(this.databasePath, JSON.stringify(defaultData, null, 2));
    this.success('تم إنشاء ملف قاعدة البيانات بنجاح');
    return true;
  }

  /**
   * فحص وجود الصور
   */
  async checkImages() {
    const requiredImages = [
      'shawshank.svg',
      'forrest-gump.svg',
      'dark-knight.svg',
      'breaking-bad.svg',
      'alrisalah.svg',
      'bab-alhara.svg',
      'squid-game.svg',
      '3-idiots.svg'
    ];

    const missingImages = requiredImages.filter(img => 
      !fs.existsSync(path.join(this.imagesPath, img))
    );

    if (missingImages.length > 0) {
      this.log(`صور مفقودة: ${missingImages.join(', ')}`);
      this.log('سيتم إنشاء صور SVG بديلة...');
      await this.createMissingImages(missingImages);
    } else {
      this.success('جميع الصور المطلوبة موجودة');
    }

    return true;
  }

  /**
   * إنشاء صور SVG بديلة للصور المفقودة
   */
  async createMissingImages(missingImages) {
    const createSVG = (title, color = '#2563eb') => `
<svg width="260" height="380" viewBox="0 0 260 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="260" height="380" fill="${color}"/>
  <rect x="10" y="10" width="240" height="360" fill="none" stroke="white" stroke-width="2"/>
  <text x="130" y="190" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">
    ${title}
  </text>
  <text x="130" y="220" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle">
    YEMEN FLIX
  </text>
</svg>`.trim();

    const imageMap = {
      'shawshank.svg': createSVG('The Shawshank Redemption', '#1e40af'),
      'forrest-gump.svg': createSVG('Forrest Gump', '#059669'),
      'dark-knight.svg': createSVG('The Dark Knight', '#1f2937'),
      'breaking-bad.svg': createSVG('Breaking Bad', '#dc2626'),
      'alrisalah.svg': createSVG('الرسالة', '#7c3aed'),
      'bab-alhara.svg': createSVG('باب الحارة', '#ea580c'),
      'squid-game.svg': createSVG('Squid Game', '#e11d48'),
      '3-idiots.svg': createSVG('3 Idiots', '#0891b2')
    };

    for (const image of missingImages) {
      if (imageMap[image]) {
        fs.writeFileSync(path.join(this.imagesPath, image), imageMap[image]);
        this.log(`تم إنشاء الصورة: ${image}`);
      }
    }

    this.success('تم إنشاء جميع الصور المفقودة');
  }

  /**
   * تحديث ملف replit.md
   */
  async updateReplitMD() {
    const replitMDPath = path.join(this.projectRoot, 'replit.md');
    const currentDate = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (fs.existsSync(replitMDPath)) {
      let content = fs.readFileSync(replitMDPath, 'utf8');
      
      // إضافة معلومات النظام التلقائي
      const autoSetupSection = `\n## نظام التعريف التلقائي لـ Replit (${currentDate})\n
- **نظام كشف قاعدة البيانات**: يتعرف تلقائياً على ملفات serverdb/database.json
- **نظام إنشاء الصور**: ينشئ صور SVG بديلة عند الحاجة
- **إعداد تلقائي**: يُعد النظام تلقائياً عند بدء الجلسة
- **مجلد serverdb**: يحتوي على قاعدة البيانات والصور المحلية
- **استقلالية تامة**: لا يحتاج لقواعد بيانات خارجية
\n`;

      // إضافة القسم الجديد بعد Overview
      content = content.replace(
        '## Overview',
        `## Overview${autoSetupSection}`
      );

      fs.writeFileSync(replitMDPath, content);
      this.success('تم تحديث ملف replit.md');
    }
  }

  /**
   * تشغيل النظام التلقائي
   */
  async run() {
    this.log('بدء النظام التلقائي لـ Replit...');
    
    try {
      // 1. إنشاء مجلدات serverdb
      await this.setupServerDBFolder();
      
      // 2. فحص وإنشاء ملف قاعدة البيانات
      const dbExists = await this.checkDatabaseFile();
      if (!dbExists) {
        await this.createDatabaseFile();
      }
      
      // 3. فحص وإنشاء الصور
      await this.checkImages();
      
      // 4. تحديث replit.md
      await this.updateReplitMD();
      
      this.setupComplete = true;
      this.success('تم إكمال الإعداد التلقائي بنجاح!');
      
      return true;
    } catch (error) {
      this.error(`خطأ في الإعداد التلقائي: ${error.message}`);
      return false;
    }
  }
}

// تشغيل النظام إذا تم استدعاؤه مباشرة
if (require.main === module) {
  const autoSetup = new ReplitAutoSetup();
  autoSetup.run().then(success => {
    if (success) {
      console.log('🎉 النظام جاهز للاستخدام!');
      process.exit(0);
    } else {
      console.error('❌ فشل في إعداد النظام');
      process.exit(1);
    }
  });
}

module.exports = ReplitAutoSetup;