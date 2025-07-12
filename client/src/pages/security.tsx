import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, Settings, AlertTriangle, Users, Activity } from 'lucide-react';
import SecurityDashboard from '@/components/security/security-dashboard';
import PasswordStrengthChecker from '@/components/security/password-strength-checker';
import { Link } from 'wouter';

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const securityFeatures = [
    {
      icon: Shield,
      title: 'حماية متقدمة',
      description: 'نظام حماية شامل ضد التهديدات الأمنية المختلفة',
      status: 'active'
    },
    {
      icon: Lock,
      title: 'تشفير البيانات',
      description: 'تشفير جميع البيانات الحساسة باستخدام أحدث معايير التشفير',
      status: 'active'
    },
    {
      icon: Eye,
      title: 'مراقبة الأنشطة',
      description: 'مراقبة مستمرة لجميع الأنشطة المشبوهة والتحركات غير المعتادة',
      status: 'active'
    },
    {
      icon: Settings,
      title: 'إعدادات مخصصة',
      description: 'إعدادات أمان قابلة للتخصيص حسب احتياجاتك',
      status: 'active'
    },
    {
      icon: AlertTriangle,
      title: 'تنبيهات فورية',
      description: 'تنبيهات فورية لأي نشاط مشبوه أو محاولة اختراق',
      status: 'active'
    },
    {
      icon: Users,
      title: 'إدارة المستخدمين',
      description: 'إدارة شاملة للمستخدمين وصلاحياتهم الأمنية',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8" dir="rtl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Shield className="h-10 w-10 text-blue-600" />
            نظام الأمان والحماية
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            نظام أمان متقدم وشامل لحماية منصة اليمن فليكس من جميع التهديدات الأمنية
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              نشط
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              محدث
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              آمن
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
            ← العودة للصفحة الرئيسية
          </Link>
        </div>

        {/* Security Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                  <Badge 
                    variant={feature.status === 'active' ? 'default' : 'secondary'}
                    className={feature.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {feature.status === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <h3 className="font-semibold text-lg mb-2" dir="rtl">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm" dir="rtl">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              كلمة المرور
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              المراقبة
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="password" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4" dir="rtl">إدارة كلمات المرور</h2>
                <p className="text-gray-600 dark:text-gray-300" dir="rtl">
                  أدوات متقدمة لإدارة وفحص قوة كلمات المرور
                </p>
              </div>
              <PasswordStrengthChecker />
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" dir="rtl">
                  <Eye className="h-5 w-5" />
                  نظام المراقبة والتتبع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2" dir="rtl">نظام المراقبة النشط</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6" dir="rtl">
                    نظام مراقبة متقدم يعمل على مدار الساعة لحماية المنصة
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100" dir="rtl">
                        مراقبة الدخول
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300" dir="rtl">
                        تتبع جميع محاولات الدخول
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-medium text-green-900 dark:text-green-100" dir="rtl">
                        مراقبة الأنشطة
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300" dir="rtl">
                        تتبع أنشطة المستخدمين
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h4 className="font-medium text-orange-900 dark:text-orange-100" dir="rtl">
                        كشف التهديدات
                      </h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300" dir="rtl">
                        اكتشاف التهديدات تلقائياً
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" dir="rtl">
                  <Settings className="h-5 w-5" />
                  إعدادات الأمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg" dir="rtl">إعدادات التشفير</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm" dir="rtl">تشفير البيانات</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            مُفعل
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm" dir="rtl">تشفير الاتصالات</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            مُفعل
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm" dir="rtl">تشفير كلمات المرور</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            مُفعل
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg" dir="rtl">إعدادات المراقبة</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm" dir="rtl">مراقبة تسجيل الدخول</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            مُفعل
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm" dir="rtl">مراقبة الأنشطة</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            مُفعل
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm" dir="rtl">تنبيهات الأمان</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            مُفعل
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-medium text-lg mb-4" dir="rtl">أدوات الأمان</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                        <Shield className="h-6 w-6" />
                        <span dir="rtl">فحص الأمان</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                        <Lock className="h-6 w-6" />
                        <span dir="rtl">تغيير كلمة المرور</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                        <Eye className="h-6 w-6" />
                        <span dir="rtl">عرض السجلات</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                        <Users className="h-6 w-6" />
                        <span dir="rtl">إدارة المستخدمين</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                        <AlertTriangle className="h-6 w-6" />
                        <span dir="rtl">تقارير الأمان</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                        <Activity className="h-6 w-6" />
                        <span dir="rtl">مراقبة الشبكة</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}