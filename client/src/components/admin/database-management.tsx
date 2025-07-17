import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  HardDrive, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface DatabaseStats {
  totalSize: string;
  recordCount: number;
  tables: Array<{
    name: string;
    records: number;
    size: string;
  }>;
  lastBackup?: string;
  diskUsage: number;
}

export default function DatabaseManagement() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch database stats
  const { data: dbStats, isLoading } = useQuery({
    queryKey: ['/api/admin/database/stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/database/stats');
      if (!response.ok) throw new Error('Failed to fetch database stats');
      return response.json();
    }
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/admin/database/backup', {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/database/stats'] });
      toast({
        title: "تم إنشاء النسخة الاحتياطية بنجاح",
        description: "تم حفظ النسخة الاحتياطية من قاعدة البيانات"
      });
      setIsCreatingBackup(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ في إنشاء النسخة الاحتياطية",
        description: "حدث خطأ أثناء إنشاء النسخة الاحتياطية",
        variant: "destructive"
      });
      setIsCreatingBackup(false);
    }
  });

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    createBackupMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة قاعدة البيانات</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            مراقبة وإدارة قاعدة البيانات والنسخ الاحتياطية
          </p>
        </div>
        <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
          {isCreatingBackup ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          إنشاء نسخة احتياطية
        </Button>
      </div>

      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حجم قاعدة البيانات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats?.totalSize || '0 MB'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي السجلات</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats?.recordCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">استخدام القرص</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats?.diskUsage || 0}%</div>
            <Progress value={dbStats?.diskUsage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">آخر نسخة احتياطية</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {dbStats?.lastBackup ? new Date(dbStats.lastBackup).toLocaleDateString('ar') : 'لا توجد'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            نظرة عامة على الجداول
          </CardTitle>
          <CardDescription>
            إحصائيات مفصلة عن جداول قاعدة البيانات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dbStats?.tables?.map((table: any) => (
              <div key={table.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Database className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {table.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {table.records} سجل
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">{table.size}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            حالة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>اتصال قاعدة البيانات</span>
              </div>
              <Badge variant="success">متصل</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>سلامة البيانات</span>
              </div>
              <Badge variant="success">سليم</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {(dbStats?.diskUsage || 0) > 80 ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span>مساحة التخزين</span>
              </div>
              <Badge variant={(dbStats?.diskUsage || 0) > 80 ? "warning" : "success"}>
                {(dbStats?.diskUsage || 0) > 80 ? "منخفض" : "كافي"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            إدارة النسخ الاحتياطية
          </CardTitle>
          <CardDescription>
            إنشاء واستعادة النسخ الاحتياطية من قاعدة البيانات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                يُنصح بإنشاء نسخة احتياطية قبل إجراء أي تعديلات كبيرة على البيانات
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-4">
              <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
                {isCreatingBackup ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                إنشاء نسخة احتياطية جديدة
              </Button>
              
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                استعادة من نسخة احتياطية
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}