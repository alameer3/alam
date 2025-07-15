import { useState } from "react";
import { AkStyleContentGrid } from "@/components/content/ak-style-content-grid";
import { AdvancedFilters } from "@/components/filters/advanced-filters";
import { Content } from "@shared/schema";
import { useLocation } from "wouter";

export default function Movies() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState({});

  const handleContentClick = (content: Content) => {
    setLocation(`/content/${content.id}`);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <AdvancedFilters
        onFilterChange={handleFiltersChange}
        contentType="movies"
      />
      <AkStyleContentGrid
        contentType="movies"
        title="# أفلام"
        onContentClick={handleContentClick}
        filters={filters}
      />
    </div>
  );
}