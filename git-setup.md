# إعداد GitHub Integration

## خطوات ربط المشروع بـ GitHub

### 1. إنشاء Repository جديد في GitHub
1. اذهب إلى GitHub.com وسجل دخول
2. اضغط على "New Repository"
3. اسم المشروع: `yemen-flix-streaming-platform`
4. أضف وصف: `Yemen-themed streaming platform with Arabic content support`
5. اختر Public أو Private حسب رغبتك
6. لا تضيف README (المشروع يحتوي عليه بالفعل)

### 2. ربط المشروع بـ GitHub (تنفذ في Terminal)
```bash
# إعداد Git (إذا لم يكن معداً)
git init
git add .
git commit -m "Initial commit: Yemen Flix streaming platform"

# ربط بـ GitHub Repository
git remote add origin https://github.com/YOUR_USERNAME/yemen-flix-streaming-platform.git
git branch -M main
git push -u origin main
```

### 3. رفع التحديثات الجديدة
```bash
# إضافة جميع التغييرات
git add .

# إنشاء commit مع رسالة وصفية
git commit -m "Update: Added PostgreSQL database and 40 content items"

# رفع للـ GitHub
git push origin main
```

## ملفات مهمة للحفظ

### Environment Variables (احفظ في مكان آمن)
- `DATABASE_URL`: رابط قاعدة البيانات PostgreSQL
- `OPENAI_API_KEY`: مفتاح OpenAI للذكاء الاصطناعي (إذا كان موجود)

### إعدادات قاعدة البيانات
- استخدم نفس إعدادات DATABASE_URL عند استيراد المشروع
- شغل `npm run db:push` لإنشاء الجداول
- شغل `node add-basic-data.js` لإضافة البيانات الأولية
- شغل `node add-more-content.cjs` لإضافة المحتوى الإضافي

## سكريبت التحديث التلقائي
سيتم إنشاء سكريبت `update-github.js` لرفع التحديثات تلقائياً.