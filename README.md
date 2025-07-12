# YEMEN 🇾🇪 FLIX - منصة دفق المحتوى العربي الشاملة

## نظرة عامة

منصة دفق محتوى عربي متطورة تتضمن أفلام ومسلسلات وبرامج تلفزيونية مع واجهة مستخدم حديثة ونظام إدارة متقدم.

## الميزات الرئيسية

### 🎬 إدارة المحتوى
- أفلام ومسلسلات وبرامج تلفزيونية
- فئات متنوعة (عربي، يمني، أجنبي، هندي، تركي، كوري)
- أنواع شاملة (أكشن، كوميدي، دراما، رومانسي، إثارة)
- نظام تقييمات ومراجعات

### 🎨 واجهة المستخدم
- تصميم متجاوب (موبايل، تابلت، ديسكتوب)
- 5 ثيمات مختلفة (فاتح، داكن، سينما، كلاسيكي، عصري)
- دعم كامل للغة العربية مع RTL
- مشغل فيديو متقدم

### 👥 نظام المستخدمين
- تسجيل دخول وإدارة حسابات
- قوائم مشاهدة مخصصة
- نظام مفضلة وسجل مشاهدة
- إشعارات تفاعلية

### 🔧 لوحة التحكم الإدارية
- إدارة شاملة للمحتوى
- إحصائيات وتقارير مفصلة
- نظام أمان متقدم
- مراقبة الأداء

### 🎥 محتوى متطور
- نظام مقاطع دعائية
- معلومات فريق العمل التفصيلية
- معرض صور متقدم
- تقييمات خارجية (IMDb, Rotten Tomatoes)

## التقنيات المستخدمة

### Frontend
- **React 18** مع TypeScript
- **Tailwind CSS** للتصميم
- **Radix UI** و **shadcn/ui** للمكونات
- **Wouter** للتنقل
- **TanStack Query** لإدارة الحالة

### Backend
- **Node.js** مع Express
- **PostgreSQL** مع Drizzle ORM
- **Neon Database** (serverless)
- **TypeScript** مع ES modules

### أدوات التطوير
- **Vite** للبناء والتطوير
- **ESLint** للفحص
- **Drizzle Kit** لإدارة قاعدة البيانات

## البدء السريع

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd yemen-flix
```

### 2. الاستئناف السريع
```bash
node quick-resume.cjs
```

### 3. تشغيل التطبيق
```bash
npm run dev
```

### 4. إعداد قاعدة البيانات (إذا لزم الأمر)
```bash
node database-setup-manager.cjs setup
```

## الأوامر المفيدة

### إدارة التطوير
```bash
node quick-resume.cjs                      # استئناف سريع
node development-state-manager.cjs save    # حفظ الحالة
node development-state-manager.cjs status  # عرض التقرير
node development-state-manager.cjs export  # نسخة احتياطية
```

### إدارة قاعدة البيانات
```bash
node database-setup-manager.cjs setup     # إعداد كامل
node database-setup-manager.cjs restore   # استعادة
node database-setup-manager.cjs check     # فحص الحالة
npm run db:push                            # تطبيق التغييرات
```

### التطوير
```bash
npm run dev      # تشغيل خادم التطوير
npm run build    # بناء للإنتاج
npm run start    # تشغيل الإنتاج
npm run check    # فحص TypeScript
```

## هيكل المشروع

```
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # مكونات React
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # صفحات التطبيق
│   │   └── lib/           # مكتبات مساعدة
├── server/                # Backend (Express)
│   ├── routes/           # API routes
│   ├── middleware/       # وسطاء Express
│   ├── db.ts            # إعداد قاعدة البيانات
│   ├── storage.ts       # طبقة البيانات
│   └── index.ts         # نقطة البداية
├── shared/               # مشاركة بين Frontend و Backend
│   └── schema.ts        # مخطط قاعدة البيانات
├── management/           # أدوات إدارة المشروع
│   ├── development-state-manager.cjs
│   ├── session-manager.cjs
│   ├── database-setup-manager.cjs
│   └── quick-resume.cjs
└── docs/                # توثيق المشروع
    ├── README.md
    ├── QUICKSTART.md
    └── الدليل-الشامل-للاستئناف.md
```

## متطلبات النظام

- Node.js 18+ 
- PostgreSQL database
- متصفح حديث يدعم ES2022

## المتغيرات البيئية

```env
DATABASE_URL=postgresql://...
NODE_ENV=development|production
```

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

للحصول على الدعم، يرجى فتح issue في GitHub أو التواصل مع الفريق.

## الحالة

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()

---

تم تطوير هذا المشروع بواسطة فريق Yemen Flix لخدمة المحتوى العربي الرقمي.
