import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Play, Calendar, Eye, TrendingUp, Award, Filter } from "lucide-react";
import { Link } from "wouter";
import AdvancedFilters from "@/components/filters/advanced-filters";
import AkStyleContentGrid from "@/components/content/ak-style-content-grid";

export default function Ones() {
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState("featured");

  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/content/featured'],
    queryFn: async () => {
      const response = await fetch('/api/content/featured');
      return response.json();
    }
  });

  const { data: topRatedContent, isLoading: topRatedLoading } = useQuery({
    queryKey: ['/api/content/top-rated'],
    queryFn: async () => {
      const response = await fetch('/api/content/trending');
      return response.json();
    }
  });

  const { data: latestContent, isLoading: latestLoading } = useQuery({
    queryKey: ['/api/content/latest'],
    queryFn: async () => {
      const response = await fetch('/api/content/latest');
      return response.json();
    }
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">المحتوى المميز</h1>
        <p className="text-lg text-gray-600">أفضل المحتوى المختار خصيصاً لك</p>
      </div>

      <AdvancedFilters 
        onFiltersChange={handleFiltersChange}
        contentType="featured"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            المحتوى المميز
          </TabsTrigger>
          <TabsTrigger value="top-rated" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            الأعلى تقييماً
          </TabsTrigger>
          <TabsTrigger value="latest" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            الأحدث
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">المحتوى المميز</h2>
            <AkStyleContentGrid
              content={featuredContent || []}
              loading={featuredLoading}
              error={null}
            />
          </div>
        </TabsContent>

        <TabsContent value="top-rated">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">الأعلى تقييماً</h2>
            <AkStyleContentGrid
              content={topRatedContent || []}
              loading={topRatedLoading}
              error={null}
            />
          </div>
        </TabsContent>

        <TabsContent value="latest">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">الأحدث</h2>
            <AkStyleContentGrid
              content={latestContent || []}
              loading={latestLoading}
              error={null}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}