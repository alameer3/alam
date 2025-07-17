import React from 'react';

interface ContentGridProps {
  contentType: string;
}

const ContentGrid: React.FC<ContentGridProps> = ({ contentType }) => {
  return (
    <div className="container py-5">
      <h1>شبكة المحتوى - {contentType}</h1>
      <p>سيتم تطوير هذا المكون قريباً</p>
    </div>
  );
};

export default ContentGrid;