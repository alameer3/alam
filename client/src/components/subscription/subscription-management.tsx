import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Check, Crown, Star, Zap, Download, Monitor, Smartphone, Tv, CreditCard } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  nameArabic: string;
  price: number;
  duration: number;
  features: string[];
  featuresArabic: string[];
  maxStreams: number;
  maxDownloads: number;
  hasHDAccess: boolean;
  has4KAccess: boolean;
  hasOfflineAccess: boolean;
  isPopular?: boolean;
  color: string;
  icon: React.ReactNode;
}

const SubscriptionManagement: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      nameArabic: 'أساسي',
      price: 5.99,
      duration: 30,
      features: [
        'SD Quality Streaming',
        'Single Device',
        'Mobile Access Only',
        'Basic Content Library',
        'Email Support'
      ],
      featuresArabic: [
        'بث بجودة عادية',
        'جهاز واحد',
        'الوصول عبر الهاتف فقط',
        'مكتبة محتوى أساسية',
        'دعم عبر البريد الإلكتروني'
      ],
      maxStreams: 1,
      maxDownloads: 0,
      hasHDAccess: false,
      has4KAccess: false,
      hasOfflineAccess: false,
      color: 'from-blue-500 to-blue-600',
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      id: 'premium',
      name: 'Premium',
      nameArabic: 'مميز',
      price: 9.99,
      duration: 30,
      features: [
        'HD Quality Streaming',
        'Up to 3 Devices',
        'All Device Access',
        'Full Content Library',
        'Offline Downloads (10)',
        'Priority Support',
        'No Ads'
      ],
      featuresArabic: [
        'بث بجودة عالية',
        'حتى 3 أجهزة',
        'الوصول من جميع الأجهزة',
        'مكتبة محتوى كاملة',
        'تحميل للمشاهدة بلا إنترنت (10)',
        'دعم أولوية',
        'بدون إعلانات'
      ],
      maxStreams: 3,
      maxDownloads: 10,
      hasHDAccess: true,
      has4KAccess: false,
      hasOfflineAccess: true,
      isPopular: true,
      color: 'from-purple-500 to-purple-600',
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 'ultra',
      name: 'Ultra',
      nameArabic: 'فائق',
      price: 15.99,
      duration: 30,
      features: [
        '4K Ultra HD Streaming',
        'Unlimited Devices',
        'All Platforms Access',
        'Premium Content Library',
        'Unlimited Downloads',
        'VIP Support',
        'Early Access Content',
        'Family Sharing'
      ],
      featuresArabic: [
        'بث بجودة 4K فائقة',
        'أجهزة غير محدودة',
        'الوصول من جميع المنصات',
        'مكتبة محتوى مميزة',
        'تحميل غير محدود',
        'دعم VIP',
        'الوصول المبكر للمحتوى',
        'مشاركة عائلية'
      ],
      maxStreams: -1,
      maxDownloads: -1,
      hasHDAccess: true,
      has4KAccess: true,
      hasOfflineAccess: true,
      color: 'from-yellow-500 to-yellow-600',
      icon: <Crown className="w-6 h-6" />
    }
  ];

  const currentSubscription = {
    planId: 'basic',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    autoRenew: true,
    daysRemaining: 19
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsUpgradeDialogOpen(true);
  };

  const handleSubscribe = () => {
    // سيتم إضافة معالجة الدفع هنا لاحقاً
    // Handle subscription logic here
    setIsUpgradeDialogOpen(false);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          خطط الاشتراك
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          اختر الخطة المناسبة لك واستمتع بأفضل تجربة مشاهدة على منصة YEMEN 🇾🇪 FLIX
        </p>
      </div>

      {/* Current Subscription Status */}
      <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            اشتراكك الحالي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">الخطة الحالية</p>
              <p className="text-xl font-bold text-blue-600">
                {subscriptionPlans.find(p => p.id === currentSubscription.planId)?.nameArabic}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">تاريخ الانتهاء</p>
              <p className="text-lg font-medium">{currentSubscription.endDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">الأيام المتبقية</p>
              <div className="flex items-center gap-2">
                <Progress value={(currentSubscription.daysRemaining / 30) * 100} className="flex-1" />
                <span className="text-sm font-medium">{currentSubscription.daysRemaining} يوم</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden border-2 ${
              plan.isPopular 
                ? 'border-purple-500 dark:border-purple-400 shadow-lg scale-105' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            } transition-all duration-300 hover:shadow-lg`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                الأكثر شعبية
              </div>
            )}
            
            <CardHeader className={`${plan.isPopular ? 'pt-12' : 'pt-6'}`}>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-4 mx-auto`}>
                {plan.icon}
              </div>
              <CardTitle className="text-center text-2xl font-bold">
                {plan.nameArabic}
              </CardTitle>
              <div className="text-center">
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-slate-600 dark:text-slate-400">/شهر</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.featuresArabic.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center">
                  <Monitor className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {plan.maxStreams === -1 ? 'غير محدود' : `${plan.maxStreams} جهاز`}
                  </p>
                </div>
                <div className="text-center">
                  <Download className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {plan.maxDownloads === -1 ? 'غير محدود' : 
                     plan.maxDownloads === 0 ? 'غير متاح' : `${plan.maxDownloads} تحميل`}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                {plan.hasHDAccess && (
                  <Badge variant="secondary" className="text-xs">HD</Badge>
                )}
                {plan.has4KAccess && (
                  <Badge variant="secondary" className="text-xs">4K</Badge>
                )}
                {plan.hasOfflineAccess && (
                  <Badge variant="secondary" className="text-xs">أوفلاين</Badge>
                )}
              </div>

              <Button
                onClick={() => handleUpgrade(plan)}
                className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`}
                disabled={currentSubscription.planId === plan.id}
              >
                {currentSubscription.planId === plan.id ? 'الخطة الحالية' : 'اشترك الآن'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              تأكيد الاشتراك في خطة {selectedPlan?.nameArabic}
            </DialogTitle>
            <DialogDescription className="text-center">
              سيتم تطبيق الخطة الجديدة فوراً وسيتم إنهاء الخطة الحالية
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedPlan.color} flex items-center justify-center text-white mb-2 mx-auto`}>
                  {selectedPlan.icon}
                </div>
                <h3 className="font-bold text-lg">{selectedPlan.nameArabic}</h3>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatCurrency(selectedPlan.price)}/شهر
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">الميزات المشمولة:</h4>
                <ul className="space-y-1">
                  {selectedPlan.featuresArabic.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-3 h-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsUpgradeDialogOpen(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSubscribe}
                  className={`flex-1 bg-gradient-to-r ${selectedPlan.color} hover:opacity-90 text-white`}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  اشترك الآن
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Features Comparison */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center">مقارنة الميزات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-right p-4">الميزة</th>
                  {subscriptionPlans.map((plan) => (
                    <th key={plan.id} className="text-center p-4">
                      {plan.nameArabic}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <td className="p-4 font-medium">جودة البث</td>
                  <td className="text-center p-4">SD</td>
                  <td className="text-center p-4">HD</td>
                  <td className="text-center p-4">4K</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <td className="p-4 font-medium">عدد الأجهزة</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4">3</td>
                  <td className="text-center p-4">غير محدود</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <td className="p-4 font-medium">التحميل للمشاهدة بلا إنترنت</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅ (10)</td>
                  <td className="text-center p-4">✅ (غير محدود)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">الوصول المبكر للمحتوى</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;