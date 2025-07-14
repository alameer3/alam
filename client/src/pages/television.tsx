import { useState } from "react";
import { AkStyleContentGrid } from "@/components/content/ak-style-content-grid";
import { AdvancedFilters, FilterOptions } from "@/components/filters/advanced-filters";
import { Content } from "@shared/schema";
import { useLocation } from "wouter";

export default function Television() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleContentClick = (content: Content) => {
    setLocation(`/content/${content.id}`);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <AdvancedFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        contentType="tv"
      />
      <AkStyleContentGrid
        contentType="tv"
        title="# تلفزيون"
        onContentClick={handleContentClick}
        filters={filters}
      />
    </div>
  );
}