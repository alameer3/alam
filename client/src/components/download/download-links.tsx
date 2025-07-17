import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Server, HardDrive, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DownloadLinksProps {
  contentId: number;
  episodeId?: number;
  title: string;
}

export default function DownloadLinks({ contentId, episodeId, title }: DownloadLinksProps) {
  const [activeTab, setActiveTab] = useState<'download' | 'stream'>('download');

  const { data: downloadLinks, isLoading: downloadLoading } = useQuery({
    queryKey: [`/api/content/${contentId}/download`, episodeId],
    queryFn: async () => {
      const url = episodeId 
        ? `/api/content/${contentId}/download?episode=${episodeId}`
        : `/api/content/${contentId}/download`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch download links');
      return response.json();
    },
    enabled: activeTab === 'download'
  });

  const { data: streamingLinks, isLoading: streamingLoading } = useQuery({
    queryKey: [`/api/content/${contentId}/stream`, episodeId],
    queryFn: async () => {
      const url = episodeId 
        ? `/api/content/${contentId}/stream?episode=${episodeId}`
        : `/api/content/${contentId}/stream`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch streaming links');
      return response.json();
    },
    enabled: activeTab === 'stream'
  });

  const handleDownload = (link: { url: string; server: string; quality: string; size?: string }) => {
    // In a real app, this would handle the download
    window.open(link.downloadUrl, '_blank');
  };

  const handleStream = (link: { url: string; server: string; quality: string }) => {
    // In a real app, this would handle the streaming
    window.open(link.streamingUrl, '_blank');
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case '4K':
        return 'bg-purple-600';
      case 'HD':
        return 'bg-blue-600';
      case 'SD':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          {episodeId ? 'تحميل ومشاهدة الحلقة' : 'تحميل ومشاهدة الفيلم'}
        </CardTitle>
        
        {/* Tab buttons */}
        <div className="flex space-x-2 space-x-reverse">
          <Button
            onClick={() => setActiveTab('download')}
            variant={activeTab === 'download' ? 'default' : 'outline'}
            size="sm"
            className={activeTab === 'download' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            <Download className="w-4 h-4 ml-2" />
            التحميل
          </Button>
          <Button
            onClick={() => setActiveTab('stream')}
            variant={activeTab === 'stream' ? 'default' : 'outline'}
            size="sm"
            className={activeTab === 'stream' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            <ExternalLink className="w-4 h-4 ml-2" />
            المشاهدة
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {activeTab === 'download' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-white">روابط التحميل</h4>
            
            {downloadLoading ? (
              <LoadingSpinner />
            ) : downloadLinks && downloadLinks.length > 0 ? (
              <div className="space-y-3">
                {downloadLinks.map((link: { id: number; url: string; server: string; quality: string; size?: string }) => (
                  <div key={link.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <HardDrive className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">{link.serverName}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Badge className={`${getQualityColor(link.quality)} text-white`}>
                          {link.quality}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {link.resolution}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {link.fileSize}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="text-sm text-gray-400 text-left">
                        <div>{link.language}</div>
                        {link.subtitle && (
                          <div className="text-xs">ترجمة: {link.subtitle}</div>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => handleDownload(link)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Download className="w-4 h-4 ml-2" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">لا توجد روابط تحميل متاحة حالياً</p>
            )}
          </div>
        )}

        {activeTab === 'stream' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-white">روابط المشاهدة</h4>
            
            {streamingLoading ? (
              <LoadingSpinner />
            ) : streamingLinks && streamingLinks.length > 0 ? (
              <div className="space-y-3">
                {streamingLinks.map((link: { id: number; url: string; server: string; quality: string }) => (
                  <div key={link.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Server className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">{link.serverName}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Badge className={`${getQualityColor(link.quality)} text-white`}>
                          {link.quality}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {link.resolution}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="text-sm text-gray-400 text-left">
                        <div>{link.language}</div>
                        {link.subtitle && (
                          <div className="text-xs">ترجمة: {link.subtitle}</div>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => handleStream(link)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <ExternalLink className="w-4 h-4 ml-2" />
                        مشاهدة
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">لا توجد روابط مشاهدة متاحة حالياً</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}