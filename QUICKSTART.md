# دليل البدء السريع - منصة يمن فليكس

## إعداد GitHub Integration في 5 خطوات

### 1. إنشاء Repository في GitHub
```
1. اذهب إلى github.com
2. اضغط "New repository"
3. اسم المستودع: yemen-flix-streaming-platform
4. اختر Public أو Private
5. اضغط "Create repository"
```

### 2. ربط المشروع الحالي (في Terminal)
```bash
# إعداد Git
git init
git add .
git commit -m "Initial commit: Yemen Flix Platform"

# ربط بـ GitHub (استبدل YOUR_USERNAME باسم المستخدم)
git remote add origin https://github.com/YOUR_USERNAME/yemen-flix-streaming-platform.git
git branch -M main
git push -u origin main
```

### 3. رفع التحديثات تلقائياً
```bash
# استخدم السكريپت الجاهز
node update-github.js
```

### 4. استيراد المشروع في Replit جديد
```
1. في Replit.com اضغط "Create Repl"
2. اختر "Import from GitHub"
3. الصق رابط مشروعك: https://github.com/YOUR_USERNAME/yemen-flix-streaming-platform
4. اختر "Node.js" template
5. اضغط "Import"
```

### 5. إعداد قاعدة البيانات في Replit الجديد
```bash
# إنشاء قاعدة بيانات PostgreSQL جديدة في Replit
# Tools → Database → PostgreSQL

# تطبيق الجداول والبيانات
npm run db:push
node add-basic-data.js
node add-more-content.cjs

# تشغيل التطبيق
npm run dev
```

## أوامر مفيدة

### رفع التحديثات
```bash
node update-github.js                    # رفع تلقائي مع تفاصيل
git add . && git commit -m "Update" && git push   # رفع سريع
```

### إعداد قاعدة البيانات
```bash
npm run db:push           # إنشاء الجداول
node add-basic-data.js    # البيانات الأولية
node add-more-content.cjs # المحتوى الإضافي
```

### تشغيل التطبيق
```bash
npm run dev     # تطوير (منفذ 5000)
npm run build   # بناء الإنتاج
npm start       # تشغيل الإنتاج
```

## متغيرات البيئة المطلوبة

في Replit، اذهب إلى "Secrets" وأضف:
```
DATABASE_URL = postgresql://connection_string_from_neon
OPENAI_API_KEY = sk-... (اختياري للذكاء الاصطناعي)
```

## التحقق من نجاح الإعداد

المشروع يعمل بنجاح إذا رأيت:
- ✅ خادم يعمل على منفذ 5000
- ✅ قاعدة بيانات متصلة (health check)
- ✅ 40+ عنصر محتوى محمل
- ✅ واجهة المستخدم تظهر بدون أخطاء

## استكشاف الأخطاء

### مشكلة قاعدة البيانات
```bash
# تحقق من الاتصال
node test-db-connection.js

# إعادة إنشاء الجداول
npm run db:push
```

### مشكلة المحتوى المفقود
```bash
# إعادة إضافة البيانات
node add-basic-data.js
node add-more-content.cjs
```

### مشكلة Git
```bash
# إعداد Git من جديد
rm -rf .git
git init
git add .
git commit -m "Fresh start"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

---
**نصيحة**: احفظ رابط DATABASE_URL في مكان آمن لاستخدامه عند الاستيراد!