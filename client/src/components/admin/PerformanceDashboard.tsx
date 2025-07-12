import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Database, 
  HardDrive, 
  Server, 
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PerformanceData {
  system: {
    uptime: number;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    nodeVersion: string;
    platform: string;
  };
  database: {
    healthy: boolean;
    responseTime: number;
    error?: string;
  };
  backup: {
    backupDirectory: string;
    files: string[];
    lastBackup?: string;
    error?: string;
  };
  timestamp: string;
}

export function PerformanceDashboard() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  
  const { data: performanceData, isLoading, refetch } = useQuery<PerformanceData>({
    queryKey: ['/api/performance/dashboard'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getMemoryUsagePercent = () => {
    if (!performanceData) return 0;
    return Math.round((performanceData.system.memory.heapUsed / performanceData.system.memory.heapTotal) * 100);
  };

  const getHealthStatus = () => {
    if (!performanceData) return 'unknown';
    
    const memoryPercent = getMemoryUsagePercent();
    const dbHealthy = performanceData.database.healthy;
    const dbResponseTime = performanceData.database.responseTime;
    
    if (!dbHealthy || memoryPercent > 90) return 'critical';
    if (dbResponseTime > 1000 || memoryPercent > 70) return 'warning';
    return 'healthy';
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      const response = await fetch('/api/performance/backup/create', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast({
          title: "نسخة احتياطية تم إنشاؤها",
          description: "تم إنشاء النسخة الاحتياطية بنجاح",
        });
        refetch();
      } else {
        throw new Error('Failed to create backup');
      }
    } catch (error) {
      toast({
        title: "خطأ في إنشاء النسخة الاحتياطية",
        description: "حدث خطأ أثناء إنشاء النسخة الاحتياطية",
        variant: "destructive",
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">خطأ في تحميل البيانات</h3>
        <p className="text-muted-foreground">لا يمكن تحميل بيانات الأداء</p>
      </div>
    );
  }

  const healthStatus = getHealthStatus();
  const memoryPercent = getMemoryUsagePercent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">لوحة مراقبة الأداء</h2>
          <p className="text-muted-foreground">مراقبة أداء النظام وقاعدة البيانات</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          تحديث
        </Button>
      </div>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {healthStatus === 'healthy' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            حالة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge 
              variant={healthStatus === 'healthy' ? 'default' : 'destructive'}
              className="text-sm"
            >
              {healthStatus === 'healthy' ? 'سليم' : 'يحتاج انتباه'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              آخر تحديث: {new Date(performanceData.timestamp).toLocaleString('ar-SA')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">وقت التشغيل</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(performanceData.system.uptime)}</div>
            <p className="text-xs text-muted-foreground">منذ آخر إعادة تشغيل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">استخدام الذاكرة</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memoryPercent}%</div>
            <Progress value={memoryPercent} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {performanceData.system.memory.heapUsed}MB / {performanceData.system.memory.heapTotal}MB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قاعدة البيانات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.database.healthy ? 'متصلة' : 'غير متصلة'}
            </div>
            <p className="text-xs text-muted-foreground">
              زمن الاستجابة: {performanceData.database.responseTime}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النسخ الاحتياطية</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.backup.files.length}</div>
            <p className="text-xs text-muted-foreground">ملفات احتياطية</p>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            معلومات النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">الذاكرة (MB)</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>المستخدمة:</span>
                  <span>{performanceData.system.memory.heapUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span>الإجمالية:</span>
                  <span>{performanceData.system.memory.heapTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>RSS:</span>
                  <span>{performanceData.system.memory.rss}</span>
                </div>
                <div className="flex justify-between">
                  <span>خارجية:</span>
                  <span>{performanceData.system.memory.external}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">البيئة</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>إصدار Node.js:</span>
                  <span>{performanceData.system.nodeVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span>المنصة:</span>
                  <span>{performanceData.system.platform}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Management */}
      <Card>
        <CardHeader>
          <CardTitle>إدارة النسخ الاحتياطية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                آخر نسخة احتياطية: {performanceData.backup.lastBackup || 'لا توجد'}
              </p>
              <p className="text-sm text-muted-foreground">
                عدد الملفات: {performanceData.backup.files.length}
              </p>
            </div>
            <Button 
              onClick={handleCreateBackup} 
              disabled={isCreatingBackup}
              className="mr-2"
            >
              {isCreatingBackup ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <HardDrive className="h-4 w-4 mr-2" />
                  إنشاء نسخة احتياطية
                </>
              )}
            </Button>
          </div>
          
          {performanceData.backup.error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              خطأ: {performanceData.backup.error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}