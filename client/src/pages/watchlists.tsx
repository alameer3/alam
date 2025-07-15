import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { AkStyleContentCard } from "@/components/content/ak-style-content-card";
import { 
  Heart, 
  Plus, 
  Search, 
  List, 
  Edit, 
  Trash2, 
  Star, 
  Clock,
  Film,
  Tv,
  Play,
  BookmarkPlus,
  Filter,
  Grid3X3,
  MoreVertical,
  Share2
} from "lucide-react";

interface Watchlist {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  poster?: string;
  items?: WatchlistItem[];
}

interface WatchlistItem {
  id: number;
  contentId: number;
  addedAt: string;
  content: {
    id: number;
    title: string;
    type: string;
    poster: string;
    year: number;
    rating: number;
    duration?: number;
  };
}

export default function Watchlists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("my-lists");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newListIsPublic, setNewListIsPublic] = useState(false);
  const currentUserId = 1;

  const { data: watchlists = [], isLoading: watchlistsLoading } = useQuery<Watchlist[]>({
    queryKey: [`/api/users/${currentUserId}/watchlists`],
  });

  const { data: favorites = [], isLoading: favoritesLoading } = useQuery<WatchlistItem[]>({
    queryKey: [`/api/users/${currentUserId}/favorites`],
  });

  // Mock data for demonstration
  const mockWatchlists: Watchlist[] = [
    {
      id: 1,
      name: "أفلامي المفضلة",
      description: "مجموعة من أفضل الأفلام التي شاهدتها وأحببتها",
      isPublic: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      itemCount: 15,
      poster: "/placeholder-poster.jpg"
    },
    {
      id: 2,
      name: "مسلسلات للمشاهدة لاحقاً",
      description: "قائمة المسلسلات التي أريد مشاهدتها قريباً",
      isPublic: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      itemCount: 8,
      poster: "/placeholder-poster.jpg"
    },
    {
      id: 3,
      name: "كلاسيكيات السينما",
      description: "أعظم الأفلام الكلاسيكية عبر التاريخ",
      isPublic: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      itemCount: 25,
      poster: "/placeholder-poster.jpg"
    }
  ];

  const mockFavorites: WatchlistItem[] = [
    {
      id: 1,
      contentId: 1,
      addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      content: {
        id: 1,
        title: "The Dark Knight",
        type: "movie",
        poster: "/placeholder-poster.jpg",
        year: 2008,
        rating: 9.0,
        duration: 152
      }
    },
    {
      id: 2,
      contentId: 2,
      addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      content: {
        id: 2,
        title: "Breaking Bad",
        type: "series",
        poster: "/placeholder-poster.jpg",
        year: 2008,
        rating: 9.5
      }
    },
    {
      id: 3,
      contentId: 3,
      addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      content: {
        id: 3,
        title: "Inception",
        type: "movie",
        poster: "/placeholder-poster.jpg",
        year: 2010,
        rating: 8.8,
        duration: 148
      }
    }
  ];

  const createWatchlistMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; isPublic: boolean }) => {
      const response = await fetch(`/api/users/${currentUserId}/watchlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create watchlist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/watchlists`] });
      setShowCreateDialog(false);
      setNewListName("");
      setNewListDescription("");
      setNewListIsPublic(false);
      toast({ title: "تم إنشاء قائمة المشاهدة بنجاح", variant: "default" });
    },
  });

  const deleteWatchlistMutation = useMutation({
    mutationFn: async (watchlistId: number) => {
      const response = await fetch(`/api/users/${currentUserId}/watchlists/${watchlistId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete watchlist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/watchlists`] });
      toast({ title: "تم حذف القائمة بنجاح", variant: "default" });
    },
  });

  const handleCreateWatchlist = () => {
    if (!newListName.trim()) {
      toast({ title: "يرجى إدخال اسم القائمة", variant: "destructive" });
      return;
    }
    createWatchlistMutation.mutate({
      name: newListName,
      description: newListDescription,
      isPublic: newListIsPublic
    });
  };

  const filteredWatchlists = mockWatchlists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <List className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                قوائم المشاهدة
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                نظم مشاهداتك وأنشئ قوائم مخصصة
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="البحث في القوائم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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
                    أنشئ قائمة مخصصة لتنظيم محتواك المفضل
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">اسم القائمة</Label>
                    <Input
                      id="name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="مثال: أفلامي المفضلة"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">الوصف (اختياري)</Label>
                    <Textarea
                      id="description"
                      value={newListDescription}
                      onChange={(e) => setNewListDescription(e.target.value)}
                      placeholder="وصف مختصر للقائمة..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="public"
                      checked={newListIsPublic}
                      onChange={(e) => setNewListIsPublic(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="public" className="text-sm">
                      جعل القائمة عامة (يمكن للآخرين رؤيتها)
                    </Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                    >
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
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <TabsTrigger value="my-lists" className="gap-2">
              <List className="h-4 w-4" />
              قوائمي ({mockWatchlists.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              المفضلة ({mockFavorites.length})
            </TabsTrigger>
            <TabsTrigger value="recently-added" className="gap-2">
              <Clock className="h-4 w-4" />
              المضافة حديثاً
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-lists">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWatchlists.map((watchlist) => (
                <Card 
                  key={watchlist.id} 
                  className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <List className="h-12 w-12 mx-auto mb-2 opacity-80" />
                      <h3 className="font-bold text-lg">{watchlist.name}</h3>
                      <p className="text-sm opacity-90">{watchlist.itemCount} عنصر</p>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant={watchlist.isPublic ? "default" : "secondary"} className="text-xs">
                        {watchlist.isPublic ? "عامة" : "خاصة"}
                      </Badge>
                    </div>
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {watchlist.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {watchlist.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>تم التحديث: {new Date(watchlist.updatedAt).toLocaleDateString('ar-EG')}</span>
                        <span>{watchlist.itemCount} عنصر</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 gap-2">
                          <Play className="h-4 w-4" />
                          مشاهدة القائمة
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Edit className="h-4 w-4" />
                          تعديل
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deleteWatchlistMutation.mutate(watchlist.id)}
                          disabled={deleteWatchlistMutation.isPending}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  المحتوى المفضل لديك
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    فلترة
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    شبكة
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockFavorites.map((item) => (
                  <AkStyleContentCard
                    key={item.id}
                    content={{
                      id: item.content.id,
                      title: item.content.title,
                      type: item.content.type,
                      posterUrl: item.content.poster,
                      year: item.content.year,
                      rating: item.content.rating,
                      description: "",
                      duration: item.content.duration,
                      titleArabic: item.content.title,
                      descriptionArabic: "",
                      category: "",
                      genre: "",
                      language: "",
                      quality: "",
                      resolution: "",
                      director: "",
                      cast: "",
                      country: "",
                      episodes: undefined,
                      seasons: undefined,
                      status: "",
                      videoUrl: "",
                      trailerUrl: "",
                      releaseDate: "",
                      createdAt: "",
                      updatedAt: ""
                    }}
                    onClick={() => {}}
                    showType={true}
                    variant="grid"
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recently-added">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                المحتوى المضاف حديثاً
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockFavorites.slice().reverse().map((item) => (
                  <AkStyleContentCard
                    key={`recent-${item.id}`}
                    content={{
                      id: item.content.id,
                      title: item.content.title,
                      type: item.content.type,
                      posterUrl: item.content.poster,
                      year: item.content.year,
                      rating: item.content.rating,
                      description: "",
                      duration: item.content.duration,
                      titleArabic: item.content.title,
                      descriptionArabic: "",
                      category: "",
                      genre: "",
                      language: "",
                      quality: "",
                      resolution: "",
                      director: "",
                      cast: "",
                      country: "",
                      episodes: undefined,
                      seasons: undefined,
                      status: "",
                      videoUrl: "",
                      trailerUrl: "",
                      releaseDate: "",
                      createdAt: "",
                      updatedAt: ""
                    }}
                    onClick={() => {}}
                    showType={true}
                    variant="grid"
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookmarkPlus className="h-5 w-5" />
              إجراءات سريعة
            </CardTitle>
            <CardDescription>
              خيارات مفيدة لإدارة قوائم المشاهدة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                <span>مسح المفضلة</span>
                <span className="text-xs text-slate-500">إزالة جميع العناصر</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Share2 className="h-6 w-6 text-blue-500" />
                <span>مشاركة القوائم</span>
                <span className="text-xs text-slate-500">مشاركة مع الأصدقاء</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Filter className="h-6 w-6 text-green-500" />
                <span>تصدير القوائم</span>
                <span className="text-xs text-slate-500">حفظ نسخة احتياطية</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                <span>القوائم المميزة</span>
                <span className="text-xs text-slate-500">استكشف قوائم مميزة</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}