import { useState } from "react";
import AdvancedContentGrid from "@/components/content/advanced-content-grid";
import AdvancedFilters from "@/components/filters/advanced-filters";
import { Content } from "@shared/schema";
import { useLocation } from "wouter";

export default function Television() {
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
        onFiltersChange={handleFiltersChange}
        contentType="tv"
      />
      <AdvancedContentGrid
        content={[]}
        loading={false}
        error={null}
      />
    </div>
  );
}