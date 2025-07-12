import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tags, 
  Folder,
  Hash,
  Save,
  X,
  Search
} from "lucide-react";
import { Genre, Category, InsertGenre, InsertCategory } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CategoryGenreManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCreateGenreDialogOpen, setIsCreateGenreDialogOpen] = useState(false);
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false);
  const [isEditGenreDialogOpen, setIsEditGenreDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch genres
  const { data: genres = [], isLoading: isGenresLoading } = useQuery({
    queryKey: ['/api/genres'],
  });

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Create genre mutation
  const createGenreMutation = useMutation({
    mutationFn: async (genreData: InsertGenre) => {
      return await apiRequest('/api/genres', {
        method: 'POST',
        body: JSON.stringify(genreData)
      });
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء النوع بنجاح",
        description: "تم إضافة النوع الجديد إلى قاعدة البيانات"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/genres'] });
      setIsCreateGenreDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ في إنشاء النوع",
        description: error.message || "حدث خطأ أثناء إضافة النوع",
        variant: "destructive"
      });
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: InsertCategory) => {
      return await apiRequest('/api/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء الفئة بنجاح",
        description: "تم إضافة الفئة الجديدة إلى قاعدة البيانات"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setIsCreateCategoryDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ في إنشاء الفئة",
        description: error.message || "حدث خطأ أثناء إضافة الفئة",
        variant: "destructive"
      });
    }
  });

  // Delete genre mutation
  const deleteGenreMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/genres/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      toast({
        title: "تم حذف النوع بنجاح",
        description: "تم حذف النوع من قاعدة البيانات"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/genres'] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف النوع",
        description: error.message || "حدث خطأ أثناء حذف النوع",
        variant: "destructive"
      });
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/categories/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      toast({
        title: "تم حذف الفئة بنجاح",
        description: "تم حذف الفئة من قاعدة البيانات"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف الفئة",
        description: error.message || "حدث خطأ أثناء حذف الفئة",
        variant: "destructive"
      });
    }
  });

  // Filter genres based on search
  const filteredGenres = genres.filter((genre: Genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter categories based on search
  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الفئات والأنواع</h1>
          <p className="text-muted-foreground">
            إدارة فئات وأنواع المحتوى في المنصة
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="البحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pr-10"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="genres" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="genres" className="flex items-center gap-2">
            <Tags className="w-4 h-4" />
            الأنواع ({genres.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Folder className="w-4 h-4" />
            الفئات ({categories.length})
          </TabsTrigger>
        </TabsList>

        {/* Genres Tab */}
        <TabsContent value="genres" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">أنواع المحتوى</h2>
            <Button
              onClick={() => setIsCreateGenreDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة نوع جديد
            </Button>
          </div>

          {isGenresLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredGenres.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Tags className="w-16 h-16 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">لا توجد أنواع</h3>
                    <p className="text-muted-foreground">
                      قم بإضافة أنواع جديدة لتصنيف المحتوى
                    </p>
                  </div>
                  <Button onClick={() => setIsCreateGenreDialogOpen(true)}>
                    إضافة نوع جديد
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGenres.map((genre: Genre) => (
                <Card key={genre.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{genre.name}</h3>
                      <Badge variant="secondary">
                        <Hash className="w-3 h-3 mr-1" />
                        {genre.id}
                      </Badge>
                    </div>
                    
                    {genre.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {genre.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedGenre(genre);
                          setIsEditGenreDialogOpen(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
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
                              هل أنت متأكد من حذف النوع "{genre.name}"؟ قد يؤثر هذا على المحتوى المرتبط به.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteGenreMutation.mutate(genre.id)}
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

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">فئات المحتوى</h2>
            <Button
              onClick={() => setIsCreateCategoryDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة فئة جديدة
            </Button>
          </div>

          {isCategoriesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Folder className="w-16 h-16 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">لا توجد فئات</h3>
                    <p className="text-muted-foreground">
                      قم بإضافة فئات جديدة لتصنيف المحتوى
                    </p>
                  </div>
                  <Button onClick={() => setIsCreateCategoryDialogOpen(true)}>
                    إضافة فئة جديدة
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCategories.map((category: Category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant="secondary">
                        <Hash className="w-3 h-3 mr-1" />
                        {category.id}
                      </Badge>
                    </div>
                    
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsEditCategoryDialogOpen(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
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
                              هل أنت متأكد من حذف الفئة "{category.name}"؟ قد يؤثر هذا على المحتوى المرتبط به.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCategoryMutation.mutate(category.id)}
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

      {/* Create Genre Dialog */}
      <GenreFormDialog
        isOpen={isCreateGenreDialogOpen}
        onClose={() => setIsCreateGenreDialogOpen(false)}
        onSubmit={(data) => createGenreMutation.mutate(data)}
        isLoading={createGenreMutation.isPending}
        mode="create"
      />

      {/* Create Category Dialog */}
      <CategoryFormDialog
        isOpen={isCreateCategoryDialogOpen}
        onClose={() => setIsCreateCategoryDialogOpen(false)}
        onSubmit={(data) => createCategoryMutation.mutate(data)}
        isLoading={createCategoryMutation.isPending}
        mode="create"
      />

      {/* Edit Genre Dialog */}
      {selectedGenre && (
        <GenreFormDialog
          isOpen={isEditGenreDialogOpen}
          onClose={() => {
            setIsEditGenreDialogOpen(false);
            setSelectedGenre(null);
          }}
          onSubmit={(data) => {
            // Update logic would go here

          }}
          isLoading={false}
          mode="edit"
          initialData={selectedGenre}
        />
      )}

      {/* Edit Category Dialog */}
      {selectedCategory && (
        <CategoryFormDialog
          isOpen={isEditCategoryDialogOpen}
          onClose={() => {
            setIsEditCategoryDialogOpen(false);
            setSelectedCategory(null);
          }}
          onSubmit={(data) => {
            // Update logic would go here

          }}
          isLoading={false}
          mode="edit"
          initialData={selectedCategory}
        />
      )}
    </div>
  );
}

// Genre Form Dialog Component
interface GenreFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsertGenre) => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  initialData?: Genre;
}

function GenreFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  mode,
  initialData
}: GenreFormDialogProps) {
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || '',
    description: initialData?.description || ''
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'إضافة نوع جديد' : 'تحرير النوع'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'قم بإدخال بيانات النوع الجديد'
              : 'قم بتحرير بيانات النوع'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم النوع</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="مثال: أكشن، كوميديا، دراما"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف (اختياري)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف مختصر للنوع"
            />
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

// Category Form Dialog Component
interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsertCategory) => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  initialData?: Category;
}

function CategoryFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  mode,
  initialData
}: CategoryFormDialogProps) {
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || '',
    description: initialData?.description || ''
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'إضافة فئة جديدة' : 'تحرير الفئة'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'قم بإدخال بيانات الفئة الجديدة'
              : 'قم بتحرير بيانات الفئة'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم الفئة</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="مثال: عربي، أجنبي، هندي"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف (اختياري)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف مختصر للفئة"
            />
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