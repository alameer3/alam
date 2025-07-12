import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/layout/ui/card';
import { Badge } from '@/components/layout/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AdvancedFileUploader } from './advanced-file-uploader';
import { useQuery } from '@tanstack/react-query';
import { 
  Upload, 
  FileVideo, 
  Image, 
  Music, 
  FileText, 
  Download,
  Trash2,
  Eye,
  Calendar,
  HardDrive
} from 'lucide-react';

interface Upload {
  id: number;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export function UploadManager() {
  const [activeTab, setActiveTab] = useState('upload');

  // Fetch user uploads
  const { data: uploads, isLoading, refetch } = useQuery({
    queryKey: ['/api/uploads/user'],
    enabled: activeTab === 'history'
  });

  // Fetch upload statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/uploads/stats'],
    enabled: activeTab === 'stats'
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('video/')) return <FileVideo className="h-5 w-5 text-blue-500" />;
    if (mimeType.startsWith('image/')) return <Image className="h-5 w-5 text-green-500" />;
    if (mimeType.startsWith('audio/')) return <Music className="h-5 w-5 text-purple-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">مكتمل</Badge>;
      case 'pending':
        return <Badge variant="secondary">في الانتظار</Badge>;
      case 'uploading':
        return <Badge className="bg-blue-100 text-blue-800">جاري الرفع</Badge>;
      case 'error':
        return <Badge variant="destructive">خطأ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const deleteUpload = async (uploadId: number) => {
    try {
      const response = await fetch(`/api/uploads/${uploadId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Error deleting upload:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">إدارة الملفات</h1>
        <p className="text-gray-600">رفع وإدارة ملفات المحتوى</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            رفع جديد
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            سجل الرفع
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            الإحصائيات
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <AdvancedFileUploader
            maxSize={500}
            maxFiles={10}
            enableChunking={true}
            onUploadComplete={() => refetch()}
          />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>سجل الملفات المرفوعة</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">جاري التحميل...</p>
                </div>
              ) : uploads?.length === 0 ? (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">لا توجد ملفات مرفوعة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploads?.map((upload: Upload) => (
                    <div key={upload.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          {getFileIcon(upload.mimeType)}
                          <div>
                            <p className="font-medium">{upload.originalFilename}</p>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                              <span>{formatFileSize(upload.fileSize)}</span>
                              <span>{formatDate(upload.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {getStatusBadge(upload.status)}
                          
                          <div className="flex space-x-1 rtl:space-x-reverse">
                            {upload.status === 'completed' && (
                              <>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => deleteUpload(upload.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {upload.status === 'uploading' && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>تقدم الرفع</span>
                            <span>{upload.progress}%</span>
                          </div>
                          <Progress value={upload.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Upload className="h-8 w-8 text-blue-500" />
                  <div className="mr-4">
                    <p className="text-2xl font-bold">{stats?.totalUploads || 0}</p>
                    <p className="text-gray-600">إجمالي الملفات</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <HardDrive className="h-8 w-8 text-green-500" />
                  <div className="mr-4">
                    <p className="text-2xl font-bold">
                      {stats?.totalSize ? formatFileSize(stats.totalSize) : '0 MB'}
                    </p>
                    <p className="text-gray-600">إجمالي الحجم</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileVideo className="h-8 w-8 text-purple-500" />
                  <div className="mr-4">
                    <p className="text-2xl font-bold">{stats?.videoFiles || 0}</p>
                    <p className="text-gray-600">ملفات الفيديو</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Image className="h-8 w-8 text-orange-500" />
                  <div className="mr-4">
                    <p className="text-2xl font-bold">{stats?.imageFiles || 0}</p>
                    <p className="text-gray-600">ملفات الصور</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Storage Usage */}
          <Card>
            <CardHeader>
              <CardTitle>استخدام التخزين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>المساحة المستخدمة</span>
                    <span>
                      {stats?.totalSize ? formatFileSize(stats.totalSize) : '0 MB'} / 10 GB
                    </span>
                  </div>
                  <Progress 
                    value={stats?.totalSize ? (stats.totalSize / (10 * 1024 * 1024 * 1024)) * 100 : 0} 
                    className="h-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <FileVideo className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-sm font-medium">فيديوهات</p>
                    <p className="text-2xl font-bold text-blue-500">
                      {stats?.videoSize ? formatFileSize(stats.videoSize) : '0 MB'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Image className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-sm font-medium">صور</p>
                    <p className="text-2xl font-bold text-green-500">
                      {stats?.imageSize ? formatFileSize(stats.imageSize) : '0 MB'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                    <p className="text-sm font-medium">أخرى</p>
                    <p className="text-2xl font-bold text-gray-500">
                      {stats?.otherSize ? formatFileSize(stats.otherSize) : '0 MB'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}