#!/bin/bash

# سكريبت بدء مشروع YEMEN FLIX
echo "🚀 بدء مشروع YEMEN FLIX..."

# التحقق من التبعيات
if [ ! -d "node_modules" ]; then
  echo "📦 تثبيت التبعيات..."
  npm install
fi

# إعداد قاعدة البيانات (إذا توفرت)
if [ ! -z "$DATABASE_URL" ]; then
  echo "🗄️ إعداد قاعدة البيانات..."
  npm run db:push 2>/dev/null || echo "⚠️ تحذير: لا يمكن تطبيق schema"
  node create-schema.js 2>/dev/null || echo "⚠️ تحذير: لا يمكن إضافة البيانات الأولية"
fi

# بدء التطبيق
echo "✅ بدء الخادم على المنفذ 5000..."
echo "🌐 افتح المتصفح على: http://localhost:5000"
echo "🔧 لوحة التحكم: انقر 5 مرات على الشعار"
npm run dev