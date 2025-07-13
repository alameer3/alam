#!/bin/bash

# سكريبت إدارة GitHub Integration
# يوفر جميع أوامر المزامنة والإعداد

show_help() {
    echo "🎬 Yemen Flix - GitHub Integration Scripts"
    echo ""
    echo "الاستخدام: ./github-scripts.sh [command]"
    echo ""
    echo "الأوامر المتاحة:"
    echo "  setup       - إعداد المشروع للمرة الأولى"
    echo "  import      - استيراد وتحليل المشروع"
    echo "  sync        - مزامنة واحدة مع GitHub"
    echo "  sync-start  - بدء المزامنة التلقائية"
    echo "  sync-stop   - إيقاف المزامنة التلقائية"
    echo "  status      - عرض حالة المشروع"
    echo "  help        - عرض هذه المساعدة"
    echo ""
    echo "أمثلة:"
    echo "  ./github-scripts.sh setup"
    echo "  ./github-scripts.sh sync-start"
    echo "  npm run dev"
}

setup() {
    echo "🚀 بدء إعداد المشروع..."
    node quick-start.js
}

import() {
    echo "📥 استيراد وتحليل المشروع..."
    node project-import-setup.js
}

sync() {
    echo "🔄 مزامنة واحدة مع GitHub..."
    node -e "
        const GitHubAutoSync = require('./github-auto-sync.js');
        const sync = new GitHubAutoSync();
        sync.fullSync().then(() => {
            console.log('✅ تم إكمال المزامنة');
            process.exit(0);
        }).catch((err) => {
            console.error('❌ خطأ في المزامنة:', err);
            process.exit(1);
        });
    "
}

sync_start() {
    echo "▶️  بدء المزامنة التلقائية..."
    
    # تحقق من وجود عملية سابقة
    if pgrep -f "github-auto-sync.js" > /dev/null; then
        echo "⚠️  المزامنة التلقائية تعمل بالفعل"
        return
    fi
    
    # بدء المزامنة في الخلفية
    nohup node github-auto-sync.js > logs/github-sync.log 2>&1 &
    echo "✅ تم بدء المزامنة التلقائية"
    echo "📝 يمكنك مراجعة السجلات في: logs/github-sync.log"
}

sync_stop() {
    echo "⏹️  إيقاف المزامنة التلقائية..."
    
    # قتل العملية
    pkill -f "github-auto-sync.js"
    
    if [ $? -eq 0 ]; then
        echo "✅ تم إيقاف المزامنة التلقائية"
    else
        echo "⚠️  لم يتم العثور على عملية المزامنة"
    fi
}

status() {
    echo "📊 حالة المشروع:"
    echo ""
    
    # تحقق من وجود الملفات الأساسية
    if [ -f ".replit-project-state.json" ]; then
        echo "✅ ملف حالة المشروع موجود"
        echo "📅 آخر تحديث: $(node -e "console.log(JSON.parse(require('fs').readFileSync('.replit-project-state.json', 'utf8')).lastUpdate)")"
    else
        echo "❌ ملف حالة المشروع غير موجود"
    fi
    
    # تحقق من Node.js
    if command -v node &> /dev/null; then
        echo "✅ Node.js $(node --version)"
    else
        echo "❌ Node.js غير مثبت"
    fi
    
    # تحقق من Git
    if command -v git &> /dev/null; then
        echo "✅ Git $(git --version)"
        if [ -d ".git" ]; then
            echo "📁 Git repository: $(git rev-parse --abbrev-ref HEAD)"
        fi
    else
        echo "❌ Git غير مثبت"
    fi
    
    # تحقق من المزامنة التلقائية
    if pgrep -f "github-auto-sync.js" > /dev/null; then
        echo "🔄 المزامنة التلقائية: نشطة"
    else
        echo "⏸️  المزامنة التلقائية: متوقفة"
    fi
    
    # تحقق من الخادم
    if pgrep -f "server/index.ts" > /dev/null; then
        echo "🚀 الخادم: يعمل على المنفذ 5000"
    else
        echo "⏸️  الخادم: متوقف"
    fi
}

# معالجة الأوامر
case "${1:-help}" in
    setup)
        setup
        ;;
    import)
        import
        ;;
    sync)
        sync
        ;;
    sync-start)
        sync_start
        ;;
    sync-stop)
        sync_stop
        ;;
    status)
        status
        ;;
    help|*)
        show_help
        ;;
esac