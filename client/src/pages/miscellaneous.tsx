import { useState } from "react";
import { AkStyleContentGrid } from "@/components/content/ak-style-content-grid";
import { Content } from "@shared/schema";
import { useLocation } from "wouter";

export default function Miscellaneous() {
  const [, setLocation] = useLocation();

  const handleContentClick = (content: Content) => {
    setLocation(`/content/${content.id}`);
  };

  return (
    <AkStyleContentGrid
      contentType="misc"
      title="# منوعات"
      onContentClick={handleContentClick}
    />
  );
}