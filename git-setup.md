# دليل إعداد Git و GitHub للمشروع

## إعداد Git Repository محلياً

### 1. تهيئة Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Yemen Flix streaming platform"
```

### 2. إعداد Remote Repository
```bash
# استبدل <repository-url> برابط المستودع الخاص بك
git remote add origin <repository-url>
git branch -M main
git push -u origin main
```

## إعداد GitHub Repository

### 1. إنشاء Repository جديد على GitHub
- اذهب إلى [GitHub](https://github.com)
- انقر على "New repository"
- اسم المستودع: `yemen-flix`
- الوصف: `منصة دفق المحتوى العربي الشاملة - Yemen Flix Streaming Platform`
- اختر Public أو Private
- لا تضع ✅ لـ "Add a README file" (لأنه موجود بالفعل)

### 2. ربط المشروع بـ GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/yemen-flix.git
git branch -M main
git push -u origin main
```

## أوامر Git الأساسية للمشروع

### إضافة وحفظ التغييرات
```bash
# إضافة جميع التغييرات
git add .

# حفظ التغييرات مع رسالة
git commit -m "وصف التغييرات"

# رفع التغييرات لـ GitHub
git push origin main
```

### فحص الحالة
```bash
# فحص حالة الملفات
git status

# رؤية التغييرات
git diff

# رؤية تاريخ التغييرات
git log --oneline
```

## سكريبت رفع التحديثات تلقائياً

يمكنك استخدام السكريبت المدمج:

```bash
node update-github.js
```

هذا السكريبت يقوم بـ:
- إضافة جميع التغييرات
- إنشاء commit مع تاريخ ووصف
- رفع التحديثات لـ GitHub
- عرض إحصائيات المشروع

## استيراد المشروع من GitHub

### 1. استنساخ المشروع
```bash
git clone https://github.com/YOUR_USERNAME/yemen-flix.git
cd yemen-flix
```

### 2. الاستئناف السريع
```bash
# استئناف سريع مع إعداد تلقائي
node quick-resume.cjs
```

### 3. تشغيل التطبيق
```bash
npm run dev
```

## إعداد البيئة بعد الاستيراد

### 1. متغيرات البيئة
إنشاء ملف `.env` مع:
```env
DATABASE_URL=postgresql://...
NODE_ENV=development
```

### 2. قاعدة البيانات
```bash
# إعداد قاعدة البيانات
node database-setup-manager.cjs setup

# تطبيق المخطط
npm run db:push
```

## نصائح للعمل مع Git

### 1. الـ Branches
```bash
# إنشاء فرع جديد
git checkout -b feature/new-feature

# التنقل بين الفروع
git checkout main
git checkout feature/new-feature

# دمج الفرع
git checkout main
git merge feature/new-feature
```

### 2. التراجع عن التغييرات
```bash
# التراجع عن تغييرات غير محفوظة
git checkout -- filename.js

# التراجع عن آخر commit
git reset --soft HEAD~1

# التراجع لـ commit معين
git reset --hard <commit-hash>
```

### 3. مزامنة مع GitHub
```bash
# جلب آخر التحديثات
git pull origin main

# رفع التغييرات
git push origin main
```

## التعامل مع المشاكل الشائعة

### 1. مشكلة merge conflicts
```bash
# حل التضارب يدوياً في الملفات
# ثم
git add .
git commit -m "Resolve merge conflicts"
```

### 2. مشكلة .gitignore
```bash
# إزالة الملفات المتتبعة خطأً
git rm -r --cached .
git add .
git commit -m "Update .gitignore"
```

### 3. مشكلة الحجم الكبير
```bash
# إزالة الملفات الكبيرة من التاريخ
git filter-branch --force --index-filter   'git rm --cached --ignore-unmatch path/to/large/file'   --prune-empty --tag-name-filter cat -- --all
```

## الملفات المهمة للمشروع

### ملفات Git
- `.gitignore` - ملفات مستثناة من Git
- `README.md` - وثائق المشروع
- `.github/workflows/` - GitHub Actions (إذا لزم الأمر)

### ملفات المشروع
- `package.json` - إعدادات npm
- `tsconfig.json` - إعدادات TypeScript
- `vite.config.ts` - إعدادات Vite
- `tailwind.config.ts` - إعدادات Tailwind
- `drizzle.config.ts` - إعدادات قاعدة البيانات

### ملفات الإدارة
- `quick-resume.cjs` - استئناف سريع
- `development-state-manager.cjs` - إدارة حالة التطوير
- `database-setup-manager.cjs` - إعداد قاعدة البيانات
- `github-integration-setup.cjs` - إعداد GitHub

---

مع هذا الدليل، يمكنك إعداد المشروع على GitHub واستيراده بسهولة في أي وقت!
