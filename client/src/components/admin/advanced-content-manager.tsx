import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Users, 
  Image, 
  Star, 
  Edit, 
  Trash2, 
  Save, 
  X,
  ExternalLink,
  Calendar,
  MapPin
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useToast } from '@/hooks/use-toast';

interface CastMember {
  id: number;
  name: string;
  nameArabic?: string;
  role: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
  imageUrl?: string;
  imdbId?: string;
}

interface ContentImage {
  id: number;
  contentId: number;
  imageUrl: string;
  type: string;
  description?: string;
  descriptionArabic?: string;
  order: number;
}

interface ExternalRating {
  id: number;
  contentId: number;
  source: string;
  rating: string;
  maxRating?: string;
  url?: string;
}

interface Content {
  id: number;
  title: string;
  titleArabic?: string;
  type: string;
}

export default function AdvancedContentManager() {
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('cast');
  const [editingCast, setEditingCast] = useState<CastMember | null>(null);
  const [editingImage, setEditingImage] = useState<ContentImage | null>(null);
  const [editingRating, setEditingRating] = useState<ExternalRating | null>(null);
  const [isAddingCast, setIsAddingCast] = useState(false);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isAddingRating, setIsAddingRating] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // جلب قائمة المحتوى
  const { data: contentResponse, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/content/all'],
    queryFn: async () => {
      const response = await fetch('/api/content/all');
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json();
    }
  });
  
  const contentList = contentResponse?.data || [];

  // جلب أعضاء فريق العمل
  const { data: castResponse, isLoading: castLoading } = useQuery({
    queryKey: ['/api/enhanced/cast-members'],
    queryFn: async () => {
      const response = await fetch('/api/enhanced/cast-members');
      if (!response.ok) throw new Error('Failed to fetch cast members');
      return response.json();
    }
  });
  
  const castMembers = castResponse?.data || [];

  // جلب فريق عمل المحتوى المحدد
  const { data: contentCastResponse, isLoading: contentCastLoading } = useQuery({
    queryKey: ['/api/enhanced/content', selectedContentId, 'cast'],
    queryFn: async () => {
      const response = await fetch(`/api/enhanced/content/${selectedContentId}/cast`);
      if (!response.ok) throw new Error('Failed to fetch content cast');
      return response.json();
    },
    enabled: !!selectedContentId
  });
  
  const contentCast = contentCastResponse?.data || [];

  // جلب صور المحتوى المحدد
  const { data: contentImagesResponse, isLoading: contentImagesLoading } = useQuery({
    queryKey: ['/api/enhanced/content', selectedContentId, 'images'],
    queryFn: async () => {
      const response = await fetch(`/api/enhanced/content/${selectedContentId}/images`);
      if (!response.ok) throw new Error('Failed to fetch content images');
      return response.json();
    },
    enabled: !!selectedContentId
  });
  
  const contentImages = contentImagesResponse?.data || [];

  // جلب تقييمات المحتوى المحدد
  const { data: contentRatingsResponse, isLoading: contentRatingsLoading } = useQuery({
    queryKey: ['/api/enhanced/content', selectedContentId, 'external-ratings'],
    queryFn: async () => {
      const response = await fetch(`/api/enhanced/content/${selectedContentId}/external-ratings`);
      if (!response.ok) throw new Error('Failed to fetch content ratings');
      return response.json();
    },
    enabled: !!selectedContentId
  });
  
  const contentRatings = contentRatingsResponse?.data || [];

  // طفرات للتحديث
  const createCastMutation = useMutation({
    mutationFn: async (data: Partial<CastMember>) => {
      const response = await fetch('/api/enhanced/cast-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('فشل في إنشاء عضو فريق العمل');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/enhanced/cast-members'] });
      setIsAddingCast(false);
      toast({ title: 'تم إضافة عضو فريق العمل بنجاح' });
    }
  });

  const addContentCastMutation = useMutation({
    mutationFn: async (data: { castMemberId: number; character?: string; order: number }) => {
      const response = await fetch(`/api/enhanced/content/${selectedContentId}/cast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('فشل في إضافة عضو فريق العمل للمحتوى');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/enhanced/content', selectedContentId, 'cast'] });
      toast({ title: 'تم ربط عضو فريق العمل بالمحتوى' });
    }
  });

  const addContentImageMutation = useMutation({
    mutationFn: async (data: Partial<ContentImage>) => {
      const response = await fetch(`/api/enhanced/content/${selectedContentId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('فشل في إضافة صورة للمحتوى');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/enhanced/content', selectedContentId, 'images'] });
      setIsAddingImage(false);
      toast({ title: 'تم إضافة الصورة بنجاح' });
    }
  });

  const addExternalRatingMutation = useMutation({
    mutationFn: async (data: Partial<ExternalRating>) => {
      const response = await fetch(`/api/enhanced/content/${selectedContentId}/external-ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('فشل في إضافة التقييم الخارجي');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/enhanced/content', selectedContentId, 'external-ratings'] });
      setIsAddingRating(false);
      toast({ title: 'تم إضافة التقييم الخارجي بنجاح' });
    }
  });

  const selectedContent = contentList?.find(c => c.id === selectedContentId);

  if (contentLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            إدارة المحتوى المتطور
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>اختر المحتوى</Label>
              <Select value={selectedContentId?.toString() || ''} onValueChange={(value) => setSelectedContentId(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر محتوى للإدارة" />
                </SelectTrigger>
                <SelectContent>
                  {contentList?.map((content) => (
                    <SelectItem key={content.id} value={content.id.toString()}>
                      {content.title} ({content.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedContent && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">{selectedContent.title}</h3>
                {selectedContent.titleArabic && (
                  <p className="text-sm text-muted-foreground">{selectedContent.titleArabic}</p>
                )}
                <Badge variant="secondary" className="mt-2">{selectedContent.type}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedContentId && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cast" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              فريق العمل
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              الصور
            </TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              التقييمات
            </TabsTrigger>
          </TabsList>

          {/* إدارة فريق العمل */}
          <TabsContent value="cast" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">فريق العمل</h3>
              <div className="flex gap-2">
                <Dialog open={isAddingCast} onOpenChange={setIsAddingCast}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة عضو جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إضافة عضو فريق عمل جديد</DialogTitle>
                      <DialogDescription>
                        أضف معلومات عضو فريق العمل الجديد
                      </DialogDescription>
                    </DialogHeader>
                    <CastMemberForm 
                      onSubmit={(data) => createCastMutation.mutate(data)}
                      isLoading={createCastMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
                
                <Select onValueChange={(value) => {
                  if (value && contentCast) {
                    const order = contentCast.length;
                    addContentCastMutation.mutate({
                      castMemberId: parseInt(value),
                      order
                    });
                  }
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="ربط عضو موجود" />
                  </SelectTrigger>
                  <SelectContent>
                    {castMembers?.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name} - {member.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {contentCastLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentCast?.map((cast: ContentCast & { castMember: CastMember }) => (
                  <Card key={cast.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                          {cast.castMember.imageUrl ? (
                            <img 
                              src={cast.castMember.imageUrl} 
                              alt={cast.castMember.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-1 text-right">
                          <h4 className="font-medium">{cast.castMember.name}</h4>
                          <p className="text-sm text-muted-foreground">{cast.castMember.role}</p>
                          {cast.character && (
                            <p className="text-xs text-primary">{cast.character}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* إدارة الصور */}
          <TabsContent value="images" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">معرض الصور</h3>
              <Dialog open={isAddingImage} onOpenChange={setIsAddingImage}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة صورة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة صورة جديدة</DialogTitle>
                    <DialogDescription>
                      أضف صورة جديدة للمحتوى
                    </DialogDescription>
                  </DialogHeader>
                  <ContentImageForm 
                    onSubmit={(data) => addContentImageMutation.mutate(data)}
                    isLoading={addContentImageMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {contentImagesLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {contentImages?.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted">
                      <img 
                        src={image.imageUrl} 
                        alt={image.description || 'صورة المحتوى'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-2">
                      <Badge variant="outline" size="sm">{image.type}</Badge>
                      {image.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {image.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* إدارة التقييمات */}
          <TabsContent value="ratings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">التقييمات الخارجية</h3>
              <Dialog open={isAddingRating} onOpenChange={setIsAddingRating}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة تقييم
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة تقييم خارجي</DialogTitle>
                    <DialogDescription>
                      أضف تقييم من مصدر خارجي
                    </DialogDescription>
                  </DialogHeader>
                  <ExternalRatingForm 
                    onSubmit={(data) => addExternalRatingMutation.mutate(data)}
                    isLoading={addExternalRatingMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {contentRatingsLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {contentRatings?.map((rating) => (
                  <Card key={rating.id}>
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold capitalize mb-2">
                        {rating.source.replace('_', ' ')}
                      </h4>
                      <div className="text-2xl font-bold text-primary mb-2">
                        {rating.rating}
                        {rating.maxRating && <span className="text-sm text-muted-foreground">/{rating.maxRating}</span>}
                      </div>
                      {rating.url && (
                        <Button variant="outline" size="sm" onClick={() => rating.url && window.open(rating.url, '_blank', 'noopener,noreferrer')}>
                          <ExternalLink className="h-3 w-3 mr-1" />
                          زيارة
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// مكون نموذج عضو فريق العمل
function CastMemberForm({ onSubmit, isLoading }: { onSubmit: (data: InsertCastMember) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    nameArabic: '',
    role: '',
    biography: '',
    birthDate: '',
    nationality: '',
    imageUrl: '',
    imdbId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>الاسم</Label>
          <Input 
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label>الاسم بالعربية</Label>
          <Input 
            value={formData.nameArabic}
            onChange={(e) => setFormData(prev => ({ ...prev, nameArabic: e.target.value }))}
          />
        </div>
      </div>
      
      <div>
        <Label>الدور</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الدور" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="actor">ممثل</SelectItem>
            <SelectItem value="actress">ممثلة</SelectItem>
            <SelectItem value="director">مخرج</SelectItem>
            <SelectItem value="producer">منتج</SelectItem>
            <SelectItem value="writer">كاتب</SelectItem>
            <SelectItem value="cinematographer">مدير تصوير</SelectItem>
            <SelectItem value="composer">ملحن</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>السيرة الذاتية</Label>
        <Textarea 
          value={formData.biography}
          onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
          placeholder="نبذة مختصرة عن السيرة الذاتية"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>تاريخ الميلاد</Label>
          <Input 
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
          />
        </div>
        <div>
          <Label>الجنسية</Label>
          <Input 
            value={formData.nationality}
            onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label>رابط الصورة</Label>
        <Input 
          value={formData.imageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label>معرف IMDb</Label>
        <Input 
          value={formData.imdbId}
          onChange={(e) => setFormData(prev => ({ ...prev, imdbId: e.target.value }))}
          placeholder="nm0000123"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : <Save className="h-4 w-4 mr-2" />}
          حفظ
        </Button>
      </div>
    </form>
  );
}

// مكون نموذج صورة المحتوى
function ContentImageForm({ onSubmit, isLoading }: { onSubmit: (data: InsertContentImage) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    imageUrl: '',
    type: '',
    description: '',
    descriptionArabic: '',
    order: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>رابط الصورة</Label>
        <Input 
          value={formData.imageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div>
        <Label>نوع الصورة</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الصورة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="poster">بوستر</SelectItem>
            <SelectItem value="backdrop">خلفية</SelectItem>
            <SelectItem value="still">لقطة من العمل</SelectItem>
            <SelectItem value="behind_scenes">كواليس</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>الوصف</Label>
        <Input 
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="وصف الصورة"
        />
      </div>

      <div>
        <Label>الوصف بالعربية</Label>
        <Input 
          value={formData.descriptionArabic}
          onChange={(e) => setFormData(prev => ({ ...prev, descriptionArabic: e.target.value }))}
          placeholder="وصف الصورة بالعربية"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : <Save className="h-4 w-4 mr-2" />}
          حفظ
        </Button>
      </div>
    </form>
  );
}

// مكون نموذج التقييم الخارجي
function ExternalRatingForm({ onSubmit, isLoading }: { onSubmit: (data: InsertExternalRating) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    source: '',
    rating: '',
    maxRating: '',
    url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>المصدر</Label>
        <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="اختر مصدر التقييم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imdb">IMDb</SelectItem>
            <SelectItem value="rotten_tomatoes">Rotten Tomatoes</SelectItem>
            <SelectItem value="metacritic">Metacritic</SelectItem>
            <SelectItem value="letterboxd">Letterboxd</SelectItem>
            <SelectItem value="other">أخرى</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>التقييم</Label>
          <Input 
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
            placeholder="8.5"
            required
          />
        </div>
        <div>
          <Label>أقصى تقييم</Label>
          <Input 
            value={formData.maxRating}
            onChange={(e) => setFormData(prev => ({ ...prev, maxRating: e.target.value }))}
            placeholder="10"
          />
        </div>
      </div>

      <div>
        <Label>رابط المصدر</Label>
        <Input 
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://www.imdb.com/title/tt1234567/"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : <Save className="h-4 w-4 mr-2" />}
          حفظ
        </Button>
      </div>
    </form>
  );
}