import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Check, X, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState<PasswordValidation | null>(null);

  const { mutate: validatePassword, isPending } = useMutation({
    mutationFn: (password: string) => 
      apiRequest('/api/security/validate-password', { 
        method: 'POST', 
        body: { password } 
      }),
    onSuccess: (data: PasswordValidation) => {
      setValidation(data);
    },
    onError: () => {
      setValidation({ valid: false, errors: ['خطأ في التحقق من كلمة المرور'] });
    }
  });

  useEffect(() => {
    if (password) {
      const timer = setTimeout(() => {
        validatePassword(password);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setValidation(null);
    }
  }, [password, validatePassword]);

  const getPasswordStrength = () => {
    if (!password) return 0;
    if (!validation) return 0;
    
    const totalChecks = 5; // 5 main criteria
    const passedChecks = totalChecks - validation.errors.length;
    return (passedChecks / totalChecks) * 100;
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 20) return { label: 'ضعيف جداً', color: 'text-red-600' };
    if (strength < 40) return { label: 'ضعيف', color: 'text-red-500' };
    if (strength < 60) return { label: 'متوسط', color: 'text-yellow-600' };
    if (strength < 80) return { label: 'قوي', color: 'text-green-600' };
    return { label: 'قوي جداً', color: 'text-green-700' };
  };

  const getProgressColor = (strength: number) => {
    if (strength < 20) return 'bg-red-500';
    if (strength < 40) return 'bg-red-400';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 80) return 'bg-green-500';
    return 'bg-green-600';
  };

  const passwordStrength = getPasswordStrength();
  const strengthInfo = getStrengthLabel(passwordStrength);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" dir="rtl">
          <Shield className="h-5 w-5 text-blue-600" />
          فحص قوة كلمة المرور
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6" dir="rtl">
        <div className="space-y-2">
          <label className="text-sm font-medium">كلمة المرور</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور لفحصها"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {password && (
          <div className="space-y-4">
            {/* مؤشر القوة */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">قوة كلمة المرور</span>
                <Badge variant="outline" className={strengthInfo.color}>
                  {strengthInfo.label}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(passwordStrength)}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {passwordStrength.toFixed(0)}% من متطلبات الأمان
              </div>
            </div>

            {/* متطلبات كلمة المرور */}
            <div className="space-y-2">
              <h4 className="font-medium">متطلبات كلمة المرور:</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {password.length >= 8 ? 
                    <Check className="h-4 w-4 text-green-600" /> : 
                    <X className="h-4 w-4 text-red-600" />
                  }
                  <span className={`text-sm ${password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                    8 أحرف على الأقل
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/[A-Z]/.test(password) ? 
                    <Check className="h-4 w-4 text-green-600" /> : 
                    <X className="h-4 w-4 text-red-600" />
                  }
                  <span className={`text-sm ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                    حرف كبير واحد على الأقل
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/[a-z]/.test(password) ? 
                    <Check className="h-4 w-4 text-green-600" /> : 
                    <X className="h-4 w-4 text-red-600" />
                  }
                  <span className={`text-sm ${/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                    حرف صغير واحد على الأقل
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/\d/.test(password) ? 
                    <Check className="h-4 w-4 text-green-600" /> : 
                    <X className="h-4 w-4 text-red-600" />
                  }
                  <span className={`text-sm ${/\d/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                    رقم واحد على الأقل
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 
                    <Check className="h-4 w-4 text-green-600" /> : 
                    <X className="h-4 w-4 text-red-600" />
                  }
                  <span className={`text-sm ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                    رمز خاص واحد على الأقل
                  </span>
                </div>
              </div>
            </div>

            {/* رسائل التحذير */}
            {validation && validation.errors.length > 0 && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-1">
                    {validation.errors.map((error, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-600" />
                        <span className="text-sm">{error}</span>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* رسالة النجاح */}
            {validation && validation.valid && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <Check className="h-4 w-4" />
                <AlertDescription>
                  ممتاز! كلمة المرور تلبي جميع متطلبات الأمان
                </AlertDescription>
              </Alert>
            )}

            {/* نصائح الأمان */}
            <div className="space-y-2">
              <h4 className="font-medium">نصائح لكلمة مرور آمنة:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• استخدم مزيج من الأحرف الكبيرة والصغيرة والأرقام والرموز</li>
                <li>• تجنب استخدام كلمات شائعة أو معلومات شخصية</li>
                <li>• لا تستخدم نفس كلمة المرور في مواقع متعددة</li>
                <li>• فكر في استخدام جملة سرية مع أحرف وأرقام</li>
                <li>• قم بتحديث كلمة المرور بانتظام</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}