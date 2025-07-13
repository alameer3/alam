import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Eye, Users, Clock, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

interface SecurityStats {
  totalMonitoredIPs: number;
  blockedIPs: number;
  suspiciousIPs: number;
}

interface SecurityLog {
  id: number;
  ipAddress: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  details: string;
  userId?: number;
}

interface AuditLog {
  id: number;
  userId?: number;
  action: string;
  resource: string;
  success: boolean;
  timestamp: string;
  ipAddress: string;
}

interface SecurityDashboardData {
  securityStats: SecurityStats;
  recentSecurityEvents: SecurityLog[];
  failedLoginsToday: number;
  activeSessions: number;
  recentAuditLogs: AuditLog[];
}

export default function SecurityDashboard() {
  const { toast } = useToast();
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);

  const { data: dashboardData, isLoading, error } = useQuery<SecurityDashboardData>({
    queryKey: ['/api/security/dashboard'],
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message="فشل في تحميل لوحة الأمان" 
        description="حدث خطأ أثناء تحميل بيانات الأمان. يرجى المحاولة مرة أخرى."
      />
    );
  }

  if (!dashboardData) {
    return (
      <ErrorMessage 
        message="لا توجد بيانات أمان متاحة" 
        description="لم يتم العثور على بيانات أمان لعرضها."
      />
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          لوحة الأمان والحماية
        </h1>
        <Badge variant="outline" className="text-sm">
          آخر تحديث: {new Date().toLocaleString('ar-EG')}
        </Badge>
      </div>

      {/* إحصائيات الأمان */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عناوين IP المراقبة</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.securityStats.totalMonitoredIPs}</div>
            <p className="text-xs text-muted-foreground">إجمالي العناوين المراقبة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عناوين IP المحظورة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{dashboardData.securityStats.blockedIPs}</div>
            <p className="text-xs text-muted-foreground">عناوين محظورة حالياً</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">محاولات تسجيل دخول فاشلة</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardData.failedLoginsToday}</div>
            <p className="text-xs text-muted-foreground">خلال آخر 24 ساعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الجلسات النشطة</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboardData.activeSessions}</div>
            <p className="text-xs text-muted-foreground">جلسات نشطة حالياً</p>
          </CardContent>
        </Card>
      </div>

      {/* السجلات والأحداث */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أحداث الأمان الأخيرة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              أحداث الأمان الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentSecurityEvents.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  لا توجد أحداث أمان حديثة
                </p>
              ) : (
                dashboardData.recentSecurityEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getSeverityIcon(event.severity)}</span>
                      <div>
                        <p className="font-medium">{event.eventType}</p>
                        <p className="text-sm text-muted-foreground">{event.ipAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedLog(event)}>
                            التفاصيل
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>تفاصيل حدث الأمان</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">نوع الحدث</label>
                                <p className="text-sm text-muted-foreground">{event.eventType}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">مستوى الخطورة</label>
                                <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                              </div>
                              <div>
                                <label className="text-sm font-medium">عنوان IP</label>
                                <p className="text-sm text-muted-foreground">{event.ipAddress}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">التوقيت</label>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(event.timestamp).toLocaleString('ar-EG')}
                                </p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">التفاصيل</label>
                              <pre className="text-sm text-muted-foreground mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                {event.details}
                              </pre>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* سجل التدقيق */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              سجل التدقيق الأخير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentAuditLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  لا توجد سجلات تدقيق حديثة
                </p>
              ) : (
                dashboardData.recentAuditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.success ? 'bg-green-600' : 'bg-red-600'}`} />
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-muted-foreground">{log.resource}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString('ar-EG')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات الأمان */}
      <Card>
        <CardHeader>
          <CardTitle>أدوات الأمان والحماية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Shield className="h-6 w-6" />
              <span>إعدادات الأمان</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Eye className="h-6 w-6" />
              <span>مراقبة الأنشطة</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span>تقارير الأمان</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}