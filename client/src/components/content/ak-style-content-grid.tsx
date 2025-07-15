import { AkStyleContentCard } from "./ak-style-content-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Content {
  id: number;
  title: string;
  titleArabic?: string;
  type: string;
  poster_url?: string;
  rating?: number;
  release_year?: number;
  quality?: string;
  genres?: string[];
  categories?: string[];
}

interface AkStyleContentGridProps {
  content: Content[];
  loading?: boolean;
  error?: Error | null;
  columns?: number;
}

export default function AkStyleContentGrid({
  content,
  loading = false,
  error = null,
  columns = 6
}: AkStyleContentGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-${columns} gap-6`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[2/3] rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">حدث خطأ في تحميل المحتوى</p>
        <p className="text-gray-600 text-sm mt-2">يرجى المحاولة مرة أخرى</p>
      </div>
    );
  }

  if (!content || content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">لا يوجد محتوى متاح</p>
      </div>
    );
  }

  const getContentLink = (item: Content) => {
    const slugTitle = item.titleArabic || item.title;
    switch (item.type) {
      case 'movie':
        return `/movie/${item.id}/${slugTitle}`;
      case 'series':
        return `/series/${item.id}/${slugTitle}`;
      case 'television':
        return `/shows/${item.id}/${slugTitle}`;
      case 'misc':
        return `/mix/${item.id}/${slugTitle}`;
      default:
        return `/content/${item.id}/${slugTitle}`;
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-${columns} gap-6`}>
      {content.map((item) => (
        <AkStyleContentCard
          key={item.id}
          content={item}
          href={getContentLink(item)}
        />
      ))}
    </div>
  );
}