import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Star, Play, Download, Heart } from 'lucide-react';
import OriginalHeader from '../components/layout/OriginalHeader';
import OriginalFooter from '../components/layout/OriginalFooter';

interface ContentDetails {
  id: number;
  title: string;
  titleAr: string;
  type: string;
  poster: string;
  backdrop: string;
  rating: number;
  releaseDate: string;
  quality: string;
  country: string;
  description: string;
  descriptionAr: string;
  duration: number;
  genre: string[];
  director: string;
  cast: string[];
  trailer: string;
}

interface ContentViewParams {
  type: string;
  id: string;
}

const ContentViewOriginal = () => {
  const params = useParams<ContentViewParams>();
  const { type, id } = params;

  const { data: content, isLoading } = useQuery({
    queryKey: ['/api/content', id],
    enabled: !!id
  });

  if (isLoading) {
    return (
      <>
        <link rel="stylesheet" href="/css/akwam_original/plugins.css" />
        <link rel="stylesheet" href="/css/akwam_original/style.css" />
        <link rel="stylesheet" href="/css/akwam_original/akwam.css" />
        <link rel="stylesheet" href="/css/original-enhancements.css" />
        <div className="body header-fixed">
          <OriginalHeader />
          <div className="container py-5">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
            </div>
          </div>
          <OriginalFooter />
        </div>
      </>
    );
  }

  return (
    <>
      <link rel="stylesheet" href="/css/akwam_original/plugins.css" />
      <link rel="stylesheet" href="/css/akwam_original/style.css" />
      <link rel="stylesheet" href="/css/akwam_original/akwam.css" />
      <link rel="stylesheet" href="/css/original-enhancements.css" />
      
      <div className="body header-fixed">
        <OriginalHeader pageTitle={`${content?.titleAr} | اكوام`} />
        
        {/* Hero Section */}
        <div className="page-hero" style={{
          backgroundImage: `url('${content?.backdrop || content?.poster}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div className="overlay" style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}></div>
          
          <div className="container position-relative" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
            <div className="row">
              <div className="col-md-4 col-lg-3">
                <div className="poster-container">
                  <img 
                    src={content?.poster || '/serverdata/images/default-poster.svg'}
                    alt={content?.titleAr}
                    className="img-fluid rounded shadow-lg"
                    style={{ width: '100%', maxWidth: '300px' }}
                  />
                </div>
              </div>
              
              <div className="col-md-8 col-lg-9">
                <div className="content-info text-white" style={{ paddingTop: '20px' }}>
                  <h1 className="title mb-2" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {content?.titleAr}
                  </h1>
                  <h2 className="sub-title mb-3" style={{ fontSize: '1.5rem', color: '#ccc' }}>
                    {content?.title}
                  </h2>
                  
                  <div className="meta-info mb-4">
                    <div className="d-flex flex-wrap align-items-center mb-2">
                      <div className="rating d-flex align-items-center ml-4">
                        <Star style={{ width: '20px', height: '20px', color: '#fbbf24', marginLeft: '5px' }} />
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{content?.rating}/10</span>
                      </div>
                      <span className="badge badge-primary ml-3" style={{ padding: '5px 10px' }}>
                        {content?.quality}
                      </span>
                      <span className="year ml-3" style={{ fontSize: '16px' }}>
                        {new Date(content?.releaseDate).getFullYear()}
                      </span>
                      {content?.duration && (
                        <span className="duration ml-3" style={{ fontSize: '16px' }}>
                          {Math.floor(content.duration / 60)}ساعة {content.duration % 60}دقيقة
                        </span>
                      )}
                    </div>
                    
                    <div className="genres mb-3">
                      {content?.genre?.map((g: string, index: number) => (
                        <span key={index} className="badge badge-outline ml-2" style={{ 
                          border: '1px solid #666', 
                          color: '#fff', 
                          padding: '3px 8px',
                          marginBottom: '5px'
                        }}>
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="description mb-4">
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#ddd' }}>
                      {content?.descriptionAr || content?.description}
                    </p>
                  </div>
                  
                  <div className="action-buttons">
                    <div className="d-flex flex-wrap">
                      <button className="btn btn-primary btn-lg ml-3 mb-2" style={{
                        background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '25px'
                      }}>
                        <Play style={{ width: '20px', height: '20px', marginLeft: '8px' }} />
                        مشاهدة الآن
                      </button>
                      
                      <button className="btn btn-outline-light btn-lg ml-3 mb-2" style={{
                        border: '2px solid #fff',
                        padding: '12px 24px',
                        borderRadius: '25px'
                      }}>
                        <Download style={{ width: '20px', height: '20px', marginLeft: '8px' }} />
                        تحميل
                      </button>
                      
                      <button className="btn btn-outline-light btn-lg mb-2" style={{
                        border: '2px solid #fff',
                        padding: '12px 24px',
                        borderRadius: '25px'
                      }}>
                        <Heart style={{ width: '20px', height: '20px', marginLeft: '8px' }} />
                        المفضلة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Details */}
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8">
              <div className="content-details">
                <h3 className="mb-4" style={{ color: '#fff', fontSize: '24px' }}>تفاصيل العمل</h3>
                
                <div className="details-grid">
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <strong style={{ color: '#fbbf24' }}>المخرج:</strong>
                    </div>
                    <div className="col-sm-9" style={{ color: '#ddd' }}>
                      {content?.director || 'غير محدد'}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <strong style={{ color: '#fbbf24' }}>الممثلون:</strong>
                    </div>
                    <div className="col-sm-9" style={{ color: '#ddd' }}>
                      {content?.cast?.join(', ') || 'غير محدد'}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <strong style={{ color: '#fbbf24' }}>البلد:</strong>
                    </div>
                    <div className="col-sm-9" style={{ color: '#ddd' }}>
                      {content?.country || 'غير محدد'}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <strong style={{ color: '#fbbf24' }}>سنة الإنتاج:</strong>
                    </div>
                    <div className="col-sm-9" style={{ color: '#ddd' }}>
                      {new Date(content?.releaseDate).getFullYear()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Trailer Section */}
              {content?.trailer && (
                <div className="trailer-section mt-5">
                  <h3 className="mb-4" style={{ color: '#fff', fontSize: '24px' }}>المقطع الدعائي</h3>
                  <div className="embed-responsive embed-responsive-16by9">
                    <iframe 
                      className="embed-responsive-item" 
                      src={content.trailer}
                      allowFullScreen
                      title="Trailer"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
            
            <div className="col-lg-4">
              <div className="sidebar">
                <h4 className="mb-4" style={{ color: '#fff' }}>أعمال مشابهة</h4>
                {/* Similar content will be added here */}
              </div>
            </div>
          </div>
        </div>
        
        <OriginalFooter />
      </div>
    </>
  );
};

export default ContentViewOriginal;