import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Content } from "@shared/schema";
import { AkStyleContentCard } from "@/components/content/ak-style-content-card";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContentClick: (content: Content) => void;
}

export default function SearchModal({ isOpen, onClose, onContentClick }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search', searchQuery, selectedType],
    queryFn: async () => {
      if (!searchQuery.trim()) return { content: [] };
      
      const params = new URLSearchParams({
        q: searchQuery,
        ...(selectedType && { type: selectedType })
      });
      
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: !!searchQuery.trim(),
  });

  const handleContentClick = (content: Content) => {
    onContentClick(content);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            البحث في المحتوى
          </DialogTitle>
          <DialogDescription>
            ابحث عن الأفلام والمسلسلات والبرامج والألعاب والتطبيقات
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="ابحث في جميع أنواع المحتوى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-background"
            >
              <option value="">جميع الأنواع</option>
              <option value="movie">الأفلام</option>
              <option value="series">المسلسلات</option>
              <option value="program">البرامج</option>
              <option value="game">الألعاب</option>
              <option value="application">التطبيقات</option>
              <option value="theater">المسرحيات</option>
              <option value="wrestling">المصارعة</option>
              <option value="sports">الرياضة</option>
            </select>
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-orange-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">جاري البحث...</p>
              </div>
            )}

            {searchResults?.content && searchResults.content.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.content.map((item: Content) => (
                  <AkStyleContentCard
                    key={item.id}
                    content={item}
                    onClick={handleContentClick}
                    showType={true}
                    variant="grid"
                  />
                ))}
              </div>
            )}

            {searchResults?.content && searchResults.content.length === 0 && searchQuery.trim() && (
              <div className="text-center py-8">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">لم يتم العثور على نتائج</p>
                <p className="text-gray-500 text-sm">جرب البحث بكلمات أخرى</p>
              </div>
            )}

            {!searchQuery.trim() && (
              <div className="text-center py-8">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">ابدأ بكتابة اسم الفيلم أو المسلسل</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}