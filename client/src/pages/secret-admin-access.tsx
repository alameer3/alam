import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Crown, Lock, Eye, EyeOff } from "lucide-react";

export default function SecretAdminAccess() {
  const [, setLocation] = useLocation();
  const [clickCount, setClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [showCodeField, setShowCodeField] = useState(false);

  useEffect(() => {
    if (clickCount >= 5) {
      setShowSecret(true);
    }
  }, [clickCount]);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
  };

  const handleSecretAccess = () => {
    if (secretCode === "CINEMA-ADMIN-2024") {
      setLocation("/unified-admin");
    } else {
      window.alert("كود الوصول غير صحيح!");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSecretAccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* شعار سري متطور */}
        <div className="text-center">
          {/* الشعار الرئيسي السري */}
          <div className="relative group">
            {/* دوائر متوهجة متحركة */}
            <div className="absolute inset-0 w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-2 border-red-500/30 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-2 border-2 border-orange-500/50 rounded-full animate-spin-reverse"></div>
              <div className="absolute inset-4 border-2 border-yellow-500/70 rounded-full animate-pulse"></div>
            </div>
            
            {/* الشعار المركزي */}
            <div 
              className="relative w-24 h-24 mx-auto rounded-xl overflow-hidden cursor-pointer shadow-2xl border-4 border-gradient-to-br from-red-500 to-orange-500 transform transition-all duration-700 hover:scale-110 hover:rotate-12 hover:shadow-red-500/50"
              onClick={handleLogoClick}
            >
              <img 
                src="/assets/logo_1.png" 
                alt="Yemen Flix Logo" 
                className="w-full h-full object-cover"
              />
              
              {/* تأثير الماسح الضوئي */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
              
              {/* نبضات ضوئية */}
              <div className="absolute inset-0 border-4 border-red-400/0 rounded-xl group-hover:border-red-400/100 transition-all duration-500"></div>
            </div>
            
            {/* نقاط الوصول السري */}
            <div className="absolute -top-2 -right-2 flex space-x-1">
              {[...Array(clickCount)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* النص المتطور */}
          <div className="mt-6 relative">
            <div className="relative">
              <img 
                src="/assets/logo_2.png" 
                alt="YEMEN FLIX" 
                className="h-12 mx-auto filter drop-shadow-2xl transform hover:scale-105 transition-all duration-500"
              />
              
              {/* تأثير الهولوجرام */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
            </div>
            
            {/* النص التفاعلي */}
            <div className="mt-3 relative">
              <p className="text-muted-foreground transition-all duration-500 hover:text-primary">
                منصة الأفلام والمسلسلات اليمنية
              </p>
              
              {/* مؤشر الأمان */}
              <div className="flex items-center justify-center mt-2 space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-500">نظام آمن</span>
              </div>
            </div>
          </div>
          
          {clickCount > 0 && clickCount < 5 && (
            <p className="text-xs text-muted-foreground mt-2">
              {5 - clickCount} نقرات متبقية...
            </p>
          )}
        </div>

        {showSecret && (
          <Card className="border-2 border-primary shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden">
                <img 
                  src="/assets/logo_1.png" 
                  alt="Yemen Flix Admin" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-xl">وصول إداري سري</CardTitle>
              <CardDescription>
                مرحباً بك في منطقة الوصول الخاصة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-primary">
                  <h3 className="font-semibold mb-2">معلومات الوصول الإداري:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>اسم المستخدم:</span>
                      <code className="bg-background px-2 py-1 rounded">admin</code>
                    </div>
                    <div className="flex justify-between">
                      <span>كلمة المرور:</span>
                      <code className="bg-background px-2 py-1 rounded">cinema@2024</code>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">تنبيه أمني</h3>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    هذه المعلومات سرية للغاية. يرجى عدم مشاركتها مع أي شخص آخر.
                  </p>
                </div>

                {!showCodeField ? (
                  <Button
                    onClick={() => setShowCodeField(true)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    فتح لوحة التحكم
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="password"
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="أدخل كود الوصول السري"
                        className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-center"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSecretAccess}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                      >
                        دخول
                      </Button>
                      <Button
                        onClick={() => setShowCodeField(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        إلغاء
                      </Button>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      تلميح: الكود هو CINEMA-ADMIN-2024
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-2">
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="w-full"
          >
            العودة للصفحة الرئيسية
          </Button>
          <p className="text-xs text-muted-foreground">
            {!showSecret ? "انقر على الشعار 5 مرات لفتح الوصول الإداري" : "🔐 تم تفعيل الوصول الإداري"}
          </p>
        </div>
      </div>
    </div>
  );
}