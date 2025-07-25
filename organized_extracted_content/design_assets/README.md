# ملفات التصميم والأصول

## نظرة عامة
هذا المجلد يحتوي على جميع ملفات التصميم المستخرجة من الموقع الأصلي ak.sv

## محتويات المجلد

### 1. ملفات CSS
- **المجلد**: `ak_sv_site_extracted/style/assets/css/`
- **الملفات الرئيسية**:
  - `bootstrap.min.css` - إطار العمل الأساسي
  - `style.css` - ملف التصميم الرئيسي
  - `responsive.css` - أنماط الاستجابة للأجهزة
  - `rtl.css` - دعم اللغة العربية والكتابة من اليمين لليسار

### 2. ملفات JavaScript
- **المجلد**: `ak_sv_site_extracted/style/assets/js/`
- **الوظائف الرئيسية**:
  - التفاعلات الأساسية
  - نظام البحث التفاعلي
  - قوائم التنقل المنسدلة
  - تأثيرات الانتقال والحركة

### 3. الخطوط
- **المجلد**: `ak_sv_site_extracted/style/assets/fonts/`
- **الخطوط المستخدمة**:
  - خطوط عربية مخصصة
  - خطوط الأيقونات (Font Icons)
  - دعم كامل للكتابة العربية

### 4. الصور والأيقونات
- **أيقونات الموقع**: favicon.ico وأحجام مختلفة
- **شعار الموقع**: متوفر بعدة تنسيقات
- **صور الخلفية**: للهيدر والأقسام المختلفة
- **أيقونات الأقسام**: أفلام، مسلسلات، تلفزيون، منوعات

## تحليل التصميم

### نظام الألوان الأصلي
```css
/* الألوان الأساسية المستخرجة من الموقع الأصلي */
:root {
  --primary-color: #f3951e;      /* البرتقالي الأساسي */
  --secondary-color: #27272c;    /* الرمادي الداكن */
  --background-color: #161619;   /* خلفية الموقع الداكنة */
  --text-light: #ffffff;         /* النص الأبيض */
  --text-muted: #999999;         /* النص الثانوي */
  --border-color: #333333;       /* لون الحدود */
}
```

### الخطوط المستخدمة
- **الخط الأساسي**: Cairo, sans-serif
- **خط العناوين**: Cairo Bold
- **خط الأيقونات**: FontAwesome + خط مخصص للأيقونات العربية

### نظام الشبكة
- **عرض الحاوي الأقصى**: 1200px
- **نقاط التحول**: 576px, 768px, 992px, 1200px
- **نظام الأعمدة**: Bootstrap Grid System
- **التباعد**: margin/padding بوحدات 8px

## استخدام الملفات

### للمطورين
1. **نسخ ملفات CSS**: استخدمها كأساس للتصميم
2. **تحليل الكود**: ادرس طريقة تنظيم الأنماط
3. **استخراج الألوان**: احصل على قيم الألوان الدقيقة
4. **فهم التفاعلات**: ادرس ملفات JavaScript

### للمصممين
1. **دليل الألوان**: استخدم الألوان المستخرجة
2. **الخطوط**: طبق نفس الخطوط والأحجام
3. **التخطيط**: اتبع نظام الشبكة المستخدم
4. **التأثيرات**: طبق تأثيرات الانتقال والحركة

### لتطوير الواجهة
1. **مكونات جاهزة**: استخدم العناصر الموجودة
2. **أنماط متسقة**: حافظ على اتساق التصميم
3. **الاستجابة**: طبق الأنماط المتجاوبة
4. **إمكانية الوصول**: اتبع معايير الوصول المطبقة

## ملاحظات خاصة

### دعم اللغة العربية
- جميع الأنماط تدعم الكتابة من اليمين لليسار
- الخطوط محسنة للنصوص العربية
- التخطيط مصمم للمحتوى العربي

### الأداء والتحسين
- ملفات CSS مضغوطة ومحسنة
- تحميل تدريجي للصور
- استخدام أمثل للخطوط والأيقونات

### التوافق
- متوافق مع جميع المتصفحات الحديثة
- دعم كامل للأجهزة المحمولة
- تحسين للسرعة والأداء

## الاستخدام في المشروع الحالي

### مطابقة التصميم الأصلي
1. استخدم هذه الملفات كمرجع دقيق
2. احرص على مطابقة الألوان والخطوط
3. طبق نفس تأثيرات التفاعل والحركة
4. حافظ على نفس هيكل التخطيط

### التكامل مع التقنيات الحديثة
1. حول ملفات CSS إلى Tailwind Classes
2. استخدم المتغيرات في CSS Custom Properties
3. طبق التأثيرات باستخدام Framer Motion
4. دمج مع نظام المكونات في React