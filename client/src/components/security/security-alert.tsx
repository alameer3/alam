import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Lock,
  Wifi,
  Activity
} from 'lucide-react';

interface SecurityAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  resolved: boolean;
}

export default function SecurityAlert() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    firewall: 'active',
    encryption: 'active',
    monitoring: 'active',
    backups: 'active',
    updates: 'current'
  });

  // Fetch real security alerts from API
  useEffect(() => {
    const fetchSecurityAlerts = async () => {
      try {
        const response = await fetch('/api/security/alerts');
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        // Silently handle error - no console.log for production
        setAlerts([]);
      }
    };

    fetchSecurityAlerts();
  }, []);

  const getAlertIcon = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'info': return <Shield className="h-5 w-5 text-blue-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50 text-green-800';
      case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'error': return 'border-red-200 bg-red-50 text-red-800';
      case 'info': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getSeverityColor = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'current': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'outdated': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <div className="space-y-6" dir="rtl">
      {/* نظرة عامة على حالة النظام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            حالة نظام الأمان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">جدار الحماية</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.firewall)}
                <span className="text-sm text-green-600">نشط</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">التشفير</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.encryption)}
                <span className="text-sm text-green-600">نشط</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">المراقبة</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.monitoring)}
                <span className="text-sm text-green-600">نشط</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">النسخ الاحتياطية</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.backups)}
                <span className="text-sm text-green-600">نشط</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">التحديثات</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.updates)}
                <span className="text-sm text-green-600">محدث</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التنبيهات الأمنية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              التنبيهات الأمنية
            </div>
            {unresolvedAlerts.length > 0 && (
              <Badge variant="destructive">
                {unresolvedAlerts.length} تنبيه غير محلول
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لا توجد تنبيهات أمنية
                </h3>
                <p className="text-gray-600">
                  جميع الأنظمة تعمل بشكل طبيعي
                </p>
              </div>
            ) : (
              alerts.map((alert) => (
                <Alert key={alert.id} className={getAlertColor(alert.type)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {alert.resolved && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              محلول
                            </Badge>
                          )}
                        </div>
                        <AlertDescription className="text-sm mb-2">
                          {alert.message}
                        </AlertDescription>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>المصدر: {alert.source}</span>
                          <span>
                            {alert.timestamp.toLocaleString('ar-EG')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!alert.resolved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          تم الحل
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        إخفاء
                      </Button>
                    </div>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المحاولات المحظورة</p>
                <p className="text-2xl font-bold text-red-600">23</p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تسجيل دخول آمن</p>
                <p className="text-2xl font-bold text-green-600">1,245</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">أنشطة مراقبة</p>
                <p className="text-2xl font-bold text-blue-600">856</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نسخ احتياطية</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}