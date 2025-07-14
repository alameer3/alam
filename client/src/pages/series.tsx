import { useState } from "react";
import { AkStyleContentGrid } from "@/components/content/ak-style-content-grid";
import { Content } from "@shared/schema";
import { useLocation } from "wouter";

export default function Series() {
  const [, setLocation] = useLocation();

  const handleContentClick = (content: Content) => {
    setLocation(`/content/${content.id}`);
  };

  return (
    <AkStyleContentGrid
      contentType="series"
      title="# مسلسلات"
      onContentClick={handleContentClick}
    />
  );
}