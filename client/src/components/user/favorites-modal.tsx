import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/layout/ui/dialog";
import { Button } from "@/components/layout/ui/button";
import { Heart, X } from "lucide-react";
import { Content } from "@shared/schema";
import ContentCard from "@/components/content/content-card";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContentClick: (content: Content) => void;
}

export default function FavoritesModal({ isOpen, onClose, onContentClick }: FavoritesModalProps) {
  // Mock favorites data - in a real app, this would come from user's favorites
  const favorites: Content[] = [
    {
      id: 1,
      title: "The Dark Knight",
      titleArabic: "فارس الظلام",
      description: "A superhero movie about Batman",
      descriptionArabic: "فيلم عن باتمان والجوكر",
      type: "movie",
      year: 2008,
      language: "English",
      quality: "HD",
      resolution: "1080p",
      rating: "9.0",
      duration: 152,
      episodes: 0,
      posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
      videoUrl: "",
      downloadUrl: "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: "Breaking Bad",
      titleArabic: "بريكنغ باد",
      description: "A chemistry teacher becomes a drug dealer",
      descriptionArabic: "مدرس كيمياء يصبح تاجر مخدرات",
      type: "series",
      year: 2008,
      language: "English",
      quality: "HD",
      resolution: "1080p",
      rating: "9.5",
      duration: 0,
      episodes: 62,
      posterUrl: "https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=400&h=600&fit=crop",
      videoUrl: "",
      downloadUrl: "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const handleContentClick = (content: Content) => {
    onContentClick(content);
    onClose();
  };

  const removeFavorite = (contentId: number) => {
    // In a real app, this would remove from user's favorites
    console.log("Remove from favorites:", contentId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            قائمة المفضلة
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((item) => (
                <div key={item.id} className="relative group">
                  <ContentCard
                    content={item}
                    onClick={handleContentClick}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFavorite(item.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">لا توجد عناصر في المفضلة</p>
              <p className="text-gray-500 text-sm mt-2">
                اضغط على أيقونة القلب في أي محتوى لإضافته إلى المفضلة
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}