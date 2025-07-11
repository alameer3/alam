import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Input } from "@/components/layout/ui/input";
import { Label } from "@/components/layout/ui/label";
import { Progress } from "@/components/layout/ui/progress";
import { Badge } from "@/components/layout/ui/badge";
import { 
  Upload, 
  X, 
  File, 
  Image, 
  Video, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Copy,
  Trash2,
  FolderOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileUploadManagerProps {
  onFileUpload?: (file: File, url: string) => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function FileUploadManager({
  onFileUpload,
  allowedTypes = ['image/*', 'video/*'],
  maxSize = 100, // 100MB
  multiple = true
}: FileUploadManagerProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `حجم الملف يجب أن يكون أقل من ${maxSize}MB`;
    }

    if (allowedTypes.length > 0) {
      const isAllowed = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isAllowed) {
        return `نوع الملف غير مدعوم. الأنواع المسموحة: ${allowedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    // Simulate file upload - في التطبيق الحقيقي، هذا سيكون API call
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      // محاكاة تحميل الملف
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
          // في التطبيق الحقيقي، هذا سيكون الرابط الفعلي للملف
          const mockUrl = URL.createObjectURL(file);
          resolve(mockUrl);
        } else {
          reject(new Error('فشل في تحميل الملف'));
        }
      }, 2000 + Math.random() * 3000);
    });
  }, []);

  const handleFileSelect = useCallback(async (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles);
    
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          title: "خطأ في الملف",
          description: `${file.name}: ${validationError}`,
          variant: "destructive"
        });
        continue;
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: '',
        uploadedAt: new Date(),
        progress: 0,
        status: 'uploading'
      };

      setFiles(prev => [...prev, newFile]);

      try {
        // محاكاة تقدم التحميل
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: Math.min(f.progress + Math.random() * 30, 95) }
              : f
          ));
        }, 500);

        const uploadedUrl = await uploadFile(file);
        
        clearInterval(progressInterval);
        
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, url: uploadedUrl, progress: 100, status: 'success' }
            : f
        ));

        onFileUpload?.(file, uploadedUrl);
        
        toast({
          title: "تم تحميل الملف بنجاح",
          description: `تم تحميل ${file.name} بنجاح`
        });

      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'خطأ غير معروف' }
            : f
        ));

        toast({
          title: "خطأ في التحميل",
          description: `فشل في تحميل ${file.name}`,
          variant: "destructive"
        });
      }
    }
  }, [uploadFile, validateFile, onFileUpload, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
  }, [handleFileSelect]);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ الرابط إلى الحافظة"
      });
    } catch (error) {
      toast({
        title: "خطأ في النسخ",
        description: "فشل في نسخ الرابط",
        variant: "destructive"
      });
    }
  };

  const retryUpload = useCallback(async (fileId: string) => {
    const fileToRetry = files.find(f => f.id === fileId);
    if (!fileToRetry) return;

    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'uploading', progress: 0, error: undefined }
        : f
    ));

    // في التطبيق الحقيقي، ستحتاج إلى إعادة تحميل الملف الأصلي
    // هنا نحاكي إعادة المحاولة
    try {
      const uploadedUrl = await uploadFile(new File([], fileToRetry.name));
      
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, url: uploadedUrl, progress: 100, status: 'success' }
          : f
      ));

      toast({
        title: "تم إعادة التحميل بنجاح",
        description: `تم تحميل ${fileToRetry.name} بنجاح`
      });

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'خطأ غير معروف' }
          : f
      ));
    }
  }, [files, uploadFile, toast]);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            تحميل الملفات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragging 
                ? "border-primary bg-primary/10" 
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  اسحب وأفلت الملفات هنا
                </p>
                <p className="text-sm text-muted-foreground">
                  أو انقر للاختيار من جهازك
                </p>
              </div>

              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <p>الحد الأقصى لحجم الملف: {maxSize}MB</p>
                <p>الأنواع المدعومة: {allowedTypes.join(', ')}</p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                اختيار الملفات
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={allowedTypes.join(',')}
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>الملفات المحملة ({files.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiles([])}
              >
                مسح الكل
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleString('ar-EG')}
                      </p>
                      
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <Progress value={file.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {file.progress.toFixed(0)}% مكتمل
                          </p>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <p className="text-sm text-destructive mt-1">
                          {file.error}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        file.status === 'success' 
                          ? 'default' 
                          : file.status === 'error' 
                            ? 'destructive' 
                            : 'secondary'
                      }
                    >
                      {file.status === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {file.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {file.status === 'uploading' && <Upload className="w-3 h-3 mr-1" />}
                      {file.status === 'success' ? 'مكتمل' : 
                       file.status === 'error' ? 'خطأ' : 'جاري التحميل'}
                    </Badge>

                    {file.status === 'success' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(file.url)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </>
                    )}

                    {file.status === 'error' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryUpload(file.id)}
                      >
                        إعادة المحاولة
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}