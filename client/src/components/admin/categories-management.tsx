import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Tag, Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Genre, Category, insertGenreSchema, insertCategorySchema } from "@shared/schema";

export default function CategoriesManagement() {
  const [isAddGenreOpen, setIsAddGenreOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [genreForm, setGenreForm] = useState({ name: '', nameArabic: '', description: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', nameArabic: '', description: '' });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch genres
  const { data: genres, isLoading: genresLoading } = useQuery({
    queryKey: ['/api/genres'],
    queryFn: async () => {
      const response = await fetch('/api/genres');
      if (!response.ok) throw new Error('Failed to fetch genres');
      return response.json();
    },
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  // Create genre mutation
  const createGenreMutation = useMutation({
    mutationFn: async (data: typeof genreForm) => {
      const response = await fetch('/api/genres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create genre');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/genres'] });
      toast({ title: "تم إضافة النوع بنجاح" });
      setIsAddGenreOpen(false);
      setGenreForm({ name: '', nameArabic: '', description: '' });
    },
    onError: () => {
      toast({ title: "حدث خطأ", description: "فشل في إضافة النوع", variant: "destructive" });
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: typeof categoryForm) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: "تم إضافة الفئة بنجاح" });
      setIsAddCategoryOpen(false);
      setCategoryForm({ name: '', nameArabic: '', description: '' });
    },
    onError: () => {
      toast({ title: "حدث خطأ", description: "فشل في إضافة الفئة", variant: "destructive" });
    }
  });

  const handleGenreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGenreMutation.mutate(genreForm);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(categoryForm);
  };

  return (
    <div className="space-y-6">
      {/* Genres Section */}
      <Card className="bg-card border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Tag className="w-5 h-5" />
              إدارة الأنواع
            </CardTitle>
            <Dialog open={isAddGenreOpen} onOpenChange={setIsAddGenreOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة نوع جديد
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة نوع جديد</DialogTitle>
                  <DialogDescription>
                    قم بإضافة نوع جديد للمحتوى
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGenreSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="genreName">الاسم بالإنجليزية</Label>
                    <Input
                      id="genreName"
                      value={genreForm.name}
                      onChange={(e) => setGenreForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="مثال: Action"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="genreNameArabic">الاسم بالعربية</Label>
                    <Input
                      id="genreNameArabic"
                      value={genreForm.nameArabic}
                      onChange={(e) => setGenreForm(prev => ({ ...prev, nameArabic: e.target.value }))}
                      placeholder="مثال: أكشن"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="genreDescription">الوصف</Label>
                    <Textarea
                      id="genreDescription"
                      value={genreForm.description}
                      onChange={(e) => setGenreForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="وصف النوع..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    إضافة النوع
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {genresLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {genres?.map((genre: Genre) => (
                <div key={genre.id} className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-white">{genre.nameArabic || genre.name}</h3>
                  <p className="text-sm text-gray-400">{genre.name}</p>
                  {genre.description && (
                    <p className="text-sm text-gray-300 mt-2">{genre.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories Section */}
      <Card className="bg-card border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Folder className="w-5 h-5" />
              إدارة الفئات
            </CardTitle>
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة فئة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة فئة جديدة</DialogTitle>
                  <DialogDescription>
                    قم بإضافة فئة جديدة للمحتوى
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName">الاسم بالإنجليزية</Label>
                    <Input
                      id="categoryName"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="مثال: Arabic"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryNameArabic">الاسم بالعربية</Label>
                    <Input
                      id="categoryNameArabic"
                      value={categoryForm.nameArabic}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, nameArabic: e.target.value }))}
                      placeholder="مثال: عربي"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryDescription">الوصف</Label>
                    <Textarea
                      id="categoryDescription"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="وصف الفئة..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    إضافة الفئة
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories?.map((category: Category) => (
                <div key={category.id} className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-white">{category.nameArabic || category.name}</h3>
                  <p className="text-sm text-gray-400">{category.name}</p>
                  {category.description && (
                    <p className="text-sm text-gray-300 mt-2">{category.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}