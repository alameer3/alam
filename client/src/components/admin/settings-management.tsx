import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, Globe, Shield, Database, Bell, Mail, Palette, 
  Save, RefreshCw, Download, Upload, AlertCircle, CheckCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsManagement() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'YEMEN 🇾🇪 FLIX',
    siteDescription: 'منصة يمنية لمشاهدة الأفلام والمسلسلات',
    defaultLanguage: 'ar',
    timezone: 'Asia/Aden',
    maintenanceMode: false,
    
    // Content Settings
    allowUserSubmissions: true,
    requireContentApproval: true,
    maxFileSize: 500, // MB
    allowedFileTypes: ['mp4', 'mkv', 'avi', 'mov'],
    
    // Security Settings
    enableTwoFactor: false,
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    
    // Email Settings
    emailEnabled: true,
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    
    // Notification Settings
    emailNotifications: true,
    newUserNotifications: true,
    contentSubmissionNotifications: true,
    systemAlerts: true,
    
    // Display Settings
    darkMode: true,
    showRatings: true,
    showComments: true,
    itemsPerPage: 20,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30 // days
  });

  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم حفظ الإعدادات بنجاح",
        description: "تم تطبيق جميع التغييرات"
      });
    } catch (error) {
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      toast({
        title: "تم إنشاء نسخة احتياطية",
        description: "تم إنشاء نسخة احتياطية من البيانات بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في النسخة الاحتياطية",
        description: "حدث خطأ أثناء إنشاء النسخة الاحتياطية",
        variant: "destructive"
      });
    }
  };

  const updateSetting = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إعدادات النظام</h2>
          <p className="text-muted-foreground">
            إدارة إعدادات المنصة والتحكم في النظام
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleBackup} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            نسخة احتياطية
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            حفظ الإعدادات
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="content">المحتوى</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="email">البريد</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="display">العرض</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                الإعدادات العامة
              </CardTitle>
              <CardDescription>إعدادات عامة للمنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultLanguage">اللغة الافتراضية</Label>
                  <Select value={settings.defaultLanguage} onValueChange={(value) => updateSetting('defaultLanguage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">الإنجليزية</SelectItem>
                      <SelectItem value="fr">الفرنسية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">وصف الموقع</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Aden">آسيا/عدن</SelectItem>
                      <SelectItem value="Asia/Riyadh">آسيا/الرياض</SelectItem>
                      <SelectItem value="Asia/Dubai">آسيا/دبي</SelectItem>
                      <SelectItem value="Africa/Cairo">أفريقيا/القاهرة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                  />
                  <Label htmlFor="maintenanceMode">وضع الصيانة</Label>
                </div>
              </div>

              {settings.maintenanceMode && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    الموقع في وضع الصيانة - سيتم عرض صفحة الصيانة للمستخدمين
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                إعدادات المحتوى
              </CardTitle>
              <CardDescription>إعدادات إدارة المحتوى والملفات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="allowUserSubmissions"
                  checked={settings.allowUserSubmissions}
                  onCheckedChange={(checked) => updateSetting('allowUserSubmissions', checked)}
                />
                <Label htmlFor="allowUserSubmissions">السماح بإضافة المحتوى من المستخدمين</Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="requireContentApproval"
                  checked={settings.requireContentApproval}
                  onCheckedChange={(checked) => updateSetting('requireContentApproval', checked)}
                />
                <Label htmlFor="requireContentApproval">يتطلب موافقة إدارية للمحتوى</Label>
              </div>

              <div>
                <Label htmlFor="maxFileSize">الحد الأقصى لحجم الملف (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label>أنواع الملفات المسموحة</Label>
                <div className="flex gap-2 mt-2">
                  {settings.allowedFileTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                إعدادات الأمان
              </CardTitle>
              <CardDescription>إعدادات الحماية والأمان</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="enableTwoFactor"
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) => updateSetting('enableTwoFactor', checked)}
                />
                <Label htmlFor="enableTwoFactor">تفعيل المصادقة الثنائية</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">مهلة انتهاء الجلسة (دقيقة)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">عدد محاولات تسجيل الدخول</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="passwordMinLength">أقل عدد حروف لكلمة المرور</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                إعدادات البريد الإلكتروني
              </CardTitle>
              <CardDescription>إعدادات خادم البريد الإلكتروني</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="emailEnabled"
                  checked={settings.emailEnabled}
                  onCheckedChange={(checked) => updateSetting('emailEnabled', checked)}
                />
                <Label htmlFor="emailEnabled">تفعيل البريد الإلكتروني</Label>
              </div>

              {settings.emailEnabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpHost">خادم SMTP</Label>
                      <Input
                        id="smtpHost"
                        value={settings.smtpHost}
                        onChange={(e) => updateSetting('smtpHost', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">منفذ SMTP</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={settings.smtpPort}
                        onChange={(e) => updateSetting('smtpPort', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpUsername">اسم المستخدم</Label>
                      <Input
                        id="smtpUsername"
                        value={settings.smtpUsername}
                        onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">كلمة المرور</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>إعدادات الإشعارات والتنبيهات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
                <Label htmlFor="emailNotifications">إشعارات البريد الإلكتروني</Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="newUserNotifications"
                  checked={settings.newUserNotifications}
                  onCheckedChange={(checked) => updateSetting('newUserNotifications', checked)}
                />
                <Label htmlFor="newUserNotifications">إشعارات المستخدمين الجدد</Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="contentSubmissionNotifications"
                  checked={settings.contentSubmissionNotifications}
                  onCheckedChange={(checked) => updateSetting('contentSubmissionNotifications', checked)}
                />
                <Label htmlFor="contentSubmissionNotifications">إشعارات المحتوى المقترح</Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="systemAlerts"
                  checked={settings.systemAlerts}
                  onCheckedChange={(checked) => updateSetting('systemAlerts', checked)}
                />
                <Label htmlFor="systemAlerts">تنبيهات النظام</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                إعدادات العرض
              </CardTitle>
              <CardDescription>إعدادات واجهة المستخدم والعرض</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                />
                <Label htmlFor="darkMode">الوضع الداكن افتراضي</Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="showRatings"
                  checked={settings.showRatings}
                  onCheckedChange={(checked) => updateSetting('showRatings', checked)}
                />
                <Label htmlFor="showRatings">عرض التقييمات</Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="showComments"
                  checked={settings.showComments}
                  onCheckedChange={(checked) => updateSetting('showComments', checked)}
                />
                <Label htmlFor="showComments">عرض التعليقات</Label>
              </div>

              <div>
                <Label htmlFor="itemsPerPage">عدد العناصر في الصفحة</Label>
                <Select value={settings.itemsPerPage.toString()} onValueChange={(value) => updateSetting('itemsPerPage', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}