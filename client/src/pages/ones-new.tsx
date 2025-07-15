import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, TrendingUp, Clock } from "lucide-react";
import AkAuthenticContentGrid from "@/components/home/ak-authentic-content-grid";

export default function Ones() {
  const [activeTab, setActiveTab] = useState("featured");

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">اضيف حديثاً</h1>
          <p className="text-gray-300 text-lg">آخر الإضافات والمحتوى المميز</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 shadow-sm border border-slate-700">
            <TabsTrigger 
              value="featured" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-white"
            >
              <Award className="w-4 h-4" />
              المحتوى المميز
            </TabsTrigger>
            <TabsTrigger 
              value="top-rated" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-white"
            >
              <TrendingUp className="w-4 h-4" />
              الأعلى تقييماً
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-white"
            >
              <Clock className="w-4 h-4" />
              الأحدث
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-8">
            <AkAuthenticContentGrid
              title="المحتوى المميز"
              endpoint="/api/content/featured"
              type="movies"
            />
          </TabsContent>

          <TabsContent value="top-rated" className="mt-8">
            <AkAuthenticContentGrid
              title="الأعلى تقييماً"
              endpoint="/api/content/trending"
              type="movies"
            />
          </TabsContent>

          <TabsContent value="recent" className="mt-8">
            <AkAuthenticContentGrid
              title="الأحدث"
              endpoint="/api/content/latest"
              type="movies"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}