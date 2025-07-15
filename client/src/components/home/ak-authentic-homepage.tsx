import AkEnhancedHero from "./ak-enhanced-hero";
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
    <div className="min-h-screen bg-slate-900">
      {/* Enhanced Hero Section */}
      <AkEnhancedHero />

      {/* Enhanced Content Sections */}
      <AkEnhancedContentSections sections={contentSections} />

      {/* Enhanced Statistics Section */}
      <div className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              إحصائيات الموقع
            </h2>
            <p className="text-gray-400 text-lg">
              اكتشف كمية المحتوى المتاح في منصتنا
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats?.content?.map((stat: any) => (
              <Card key={stat.type} className="bg-slate-800 border-slate-700 hover:border-red-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    {stat.type === "movies" && (
                      <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center">
                        <Film className="h-10 w-10 text-white" />
                      </div>
                    )}
                    {stat.type === "series" && (
                      <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center">
                        <Video className="h-10 w-10 text-white" />
                      </div>
                    )}
                    {stat.type === "shows" && (
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center">
                        <Tv className="h-10 w-10 text-white" />
                      </div>
                    )}
                    {stat.type === "mix" && (
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center">
                        <Globe className="h-10 w-10 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.count}</div>
                  <div className="text-lg text-gray-400 font-semibold">
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
      <footer className="bg-slate-900 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">اكوام</h3>
            <p className="text-gray-400 mb-4">الموقع العربي الأول للمشاهدة والتحميل</p>
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