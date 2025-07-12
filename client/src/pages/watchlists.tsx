import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { EnhancedContentCard } from "@/components/content/enhanced-content-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List, Heart, Clock, Star, Trash2, Edit, BookmarkPlus } from "lucide-react";
import type { Content } from "@shared/schema";

interface Watchlist {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  items?: Content[];
}

export default function Watchlists() {
  const [selectedWatchlist, setSelectedWatchlist] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false
  });

  // Mock current user ID
  const currentUserId = 1;

  const { data: watchlists = [], isLoading } = useQuery<Watchlist[]>({
    queryKey: [`/api/users/${currentUserId}/watchlists`],
  });

  const { data: watchlistItems = [], isLoading: itemsLoading } = useQuery<Content[]>({
    queryKey: [`/api/watchlists/${selectedWatchlist}/items`],
    enabled: !!selectedWatchlist,
  });

  const createWatchlistMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`/api/users/${currentUserId}/watchlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('فشل في إنشاء القائمة');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/watchlists`] });
      toast({ title: "تم إنشاء القائمة بنجاح", variant: "default" });
      setCreateDialogOpen(false);
      setFormData({ name: "", description: "", isPublic: false });
    },
    onError: () => {
      toast({ title: "خطأ في إنشاء القائمة", variant: "destructive" });
    },
  });

  const deleteWatchlistMutation = useMutation({
    mutationFn: async (watchlistId: number) => {
      const response = await fetch(`/api/watchlists/${watchlistId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('فشل في حذف القائمة');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/watchlists`] });
      toast({ title: "تم حذف القائمة بنجاح", variant: "default" });
      setSelectedWatchlist(null);
    },
    onError: () => {
      toast({ title: "خطأ في حذف القائمة", variant: "destructive" });
    },
  });

  const handleCreateWatchlist = () => {
    if (!formData.name.trim()) {
      toast({ title: "يرجى إدخال اسم القائمة", variant: "destructive" });
      return;
    }
    createWatchlistMutation.mutate(formData);
  };

  const getWatchlistIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('مفضل') || lowerName.includes('favorite')) return Heart;
    if (lowerName.includes('مشاهدة') || lowerName.includes('watch')) return Clock;
    if (lowerName.includes('أفضل') || lowerName.includes('best')) return Star;
    return List;
  };

  const predefinedWatchlists = [
    { id: -1, name: "المفضلة", description: "المحتوى المفضل لديك", isPublic: false, itemCount: 12, icon: Heart },
    { id: -2, name: "شاهد لاحقاً", description: "قائمة المحتوى للمشاهدة لاحقاً", isPublic: false, itemCount: 8, icon: Clock },
    { id: -3, name: "الأفضل هذا العام", description: "أفضل الأفلام والمسلسلات لهذا العام", isPublic: true, itemCount: 15, icon: Star },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              قوائم المشاهدة
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              نظم محتواك المفضل في قوائم مخصصة
            </p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إنشاء قائمة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>إنشاء قائمة مشاهدة جديدة</DialogTitle>
                <DialogDescription>
                  أنشئ قائمة جديدة لتنظيم محتواك المفضل
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">اسم القائمة</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: أفلام الحركة المفضلة"
                  />
                </div>
                <div>
                  <Label htmlFor="description">الوصف (اختياري)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف مختصر للقائمة..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isPublic">جعل القائمة عامة</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button 
                    onClick={handleCreateWatchlist}
                    disabled={createWatchlistMutation.isPending}
                  >
                    إنشاء القائمة
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!selectedWatchlist ? (
          /* Watchlists Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Predefined Watchlists */}
            {predefinedWatchlists.map((list) => {
              const IconComponent = list.icon;
              return (
                <Card 
                  key={list.id}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedWatchlist(list.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{list.name}</CardTitle>
                          {list.isPublic && (
                            <Badge variant="secondary" className="text-xs mt-1">عامة</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {list.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span>{list.itemCount} عنصر</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* User Created Watchlists */}
            {watchlists.map((list) => {
              const IconComponent = getWatchlistIcon(list.name);
              return (
                <Card 
                  key={list.id}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedWatchlist(list.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <IconComponent className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{list.name}</CardTitle>
                          {list.isPublic && (
                            <Badge variant="secondary" className="text-xs mt-1">عامة</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWatchlistMutation.mutate(list.id);
                        }}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {list.description || "قائمة مخصصة"}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span>{list.itemCount} عنصر</span>
                      <span className="text-xs">
                        {new Date(list.updatedAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Selected Watchlist Content */
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedWatchlist(null)}
                      className="gap-2"
                    >
                      ← العودة للقوائم
                    </Button>
                    <div>
                      <CardTitle className="text-xl">
                        {selectedWatchlist > 0 
                          ? watchlists.find(w => w.id === selectedWatchlist)?.name
                          : predefinedWatchlists.find(w => w.id === selectedWatchlist)?.name
                        }
                      </CardTitle>
                      <CardDescription>
                        {watchlistItems.length} عنصر في هذه القائمة
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <BookmarkPlus className="h-4 w-4" />
                      إضافة محتوى
                    </Button>
                    {selectedWatchlist > 0 && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        تعديل القائمة
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                {itemsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : watchlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {watchlistItems.map((content) => (
                      <EnhancedContentCard
                        key={content.id}
                        content={content}
                        showActions={true}
                        className="hover:scale-105 transition-transform duration-200"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <List className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                      القائمة فارغة
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      ابدأ بإضافة محتوى إلى هذه القائمة
                    </p>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة محتوى
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}