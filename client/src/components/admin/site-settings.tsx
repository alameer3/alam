import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Settings, Save, RefreshCw, Globe, Palette, Share2, Zap } from 'lucide-react';
import type { SiteSettings } from '../../../shared/types';

interface SiteSettingsProps {
  className?: string;
}

export function SiteSettingsComponent({ className }: SiteSettingsProps) {
  const [settings, setSettings] = useState<SiteSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      const result = await response.json();
      
      if (result.success) {
        setSettings(result.data);
      } else {
        setError(result.error || 'خطأ في الحصول على الإعدادات');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: settings.map(s => ({ key: s.key, value: s.value }))
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "تم الحفظ",
          description: "تم تحديث إعدادات الموقع بنجاح",
        });
      } else {
        toast({
          title: "خطأ",
          description: result.error || "خطأ في حفظ الإعدادات",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "خطأ",
        description: "خطأ في الاتصال بالخادم",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getSettingValue = (key: string): string => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || '';
  };

  const getSettingsByCategory = (category: string): SiteSettings[] => {
    return settings.filter(s => s.category === category);
  };

  const renderSettingField = (setting: SiteSettings) => {
    const value = setting.value;
    
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Switch
              id={setting.key}
              checked={value === 'true'}
              onCheckedChange={(checked) => updateSetting(setting.key, checked.toString())}
            />
            <Label htmlFor={setting.key} className="text-sm">
              {setting.description || setting.key}
            </Label>
          </div>
        );
      
      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={setting.key} className="text-sm font-medium">
              {setting.description || setting.key}
            </Label>
            <Input
              id={setting.key}
              type="number"
              value={value}
              onChange={(e) => updateSetting(setting.key, e.target.value)}
              className="w-full"
            />
          </div>
        );
      
      case 'string':
      default:
        if (setting.key.includes('description') || setting.key.includes('bio')) {
          return (
            <div className="space-y-2">
              <Label htmlFor={setting.key} className="text-sm font-medium">
                {setting.description || setting.key}
              </Label>
              <Textarea
                id={setting.key}
                value={value}
                onChange={(e) => updateSetting(setting.key, e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
          );
        } else {
          return (
            <div className="space-y-2">
              <Label htmlFor={setting.key} className="text-sm font-medium">
                {setting.description || setting.key}
              </Label>
              <Input
                id={setting.key}
                value={value}
                onChange={(e) => updateSetting(setting.key, e.target.value)}
                className="w-full"
              />
            </div>
          );
        }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <Button onClick={fetchSettings} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            إعدادات الموقع
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            تخصيص وإدارة إعدادات موقع AK.SV
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              عام
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              المظهر
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center">
              <Share2 className="w-4 h-4 mr-2" />
              الشبكات
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              متقدم
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  الإعدادات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getSettingsByCategory('general').map((setting) => (
                  <div key={setting.key}>
                    {renderSettingField(setting)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  إعدادات المظهر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getSettingsByCategory('appearance').map((setting) => (
                  <div key={setting.key}>
                    {renderSettingField(setting)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  الشبكات الاجتماعية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getSettingsByCategory('social').map((setting) => (
                  <div key={setting.key}>
                    {renderSettingField(setting)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  الإعدادات المتقدمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getSettingsByCategory('advanced').map((setting) => (
                  <div key={setting.key}>
                    {renderSettingField(setting)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={saving}
            size="lg"
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                حفظ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                حفظ الإعدادات
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}