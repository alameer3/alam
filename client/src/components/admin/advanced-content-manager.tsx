import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Input } from "@/components/layout/ui/input";
import { Label } from "@/components/layout/ui/label";
import { Textarea } from "@/components/layout/ui/textarea";
import { Badge } from "@/components/layout/ui/badge";
import { Switch } from "@/components/layout/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/layout/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/layout/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/layout/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/layout/ui/alert-dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  Download,
  Filter,
  Search,
  Calendar,
  Star,
  PlayCircle,
  Film,
  Tv,
  Monitor,
  Folder,
  Save,
  X
} from "lucide-react";
import { Content, InsertContent } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AdvancedContentManagerProps {
  initialType?: string;
}

export default function AdvancedContentManager({ initialType = "movie" }: AdvancedContentManagerProps) {
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch content data
  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: ['/api/content', selectedType, currentPage, filterStatus, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        status: filterStatus !== 'all' ? filterStatus : '',
        sortBy,
        sortOrder
      });
      
      const response = await apiRequest(`/api/content/${selectedType}?${params}`);
      return response;
    }
  });

  // Fetch categories and genres
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: genres } = useQuery({
    queryKey: ['/api/genres'],
  });

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async (contentData: InsertContent) => {
      return await apiRequest('/api/content', {
        method: 'POST',
        body: JSON.stringify(contentData)
      });
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء المحتوى بنجاح",
        description: "تم إضافة المحتوى الجديد إلى قاعدة البيانات"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ في إنشاء المحتوى",
        description: error.message || "حدث خطأ أثناء إضافة المحتوى",
        variant: "destructive"
      });
    }
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertContent> }) => {
      return await apiRequest(`/api/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث المحتوى بنجاح",
        description: "تم حفظ التغييرات على المحتوى"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      setIsEditDialogOpen(false);
      setSelectedContent(null);
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث المحتوى",
        description: error.message || "حدث خطأ أثناء تحديث المحتوى",
        variant: "destructive"
      });
    }
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/content/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      toast({
        title: "تم حذف المحتوى بنجاح",
        description: "تم حذف المحتوى من قاعدة البيانات"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف المحتوى",
        description: error.message || "حدث خطأ أثناء حذف المحتوى",
        variant: "destructive"
      });
    }
  });

  // Toggle content status
  const toggleContentStatus = async (content: Content) => {
    await updateContentMutation.mutateAsync({
      id: content.id,
      data: { isActive: !content.isActive }
    });
  };

  // Filter content based on search query
  const filteredContent = contentData?.content?.filter((item: Content) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.titleArabic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && item.isActive) ||
                         (filterStatus === 'inactive' && !item.isActive);
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <Film className="w-4 h-4" />;
      case 'series':
        return <PlayCircle className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'misc':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Folder className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'movie':
        return 'أفلام';
      case 'series':
        return 'مسلسلات';
      case 'tv':
        return 'تلفزيون';
      case 'misc':
        return 'منوعات';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة المحتوى المتقدمة</h1>
          <p className="text-muted-foreground">
            إدارة شاملة للأفلام والمسلسلات والبرامج التلفزيونية
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة محتوى جديد
          </Button>
        </div>
      </div>

      {/* Content Type Tabs */}
      <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="movie" className="flex items-center gap-2">
            <Film className="w-4 h-4" />
            أفلام
          </TabsTrigger>
          <TabsTrigger value="series" className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            مسلسلات
          </TabsTrigger>
          <TabsTrigger value="tv" className="flex items-center gap-2">
            <Tv className="w-4 h-4" />
            تلفزيون
          </TabsTrigger>
          <TabsTrigger value="misc" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            منوعات
          </TabsTrigger>
        </TabsList>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في المحتوى..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">مفعل</SelectItem>
                <SelectItem value="inactive">غير مفعل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {filteredContent.length} عنصر
            </Badge>
          </div>
        </div>

        {/* Content List */}
        <TabsContent value={selectedType} className="space-y-4">
          {isContentLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredContent.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Folder className="w-16 h-16 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">لا يوجد محتوى</h3>
                    <p className="text-muted-foreground">
                      لم يتم العثور على أي محتوى في هذا القسم
                    </p>
                  </div>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    إضافة محتوى جديد
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredContent.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={item.posterUrl || "/api/placeholder/300/400"}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "مفعل" : "غير مفعل"}
                      </Badge>
                      <Badge variant="outline">
                        {item.quality}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.titleArabic}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.releaseDate).getFullYear()}</span>
                        <Star className="w-3 h-3 ml-2" />
                        <span>{item.rating || 'N/A'}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedContent(item);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleContentStatus(item)}
                      >
                        {item.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف "{item.title}"؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteContentMutation.mutate(item.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Content Dialog */}
      <ContentFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={(data) => createContentMutation.mutate(data)}
        isLoading={createContentMutation.isPending}
        mode="create"
        categories={categories || []}
        genres={genres || []}
        defaultType={selectedType}
      />

      {/* Edit Content Dialog */}
      {selectedContent && (
        <ContentFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedContent(null);
          }}
          onSubmit={(data) => updateContentMutation.mutate({ 
            id: selectedContent.id, 
            data 
          })}
          isLoading={updateContentMutation.isPending}
          mode="edit"
          initialData={selectedContent}
          categories={categories || []}
          genres={genres || []}
        />
      )}
    </div>
  );
}

// Content Form Dialog Component
interface ContentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  initialData?: Content;
  categories: any[];
  genres: any[];
  defaultType?: string;
}

function ContentFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  mode,
  initialData,
  categories,
  genres,
  defaultType = 'movie'
}: ContentFormDialogProps) {
  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    titleArabic: initialData?.titleArabic || '',
    description: initialData?.description || '',
    type: initialData?.type || defaultType,
    releaseDate: initialData?.releaseDate || new Date().toISOString().split('T')[0],
    duration: initialData?.duration || 0,
    language: initialData?.language || 'Arabic',
    quality: initialData?.quality || 'HD',
    resolution: initialData?.resolution || '1080p',
    rating: initialData?.rating || 0,
    posterUrl: initialData?.posterUrl || '',
    trailerUrl: initialData?.trailerUrl || '',
    streamingUrl: initialData?.streamingUrl || '',
    isActive: initialData?.isActive ?? true,
    year: initialData?.year || new Date().getFullYear(),
    country: initialData?.country || 'مصر',
    director: initialData?.director || '',
    cast: initialData?.cast || '',
    genres: initialData?.genres || [],
    categories: initialData?.categories || []
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'إضافة محتوى جديد' : 'تحرير المحتوى'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'قم بإدخال بيانات المحتوى الجديد'
              : 'قم بتحرير بيانات المحتوى'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">العنوان (بالإنجليزية)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="titleArabic">العنوان (بالعربية)</Label>
              <Input
                id="titleArabic"
                value={formData.titleArabic}
                onChange={(e) => handleInputChange('titleArabic', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">النوع</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
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

            <div className="space-y-2">
              <Label htmlFor="language">اللغة</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => handleInputChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arabic">عربي</SelectItem>
                  <SelectItem value="English">إنجليزي</SelectItem>
                  <SelectItem value="Hindi">هندي</SelectItem>
                  <SelectItem value="Turkish">تركي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quality">الجودة</Label>
              <Select
                value={formData.quality}
                onValueChange={(value) => handleInputChange('quality', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4K">4K</SelectItem>
                  <SelectItem value="FHD">FHD</SelectItem>
                  <SelectItem value="HD">HD</SelectItem>
                  <SelectItem value="SD">SD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="releaseDate">تاريخ الإصدار</Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => handleInputChange('releaseDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">المدة (بالدقائق)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">التقييم</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="posterUrl">رابط الصورة</Label>
              <Input
                id="posterUrl"
                value={formData.posterUrl}
                onChange={(e) => handleInputChange('posterUrl', e.target.value)}
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trailerUrl">رابط المقطع الدعائي</Label>
              <Input
                id="trailerUrl"
                value={formData.trailerUrl}
                onChange={(e) => handleInputChange('trailerUrl', e.target.value)}
                placeholder="https://example.com/trailer.mp4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="streamingUrl">رابط المشاهدة</Label>
            <Input
              id="streamingUrl"
              value={formData.streamingUrl}
              onChange={(e) => handleInputChange('streamingUrl', e.target.value)}
              placeholder="https://example.com/stream.mp4"
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label>محتوى مفعل</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'جاري الحفظ...' : mode === 'create' ? 'إنشاء' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}