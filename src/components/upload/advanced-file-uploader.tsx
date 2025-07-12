import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileVideo, Image, Music, FileText, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/layout/ui/card';
import { Badge } from '@/components/layout/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  preview?: string;
  error?: string;
  chunks?: number;
  uploadedChunks?: number;
}

interface AdvancedFileUploaderProps {
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  onUploadComplete?: (files: FileUpload[]) => void;
  enableChunking?: boolean;
  chunkSize?: number; // in bytes
}

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export function AdvancedFileUploader({
  accept = "video/*,image/*,audio/*,.pdf,.doc,.docx",
  maxSize = 500, // 500MB default
  maxFiles = 10,
  onUploadComplete,
  enableChunking = true,
  chunkSize = CHUNK_SIZE
}: AdvancedFileUploaderProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return <FileVideo className="h-8 w-8 text-blue-500" />;
    if (file.type.startsWith('image/')) return <Image className="h-8 w-8 text-green-500" />;
    if (file.type.startsWith('audio/')) return <Music className="h-8 w-8 text-purple-500" />;
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generatePreview = async (file: File): Promise<string | undefined> => {
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }
    return undefined;
  };

  const uploadFileInChunks = async (fileUpload: FileUpload): Promise<void> => {
    const { file } = fileUpload;
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    try {
      // Initialize upload session
      const initResponse = await fetch('/api/uploads/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          totalChunks
        })
      });

      if (!initResponse.ok) throw new Error('Failed to initialize upload');
      
      const { uploadId } = await initResponse.json();

      // Update file upload with chunks info
      setFiles(prev => prev.map(f => 
        f.id === fileUpload.id 
          ? { ...f, chunks: totalChunks, uploadedChunks: 0, status: 'uploading' }
          : f
      ));

      // Upload chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('uploadId', uploadId);

        const chunkResponse = await fetch('/api/uploads/chunk', {
          method: 'POST',
          body: formData
        });

        if (!chunkResponse.ok) throw new Error(`Failed to upload chunk ${chunkIndex}`);

        // Update progress
        const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id 
            ? { ...f, progress, uploadedChunks: chunkIndex + 1 }
            : f
        ));
      }

      // Complete upload
      const completeResponse = await fetch('/api/uploads/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId })
      });

      if (!completeResponse.ok) throw new Error('Failed to complete upload');

      // Mark as completed
      setFiles(prev => prev.map(f => 
        f.id === fileUpload.id 
          ? { ...f, status: 'completed', progress: 100 }
          : f
      ));

      toast({
        title: "تم رفع الملف بنجاح",
        description: `تم رفع ${file.name} بنجاح`
      });

    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileUpload.id 
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'خطأ في الرفع' }
          : f
      ));

      toast({
        title: "خطأ في رفع الملف",
        description: `فشل في رفع ${file.name}`,
        variant: "destructive"
      });
    }
  };

  const uploadFileSimple = async (fileUpload: FileUpload): Promise<void> => {
    const { file } = fileUpload;
    
    try {
      setFiles(prev => prev.map(f => 
        f.id === fileUpload.id ? { ...f, status: 'uploading' } : f
      ));

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploads/simple', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload file');

      setFiles(prev => prev.map(f => 
        f.id === fileUpload.id 
          ? { ...f, status: 'completed', progress: 100 }
          : f
      ));

      toast({
        title: "تم رفع الملف بنجاح",
        description: `تم رفع ${file.name} بنجاح`
      });

    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileUpload.id 
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'خطأ في الرفع' }
          : f
      ));

      toast({
        title: "خطأ في رفع الملف",
        description: `فشل في رفع ${file.name}`,
        variant: "destructive"
      });
    }
  };

  const handleFiles = async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "حجم الملف كبير جداً",
          description: `${file.name} يتجاوز الحد الأقصى ${maxSize}MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length > maxFiles) {
      toast({
        title: "تجاوز عدد الملفات المسموح",
        description: `الحد الأقصى ${maxFiles} ملفات`,
        variant: "destructive"
      });
      return;
    }

    // Create file upload objects
    const newFiles: FileUpload[] = await Promise.all(
      validFiles.map(async (file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'pending' as const,
        preview: await generatePreview(file)
      }))
    );

    setFiles(prev => [...prev, ...newFiles]);

    // Start uploading
    newFiles.forEach(fileUpload => {
      if (enableChunking && fileUpload.file.size > chunkSize) {
        uploadFileInChunks(fileUpload);
      } else {
        uploadFileSimple(fileUpload);
      }
    });
  };

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
    handleFiles(e.dataTransfer.files);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryUpload = (fileUpload: FileUpload) => {
    setFiles(prev => prev.map(f => 
      f.id === fileUpload.id 
        ? { ...f, status: 'pending', progress: 0, error: undefined }
        : f
    ));

    if (enableChunking && fileUpload.file.size > chunkSize) {
      uploadFileInChunks(fileUpload);
    } else {
      uploadFileSimple(fileUpload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 hover:border-primary'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">رفع الملفات</h3>
            <p className="text-gray-600 mb-4">
              اسحب الملفات هنا أو انقر للاختيار
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              اختيار الملفات
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={accept}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">
              الحد الأقصى: {maxSize}MB لكل ملف، {maxFiles} ملفات كحد أقصى
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>الملفات المرفوعة ({files.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((fileUpload) => (
              <div key={fileUpload.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {fileUpload.preview ? (
                      <img 
                        src={fileUpload.preview} 
                        alt="Preview" 
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(fileUpload.file)
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{fileUpload.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(fileUpload.file.size)}
                      {fileUpload.chunks && (
                        <span className="mr-2">
                          • {fileUpload.uploadedChunks || 0}/{fileUpload.chunks} قطع
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {fileUpload.status === 'completed' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        مكتمل
                      </Badge>
                    )}
                    {fileUpload.status === 'error' && (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        خطأ
                      </Badge>
                    )}
                    {fileUpload.status === 'uploading' && (
                      <Badge variant="secondary">
                        جاري الرفع...
                      </Badge>
                    )}
                    
                    {/* Actions */}
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      {fileUpload.status === 'error' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retryUpload(fileUpload)}
                        >
                          إعادة المحاولة
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(fileUpload.id)}
                        disabled={fileUpload.status === 'uploading'}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {(fileUpload.status === 'uploading' || fileUpload.progress > 0) && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>تقدم الرفع</span>
                      <span>{fileUpload.progress}%</span>
                    </div>
                    <Progress value={fileUpload.progress} className="h-2" />
                  </div>
                )}

                {/* Error Message */}
                {fileUpload.error && (
                  <div className="mt-2 text-sm text-red-600">
                    {fileUpload.error}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}