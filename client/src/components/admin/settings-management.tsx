import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Input } from "@/components/layout/ui/input";
import { Label } from "@/components/layout/ui/label";
import { Textarea } from "@/components/layout/ui/textarea";
import { Switch } from "@/components/layout/ui/switch";
import { Separator } from "@/components/layout/ui/separator";
import { Settings, Globe, Shield, Bell, Database, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsManagement() {
  const [settings, setSettings] = useState({
    siteName: "YEMEN 🇾🇪 FLIX",
    siteDescription: "منصة الأفلام والمسلسلات اليمنية الرائدة",
    adminEmail: "admin@example.com",
    allowRegistration: true,
    enableComments: true,
    enableRatings: true,
    maxFileSize: "100",
    allowedFileTypes: "mp4,mkv,avi,mov",
    enableDownloads: true,
    enableStreaming: true,
    maintenanceMode: false,
    theme: "dark",
    language: "ar"
  });

  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({ title: "تم حفظ الإعدادات بنجاح" });
  };

  const handleExport = () => {
    // Export database
    toast({ title: "تم تصدير قاعدة البيانات" });
  };

  const handleImport = () => {
    // Import database
    toast({ title: "تم استيراد قاعدة البيانات" });
  };

  const handleBackup = () => {
    // Create backup
    toast({ title: "تم إنشاء نسخة احتياطية" });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="bg-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            الإعدادات العامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">اسم الموقع</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="adminEmail">البريد الإداري</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="siteDescription">وصف الموقع</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="theme">المظهر</Label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full p-2 border border-gray-600 rounded-md bg-background text-white"
              >
                <option value="dark">داكن</option>
                <option value="light">فاتح</option>
              </select>
            </div>
            <div>
              <Label htmlFor="language">اللغة</Label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full p-2 border border-gray-600 rounded-md bg-background text-white"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Settings */}
      <Card className="bg-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            إعدادات المستخدمين
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowRegistration">السماح بالتسجيل</Label>
              <p className="text-sm text-gray-400">السماح للمستخدمين الجدد بإنشاء حسابات</p>
            </div>
            <Switch
              id="allowRegistration"
              checked={settings.allowRegistration}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowRegistration: checked }))}
            />
          </div>

          <Separator className="bg-gray-700" />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableComments">تفعيل التعليقات</Label>
              <p className="text-sm text-gray-400">السماح للمستخدمين بإضافة تعليقات</p>
            </div>
            <Switch
              id="enableComments"
              checked={settings.enableComments}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableComments: checked }))}
            />
          </div>

          <Separator className="bg-gray-700" />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableRatings">تفعيل التقييمات</Label>
              <p className="text-sm text-gray-400">السماح للمستخدمين بتقييم المحتوى</p>
            </div>
            <Switch
              id="enableRatings"
              checked={settings.enableRatings}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRatings: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Settings */}
      <Card className="bg-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            إعدادات المحتوى
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxFileSize">الحد الأقصى لحجم الملف (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="allowedFileTypes">أنواع الملفات المسموحة</Label>
              <Input
                id="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={(e) => setSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
                placeholder="mp4,mkv,avi,mov"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableDownloads">تفعيل التحميل</Label>
              <p className="text-sm text-gray-400">السماح للمستخدمين بتحميل المحتوى</p>
            </div>
            <Switch
              id="enableDownloads"
              checked={settings.enableDownloads}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableDownloads: checked }))}
            />
          </div>

          <Separator className="bg-gray-700" />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableStreaming">تفعيل البث المباشر</Label>
              <p className="text-sm text-gray-400">السماح بمشاهدة المحتوى مباشرة</p>
            </div>
            <Switch
              id="enableStreaming"
              checked={settings.enableStreaming}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableStreaming: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="bg-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            إعدادات النظام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode">وضع الصيانة</Label>
              <p className="text-sm text-gray-400">إيقاف الموقع مؤقتاً للصيانة</p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
            />
          </div>

          <Separator className="bg-gray-700" />

          <div className="flex gap-4">
            <Button onClick={handleBackup} variant="outline" className="flex-1">
              <Download className="w-4 h-4 ml-2" />
              نسخة احتياطية
            </Button>
            <Button onClick={handleExport} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 ml-2" />
              تصدير البيانات
            </Button>
            <Button onClick={handleImport} variant="outline" className="flex-1">
              <Download className="w-4 h-4 ml-2" />
              استيراد البيانات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
          حفظ جميع الإعدادات
        </Button>
      </div>
    </div>
  );
}