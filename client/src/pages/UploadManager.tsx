import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { queryClient } from '@/lib/queryClient';
import FileUpload from '@/components/FileUpload';
import { useQuery } from '@tanstack/react-query';
import { 
  Upload, 
  FileVideo, 
  FileImage, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Trash2,
  Eye,
  Download
} from 'lucide-react';

interface Upload {
  id: number;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadStatus: string;
  uploadProgress: number;
  userId: number;
  contentId?: number;
  fileType: string;
  quality?: string;
  resolution?: string;
  duration?: number;
  thumbnailUrl?: string;
  processedUrl?: string;
  storageUrl: string;
  compressionLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UploadManager() {
  const [selectedTab, setSelectedTab] = useState('upload');

  const { data: uploads, refetch } = useQuery<Upload[]>({
    queryKey: ['/api/uploads/user/1'],
    enabled: selectedTab === 'manage'
  });

  const handleUploadComplete = (uploadId: number) => {
    refetch();
  };

  const deleteUpload = async (id: number) => {
    try {
      const response = await fetch(`/api/uploads/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'video': return <FileVideo className="w-5 h-5" />;
      case 'image': return <FileImage className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />مكتمل</Badge>;
      case 'processing':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />جاري المعالجة</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />فشل</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">إدارة التحميلات</h1>
          <p className="text-gray-600">رفع وإدارة ملفات الفيديو والصور والترجمات</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">رفع ملفات جديدة</TabsTrigger>
          <TabsTrigger value="manage">إدارة الملفات</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>رفع ملفات جديدة</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileVideo className="w-5 h-5" />
                ملفاتي المرفوعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploads && uploads.length > 0 ? (
                <div className="space-y-4">
                  {uploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      {/* File Icon/Thumbnail */}
                      <div className="flex-shrink-0">
                        {upload.thumbnailUrl ? (
                          <img
                            src={upload.thumbnailUrl}
                            alt={upload.originalName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                            {getFileIcon(upload.fileType)}
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{upload.originalName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>{formatFileSize(upload.size)}</span>
                          <span className="capitalize">{upload.fileType}</span>
                          {upload.quality && <span>{upload.quality}</span>}
                          {upload.resolution && <span>{upload.resolution}</span>}
                          {upload.duration && <span>{formatDuration(upload.duration)}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(upload.uploadStatus)}
                          <span className="text-xs text-gray-500">
                            {new Date(upload.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      {upload.uploadStatus === 'processing' && (
                        <div className="flex-shrink-0 w-20">
                          <div className="text-xs text-center mb-1">
                            {upload.uploadProgress}%
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${upload.uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {upload.processedUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(upload.processedUrl, '_blank')}
                            title="عرض الملف"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {upload.storageUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(upload.storageUrl, '_blank')}
                            title="تحميل الملف"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUpload(upload.id)}
                          title="حذف الملف"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileVideo className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">لم يتم رفع أي ملفات بعد</p>
                  <Button 
                    onClick={() => setSelectedTab('upload')}
                    className="mt-4"
                  >
                    ابدأ برفع الملفات
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}