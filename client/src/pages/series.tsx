import { useState } from "react";
import { AkStyleContentGrid } from "@/components/content/ak-style-content-grid";
import { AdvancedFilters } from "@/components/filters/advanced-filters";
import { Content } from "@shared/schema";
import { useLocation } from "wouter";

export default function Series() {
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
        contentType="series"
      />
      <AkStyleContentGrid
        contentType="series"
        title="# مسلسلات"
        onContentClick={handleContentClick}
        filters={filters}
      />
    </div>
  );
}