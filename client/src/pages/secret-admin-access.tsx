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
        {/* Logo that reveals secret */}
        <div className="text-center">
          <div 
            className="w-24 h-24 mx-auto rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-2xl"
            onClick={handleLogoClick}
          >
            <img 
              src="/assets/logo_1.png" 
              alt="Yemen Flix Logo" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="mt-4">
            <img 
              src="/assets/logo_2.png" 
              alt="YEMEN FLIX" 
              className="h-10 mx-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
          <p className="text-muted-foreground mt-2">منصة الأفلام والمسلسلات اليمنية</p>
          
          {clickCount > 0 && clickCount < 5 && (
            <p className="text-xs text-muted-foreground mt-2">
              {5 - clickCount} نقرات متبقية...
            </p>
          )}
        </div>

        {showSecret && (
          <Card className="border-2 border-primary shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden shadow-lg">
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