import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Edit, Trash2, Search, Filter, Grid, List, Eye, Star, Calendar, Clock 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Content, InsertContent } from '@shared/schema';

interface ContentFormData {
  title: string;
  description: string;
  type: 'movie' | 'series' | 'tv' | 'misc';
  year: number;
  language: string;
  quality: string;
  poster: string;
  trailer: string;
  duration: number;
  rating: number;
  category: string;
  genre: string;
}

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    type: 'movie',
    year: new Date().getFullYear(),
    language: 'عربي',
    quality: 'HD',
    poster: '',
    trailer: '',
    duration: 0,
    rating: 0,
    category: '',
    genre: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all content
  const { data: contentData, isLoading } = useQuery({
    queryKey: ['/api/content/all'],
    queryFn: async () => {
      const response = await fetch('/api/content/all');
      return response.json();
    }
  });

  // Fetch genres and categories
  const { data: genres } = useQuery({
    queryKey: ['/api/genres'],
    queryFn: async () => {
      const response = await fetch('/api/genres');
      return response.json();
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    }
  });

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async (data: InsertContent) => {
      return apiRequest('/api/content', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/all'] });
      toast({
        title: "تم إنشاء المحتوى بنجاح",
        description: "تمت إضافة المحتوى الجديد إلى قاعدة البيانات"
      });
      setShowAddDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "خطأ في إنشاء المحتوى",
        description: "حدث خطأ أثناء إضافة المحتوى",
        variant: "destructive"
      });
    }
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertContent> }) => {
      return apiRequest(`/api/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/all'] });
      toast({
        title: "تم تحديث المحتوى بنجاح",
        description: "تم حفظ التغييرات بنجاح"
      });
      setEditingContent(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث المحتوى",
        description: "حدث خطأ أثناء تحديث المحتوى",
        variant: "destructive"
      });
    }
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/content/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/all'] });
      toast({
        title: "تم حذف المحتوى بنجاح",
        description: "تم حذف المحتوى من قاعدة البيانات"
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف المحتوى",
        description: "حدث خطأ أثناء حذف المحتوى",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'movie',
      year: new Date().getFullYear(),
      language: 'عربي',
      quality: 'HD',
      poster: '',
      trailer: '',
      duration: 0,
      rating: 0,
      category: '',
      genre: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contentData: InsertContent = {
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingContent) {
      updateContentMutation.mutate({ id: editingContent.id, data: contentData });
    } else {
      createContentMutation.mutate(contentData);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      description: content.description || '',
      type: content.type as 'movie' | 'series' | 'tv' | 'misc',
      year: content.year,
      language: content.language || 'عربي',
      quality: content.quality || 'HD',
      poster: content.poster || '',
      trailer: content.trailer || '',
      duration: content.duration || 0,
      rating: content.rating || 0,
      category: content.category || '',
      genre: content.genre || ''
    });
    setShowAddDialog(true);
  };

  const handleDelete = (id: number) => {
    // TODO: استبدال window.confirm بـ Dialog component آمن
    if (confirm('هل أنت متأكد من حذف هذا المحتوى؟')) {
      deleteContentMutation.mutate(id);
    }
  };

  const filteredContent = contentData?.content?.filter((item: Content) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  }) || [];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie': return 'bg-blue-500';
      case 'series': return 'bg-green-500';
      case 'tv': return 'bg-purple-500';
      case 'misc': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'movie': return 'فيلم';
      case 'series': return 'مسلسل';
      case 'tv': return 'تلفزيون';
      case 'misc': return 'منوعات';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة المحتوى</h2>
          <p className="text-muted-foreground">
            إضافة وتعديل وحذف المحتوى
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingContent(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة محتوى جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}
              </DialogTitle>
              <DialogDescription>
                {editingContent ? 'قم بتحديث بيانات المحتوى' : 'قم بإدخال بيانات المحتوى الجديد'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">العنوان</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">النوع</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movie">فيلم</SelectItem>
                      <SelectItem value="series">مسلسل</SelectItem>
                      <SelectItem value="tv">تلفزيون</SelectItem>
                      <SelectItem value="misc">منوعات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">السنة</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="language">اللغة</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="عربي">عربي</SelectItem>
                      <SelectItem value="إنجليزي">إنجليزي</SelectItem>
                      <SelectItem value="فرنسي">فرنسي</SelectItem>
                      <SelectItem value="هندي">هندي</SelectItem>
                      <SelectItem value="تركي">تركي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quality">الجودة</Label>
                  <Select value={formData.quality} onValueChange={(value) => setFormData({...formData, quality: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HD">HD</SelectItem>
                      <SelectItem value="Full HD">Full HD</SelectItem>
                      <SelectItem value="4K">4K</SelectItem>
                      <SelectItem value="SD">SD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">المدة (بالدقائق)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="poster">رابط الصورة</Label>
                  <Input
                    id="poster"
                    value={formData.poster}
                    onChange={(e) => setFormData({...formData, poster: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="trailer">رابط الإعلان</Label>
                  <Input
                    id="trailer"
                    value={formData.trailer}
                    onChange={(e) => setFormData({...formData, trailer: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={createContentMutation.isPending || updateContentMutation.isPending}>
                  {editingContent ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="البحث في المحتوى..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="نوع المحتوى" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأنواع</SelectItem>
            <SelectItem value="movie">أفلام</SelectItem>
            <SelectItem value="series">مسلسلات</SelectItem>
            <SelectItem value="tv">تلفزيون</SelectItem>
            <SelectItem value="misc">منوعات</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={selectedView === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={selectedView === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className={selectedView === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredContent.map((item: Content) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge className={`${getTypeColor(item.type)} text-white`}>
                        {getTypeLabel(item.type)}
                      </Badge>
                      <span>{item.year}</span>
                      <span>•</span>
                      <span>{item.language}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{item.viewCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{item.rating || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{item.duration || 0} دقيقة</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredContent.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">لا توجد نتائج مطابقة للبحث</p>
        </div>
      )}
    </div>
  );
}