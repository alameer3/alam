import AkStyleHeroNew from "./ak-style-hero-new";
import AkEnhancedContentSections from "./ak-enhanced-content-sections";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Clock, Film, Video, Tv, Globe } from "lucide-react";

export default function AkAuthenticHomepage() {
  const { data: stats } = useQuery({
    queryKey: ["/api/content/stats"],
  });

  // Enhanced sections configuration
  const contentSections = [
    {
      title: "اضيف حديثاً",
      endpoint: "/api/content/latest",
      viewAllLink: "/ones",
      type: "movies" as const,
      icon: Clock,
      color: "text-blue-400",
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      title: "الأفلام المميزة",
      endpoint: "/api/content/featured",
      viewAllLink: "/movies",
      type: "movies" as const,
      icon: Film,
      color: "text-red-400",
      gradient: "bg-gradient-to-r from-red-500 to-red-600"
    },
    {
      title: "المسلسلات الشائعة",
      endpoint: "/api/content/trending",
      viewAllLink: "/series",
      type: "series" as const,
      icon: Video,
      color: "text-green-400",
      gradient: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "البرامج التلفزيونية",
      endpoint: "/api/content/shows",
      viewAllLink: "/shows",
      type: "shows" as const,
      icon: Tv,
      color: "text-purple-400",
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      title: "المحتوى المنوع",
      endpoint: "/api/content/mix",
      viewAllLink: "/mix",
      type: "mix" as const,
      icon: Globe,
      color: "text-orange-400",
      gradient: "bg-gradient-to-r from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <AkStyleHeroNew />

      {/* Enhanced Content Sections */}
      <AkEnhancedContentSections sections={contentSections} />

      {/* Enhanced Statistics Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              إحصائيات الموقع
            </h2>
            <p className="text-gray-600 text-lg">
              اكتشف كمية المحتوى المتاح في منصتنا
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats?.content?.map((stat: any) => (
              <Card key={stat.type} className="bg-white border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    {stat.type === "movies" && (
                      <div className="bg-blue-500 text-white p-3 rounded-xl mx-auto w-16 h-16 flex items-center justify-center">
                        <Film className="h-8 w-8" />
                      </div>
                    )}
                    {stat.type === "series" && (
                      <div className="bg-green-500 text-white p-3 rounded-xl mx-auto w-16 h-16 flex items-center justify-center">
                        <Video className="h-8 w-8" />
                      </div>
                    )}
                    {stat.type === "shows" && (
                      <div className="bg-purple-500 text-white p-3 rounded-xl mx-auto w-16 h-16 flex items-center justify-center">
                        <Tv className="h-8 w-8" />
                      </div>
                    )}
                    {stat.type === "mix" && (
                      <div className="bg-orange-500 text-white p-3 rounded-xl mx-auto w-16 h-16 flex items-center justify-center">
                        <Globe className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.count}</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.type === "movies" && "فيلم"}
                    {stat.type === "series" && "مسلسل"}
                    {stat.type === "shows" && "برنامج"}
                    {stat.type === "mix" && "محتوى منوع"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-1">اكوام</h3>
            <p className="text-gray-600 text-sm mb-2">الموقع العربي الأول للمشاهدة والتحميل</p>
            <div className="flex items-center justify-center space-x-reverse space-x-4 text-gray-400">
              <span>© 2024 اكوام</span>
              <span>•</span>
              <span>جميع الحقوق محفوظة</span>
              <span>•</span>
              <span>ak.sv</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}