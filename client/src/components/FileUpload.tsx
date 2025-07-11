import { useState, useRef } from 'react';
import { Upload, X, Play, Pause, CheckCircle, AlertCircle, FileVideo, FileImage, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  uploadId?: number;
  preview?: string;
}

interface FileUploadProps {
  onUploadComplete?: (uploadId: number) => void;
  acceptedTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
}

export default function FileUpload({ 
  onUploadComplete, 
  acceptedTypes = ['video/*', 'image/*', 'text/plain'],
  maxFileSize = 2 * 1024 * 1024 * 1024, // 2GB
  multiple = true 
}: FileUploadProps) {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newUploads: UploadFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size
      if (file.size > maxFileSize) {
        toast({
          title: "حجم الملف كبير جداً",
          description: `حجم الملف يجب أن يكون أقل من ${Math.round(maxFileSize / (1024 * 1024 * 1024))} جيجابايت`,
          variant: "destructive",
        });
        continue;
      }

      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        toast({
          title: "نوع الملف غير مدعوم",
          description: "يرجى اختيار ملفات الفيديو، الصور، أو الترجمات فقط",
          variant: "destructive",
        });
        continue;
      }

      const uploadFile: UploadFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'pending'
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploads(prev => 
            prev.map(u => u.id === uploadFile.id ? { ...u, preview: e.target?.result as string } : u)
          );
        };
        reader.readAsDataURL(file);
      }

      newUploads.push(uploadFile);
    }

    setUploads(prev => [...prev, ...newUploads]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const uploadFile = async (uploadFile: UploadFile) => {
    const formData = new FormData();
    formData.append('file', uploadFile.file);
    formData.append('compressionLevel', compressionLevel);
    formData.append('userId', '1'); // Default user for now

    try {
      setUploads(prev => 
        prev.map(u => u.id === uploadFile.id ? { ...u, status: 'uploading' } : u)
      );

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشل في رفع الملف');
      }

      const result = await response.json();
      
      setUploads(prev => 
        prev.map(u => u.id === uploadFile.id ? { 
          ...u, 
          status: 'processing', 
          uploadId: result.id,
          progress: 50 
        } : u)
      );

      // Poll for upload progress
      pollUploadProgress(uploadFile.id, result.id);

      onUploadComplete?.(result.id);
    } catch (error) {
      console.error('Upload error:', error);
      setUploads(prev => 
        prev.map(u => u.id === uploadFile.id ? { ...u, status: 'failed' } : u)
      );
      toast({
        title: "فشل في رفع الملف",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  const pollUploadProgress = async (fileId: string, uploadId: number) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/uploads/${uploadId}`);
        if (!response.ok) return;

        const upload = await response.json();
        
        setUploads(prev => 
          prev.map(u => u.id === fileId ? { 
            ...u, 
            progress: upload.uploadProgress || 0,
            status: upload.uploadStatus === 'completed' ? 'completed' : 
                   upload.uploadStatus === 'failed' ? 'failed' : 'processing'
          } : u)
        );

        if (upload.uploadStatus === 'completed' || upload.uploadStatus === 'failed') {
          clearInterval(pollInterval);
          
          if (upload.uploadStatus === 'completed') {
            toast({
              title: "تم رفع الملف بنجاح",
              description: `تم رفع ومعالجة الملف ${upload.originalName} بنجاح`,
            });
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);

    // Clear interval after 5 minutes
    setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
  };

  const uploadAllFiles = () => {
    uploads.filter(u => u.status === 'pending').forEach(uploadFile);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return <FileVideo className="w-8 h-8" />;
    if (file.type.startsWith('image/')) return <FileImage className="w-8 h-8" />;
    return <FileText className="w-8 h-8" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'uploading': 
      case 'processing': return <Play className="w-5 h-5 text-blue-500" />;
      default: return <Pause className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'uploading': return 'جاري الرفع';
      case 'processing': return 'جاري المعالجة';
      case 'completed': return 'مكتمل';
      case 'failed': return 'فشل';
      default: return status;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            رفع الملفات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Compression Level */}
            <div className="space-y-2">
              <Label>مستوى الضغط (للفيديوهات)</Label>
              <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون ضغط</SelectItem>
                  <SelectItem value="low">ضغط منخفض</SelectItem>
                  <SelectItem value="medium">ضغط متوسط</SelectItem>
                  <SelectItem value="high">ضغط عالي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-700'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">اسحب الملفات هنا أو انقر للاختيار</p>
              <p className="text-sm text-gray-500 mb-4">
                يدعم ملفات الفيديو، الصور، والترجمات (حتى 2 جيجابايت)
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                اختر الملفات
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={acceptedTypes.join(',')}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Upload Button */}
            {uploads.length > 0 && (
              <div className="flex justify-center">
                <Button
                  onClick={uploadAllFiles}
                  disabled={uploads.filter(u => u.status === 'pending').length === 0}
                  className="w-full sm:w-auto"
                >
                  رفع جميع الملفات ({uploads.filter(u => u.status === 'pending').length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>قائمة الرفع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {upload.preview ? (
                      <img 
                        src={upload.preview} 
                        alt={upload.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(upload.file)
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{upload.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(upload.file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(upload.status)}
                      <span className="text-sm">{getStatusText(upload.status)}</span>
                    </div>
                    {(upload.status === 'uploading' || upload.status === 'processing') && (
                      <Progress value={upload.progress} className="h-2" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpload(upload.id)}
                      disabled={upload.status === 'uploading' || upload.status === 'processing'}
                    >
                      <X className="w-4 h-4" />
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