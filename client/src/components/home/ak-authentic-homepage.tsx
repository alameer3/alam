import AkAuthenticHero from "./ak-authentic-hero";
import AkAuthenticContentGrid from "./ak-authentic-content-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Clock, Star, Film, Video, Tv, Globe, TrendingUp } from "lucide-react";

export default function AkAuthenticHomepage() {
  const { data: stats } = useQuery({
    queryKey: ["/api/content/stats"],
  });

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <AkAuthenticHero />

      {/* Latest Content - اضيف حديثاً */}
      <AkAuthenticContentGrid
        title="اضيف حديثاً"
        endpoint="/api/content/latest"
        viewAllLink="/ones"
        type="movies"
      />

      {/* Featured Movies - الأفلام المميزة */}
      <AkAuthenticContentGrid
        title="الأفلام المميزة"
        endpoint="/api/content/featured"
        viewAllLink="/movies"
        type="movies"
      />

      {/* Popular Series - المسلسلات الشائعة */}
      <AkAuthenticContentGrid
        title="المسلسلات الشائعة"
        endpoint="/api/content/trending"
        viewAllLink="/series"
        type="series"
      />

      {/* Shows - البرامج التلفزيونية */}
      <AkAuthenticContentGrid
        title="البرامج التلفزيونية"
        endpoint="/api/content/shows"
        viewAllLink="/shows"
        type="shows"
      />

      {/* Mixed Content - المحتوى المنوع */}
      <AkAuthenticContentGrid
        title="المحتوى المنوع"
        endpoint="/api/content/mix"
        viewAllLink="/mix"
        type="mix"
      />

      {/* Statistics Section */}
      <div className="py-8 bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">إحصائيات الموقع</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats?.content?.map((stat: any) => (
              <Card key={stat.type} className="bg-slate-700 border-slate-600">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">
                    {stat.type === "movies" && <Film className="h-8 w-8 text-blue-400 mx-auto" />}
                    {stat.type === "series" && <Video className="h-8 w-8 text-green-400 mx-auto" />}
                    {stat.type === "shows" && <Tv className="h-8 w-8 text-purple-400 mx-auto" />}
                    {stat.type === "mix" && <Globe className="h-8 w-8 text-orange-400 mx-auto" />}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.count}</div>
                  <div className="text-sm text-gray-400">
                    {stat.type === "movies" && "فيلم"}
                    {stat.type === "series" && "مسلسل"}
                    {stat.type === "shows" && "برنامج"}
                    {stat.type === "mix" && "منوعات"}
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