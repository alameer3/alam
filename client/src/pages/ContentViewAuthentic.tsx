import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { useState } from 'react';
import { Star, Calendar, Clock, Play, Download, Share2, Tv, Globe, User, Eye, Heart, MessageCircle } from 'lucide-react';
import AuthenticHeader from '../components/layout/AuthenticHeader';
import AuthenticFooter from '../components/layout/AuthenticFooter';
import type { Content } from '@shared/types';

const ContentViewAuthentic = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'watch' | 'download' | 'share'>('watch');

  const { data: content, isLoading } = useQuery({
    queryKey: ['/api/content', id],
    queryFn: async () => {
      const response = await fetch(`/api/content/${id}`);
      return response.json();
    },
    enabled: !!id
  });

  const { data: relatedContent } = useQuery({
    queryKey: ['/api/content/related', id],
    queryFn: async () => {
      const response = await fetch(`/api/content/${id}/related`);
      return response.json();
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#161619' }}>
        <AuthenticHeader />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="aspect-[2/3] bg-gray-800 rounded-lg"></div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-8 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded"></div>
                    <div className="h-4 bg-gray-800 rounded"></div>
                    <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#161619' }}>
        <AuthenticHeader />
        <div className="pt-20 pb-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">المحتوى غير موجود</h1>
            <p className="text-gray-400 mb-8">لم نتمكن من العثور على المحتوى المطلوب</p>
            <a href="/" className="text-orange-500 hover:text-orange-400 transition-colors">العودة للرئيسية</a>
          </div>
        </div>
      </div>
    );
  }

  const ActionButton = ({ icon: Icon, label, active, onClick }: {
    icon: any;
    label: string;
    active?: boolean;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-all duration-300"
      style={{
        backgroundColor: active ? '#f3951e' : 'rgba(39, 39, 44, 0.8)',
        color: active ? 'white' : '#b3b3b3',
        border: `1px solid ${active ? '#f3951e' : '#404040'}`
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'rgba(243, 149, 30, 0.1)';
          e.currentTarget.style.borderColor = '#f3951e';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'rgba(39, 39, 44, 0.8)';
          e.currentTarget.style.borderColor = '#404040';
        }
      }}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161619' }}>
      <AuthenticHeader />
      
      {/* خلفية مع تأثير blur */}
      <div 
        className="h-80 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${content.poster})`,
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(22, 22, 25, 0.8)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
      </div>

      <div className="relative -mt-40 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* الملصق */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <img
                  src={content.poster}
                  alt={content.titleAr}
                  className="w-full rounded-lg shadow-2xl"
                />
                
                {/* أزرار العمل */}
                <div className="mt-6 space-y-3">
                  <ActionButton
                    icon={Play}
                    label="الإعلان"
                    active={activeTab === 'watch'}
                    onClick={() => setActiveTab('watch')}
                  />
                  <ActionButton
                    icon={Download}
                    label="التحميل"
                    active={activeTab === 'download'}
                    onClick={() => setActiveTab('download')}
                  />
                  <ActionButton
                    icon={Share2}
                    label="المشاركة"
                    active={activeTab === 'share'}
                    onClick={() => setActiveTab('share')}
                  />
                </div>

                {/* الإحصائيات */}
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)' }}>
                  <h3 className="text-white font-semibold mb-3">الإحصائيات</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span style={{ color: '#b3b3b3' }}>المشاهدات</span>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Eye className="h-4 w-4" style={{ color: '#f3951e' }} />
                        <span className="text-white">{content.views || '0'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: '#b3b3b3' }}>التقييم</span>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white">{content.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: '#b3b3b3' }}>الإعجابات</span>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Heart className="h-4 w-4" style={{ color: '#f3951e' }} />
                        <span className="text-white">{content.likes || '0'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* التفاصيل */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* العنوان والمعلومات الأساسية */}
                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">{content.titleAr}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span 
                      className="px-3 py-1 rounded text-white text-sm font-medium"
                      style={{ backgroundColor: '#f3951e' }}
                    >
                      {content.quality}
                    </span>
                    
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(content.releaseDate).getFullYear()}</span>
                    </div>
                    
                    {content.duration && (
                      <div className="flex items-center space-x-2 space-x-reverse text-gray-300">
                        <Clock className="h-4 w-4" />
                        <span>{content.duration} دقيقة</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-300">
                      <Globe className="h-4 w-4" />
                      <span>{content.country}</span>
                    </div>

                    {content.type === 'series' && content.episodes && (
                      <div className="flex items-center space-x-2 space-x-reverse text-gray-300">
                        <Tv className="h-4 w-4" />
                        <span>{content.episodes.length} حلقة</span>
                      </div>
                    )}
                  </div>

                  {/* الأنواع */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {content.genres?.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded text-sm"
                        style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)', color: '#b3b3b3' }}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* القصة */}
                <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)' }}>
                  <h3 className="text-white font-semibold mb-3">قصة المسلسل</h3>
                  <p className="text-gray-300 leading-relaxed">{content.description}</p>
                </div>

                {/* فريق العمل */}
                {content.cast && content.cast.length > 0 && (
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(39, 39, 44, 0.8)' }}>
                    <h3 className="text-white font-semibold mb-4">فريق التمثيل</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {content.cast.slice(0, 6).map((actor, index) => (
                        <div key={index} className="text-center">
                          <div 
                            className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(243, 149, 30, 0.1)' }}
                          >
                            <User className="h-8 w-8" style={{ color: '#f3951e' }} />
                          </div>
                          <p className="text-white font-medium text-sm">{actor.name}</p>
                          <p style={{ color: '#b3b3b3' }} className="text-xs">{actor.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* المحتوى ذو الصلة */}
                {relatedContent?.data?.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-4">محتوى مشابه</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {relatedContent.data.slice(0, 4).map((item: Content) => (
                        <a key={item.id} href={`/${item.type}/${item.id}`} className="group">
                          <div className="aspect-[2/3] overflow-hidden rounded-lg">
                            <img
                              src={item.poster}
                              alt={item.titleAr}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <h4 className="text-white text-sm font-medium mt-2 line-clamp-2">{item.titleAr}</h4>
                          <p style={{ color: '#b3b3b3' }} className="text-xs">{new Date(item.releaseDate).getFullYear()}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthenticFooter />
    </div>
  );
};

export default ContentViewAuthentic;