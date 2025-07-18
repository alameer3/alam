import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  titleAr: string;
  type: string;
  poster: string;
  rating: number;
  releaseDate: string;
  quality: string;
  country: string;
}

const HomeOriginal = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/content/featured'],
    enabled: true
  });

  const { data: recentContent, isLoading: recentLoading } = useQuery({
    queryKey: ['/api/content/recent'],
    enabled: true
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* إضافة CSS التحسينات */}
      <link rel="stylesheet" href="/css/original-enhancements.css" />
      
      <div 
        className="min-h-screen page-home" 
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, .55), #000 100%), url('/images/home-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
      {/* استخدام التصميم الأصلي من extracted_files/home */}
      <div className="container py-5 my-5" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* زر الصفحة الرئيسية الدائري - من الموقع الأصلي */}
        <div className="home-site-btn-container mt-5" style={{
          width: '258px',
          height: '258px',
          borderRadius: '50%',
          position: 'relative',
          marginRight: 'auto',
          marginLeft: 'auto',
          marginBottom: '40px',
          cursor: 'pointer'
        }}>
          <h1>
            <a href="/" className="link" style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              zIndex: 10,
              borderRadius: '50%'
            }} />
          </h1>
          <div 
            className="home-site-btn"
            style={{
              width: '230px',
              height: '230px',
              overflow: 'hidden',
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              right: '50%',
              border: '5px solid #fff',
              backgroundColor: '#161619',
              transform: 'translate(50%, -50%)',
              backgroundPosition: 'center -43%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '120%',
              backgroundImage: "url('/images/site-new.webp')",
              transition: "all 500ms"
            }}
          >
            <span className="logo" style={{
              position: 'absolute',
              top: '50px',
              right: '50%',
              zIndex: 2,
              transform: 'translate(50%)',
              transition: 'all 500ms'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="87px" height="80px">
                <path 
                  fillRule="evenodd" 
                  fill="rgb(255, 255, 255)"
                  d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"
                />
              </svg>
            </span>
            <span className="text font-size-20 font-weight-medium text-white" style={{
              width: '100%',
              textAlign: 'center',
              position: 'absolute',
              bottom: '55px',
              right: '50%',
              zIndex: 2,
              transform: 'translate(50%)',
              fontSize: '20px',
              fontWeight: '500',
              color: '#fff',
              transition: 'all 500ms'
            }}>
              الصفحة الرئيسية
            </span>
          </div>
        </div>

        {/* صندوق البحث والقوائم - من الموقع الأصلي */}
        <div className="widget-2 widget mb-4">
          <div className="widget-body row">
            <div className="col-lg-8 mx-auto" style={{ maxWidth: '66.666667%', margin: '0 auto' }}>
              
              {/* نموذج البحث المحسن */}
              <form 
                className="form d-flex no-gutters mb-20" 
                style={{ display: 'flex', marginBottom: '20px' }} 
                onSubmit={handleSearch}
              >
                <div className="col pl-12" style={{ flex: 1, paddingLeft: '12px' }}>
                  <input 
                    type="text" 
                    className="form-control"
                    id="widget2SearchInput" 
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج ..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #404047',
                      borderRadius: '4px 0 0 4px',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div className="col-auto">
                  <button 
                    type="submit" 
                    className="btn btn-orange"
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#df820c',
                      border: '1px solid #d37b0b',
                      borderRadius: '0 4px 4px 0',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    بحث
                  </button>
                </div>
              </form>

              {/* القوائم الرئيسية - من الموقع الأصلي */}
              <div className="main-categories-list">
                <div className="row" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '16px' 
                }}>
                  <div className="col-lg col-4">
                    <a href="/movies" className="item d-block text-center text-white py-3 h-100" style={{
                      display: 'block',
                      textAlign: 'center',
                      color: '#fff',
                      padding: '24px 12px',
                      height: '100%',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #404047',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="icn" style={{ marginBottom: '12px' }}>
                        <i className="icon-video-camera" style={{ fontSize: '32px', color: '#df820c' }}></i>
                      </div>
                      <div className="font-size-16" style={{ fontSize: '16px', fontWeight: '600' }}>أفلام</div>
                    </a>
                  </div>
                  <div className="col-lg col-4">
                    <a href="/series" className="item d-block text-center text-white py-3 h-100" style={{
                      display: 'block',
                      textAlign: 'center',
                      color: '#fff',
                      padding: '24px 12px',
                      height: '100%',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #404047',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="icn" style={{ marginBottom: '12px' }}>
                        <i className="icon-monitor" style={{ fontSize: '32px', color: '#df820c' }}></i>
                      </div>
                      <div className="font-size-16" style={{ fontSize: '16px', fontWeight: '600' }}>مسلسلات</div>
                    </a>
                  </div>
                  <div className="col-lg col-4">
                    <a href="/shows" className="item d-block text-center text-white py-3 h-100" style={{
                      display: 'block',
                      textAlign: 'center',
                      color: '#fff',
                      padding: '24px 12px',
                      height: '100%',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #404047',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="icn" style={{ marginBottom: '12px' }}>
                        <i className="icon-tv" style={{ fontSize: '32px', color: '#df820c' }}></i>
                      </div>
                      <div className="font-size-16" style={{ fontSize: '16px', fontWeight: '600' }}>تلفزيون</div>
                    </a>
                  </div>
                  <div className="col-lg col-4">
                    <a href="/mix" className="item d-block text-center text-white py-3 h-100" style={{
                      display: 'block',
                      textAlign: 'center',
                      color: '#fff',
                      padding: '24px 12px',
                      height: '100%',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #404047',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="icn" style={{ marginBottom: '12px' }}>
                        <i className="icon-mix" style={{ fontSize: '32px', color: '#df820c' }}></i>
                      </div>
                      <div className="font-size-16" style={{ fontSize: '16px', fontWeight: '600' }}>منوعات</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-categories-list-end"></div>

        {/* محتوى إضافي مميز */}
        {featuredContent && featuredContent.data && (
          <div className="featured-content mt-5">
            <h2 className="text-white text-2xl font-bold mb-4 text-center">المحتوى المميز</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '16px' 
            }}>
              {featuredContent.data.slice(0, 6).map((item: ContentItem) => (
                <div 
                  key={item.id} 
                  style={{
                    backgroundColor: '#2a2a2d',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img 
                    src={item.poster || '/serverdata/images/default-poster.svg'} 
                    alt={item.titleAr}
                    style={{
                      width: '100%',
                      height: '240px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '12px' }}>
                    <h3 style={{
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.titleAr}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Star style={{ width: '16px', height: '16px', color: '#fbbf24', marginLeft: '4px' }} />
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>{item.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* المحتوى الحديث */}
        {recentContent && recentContent.data && (
          <div className="recent-content mt-5 mb-10">
            <h2 className="text-white text-2xl font-bold mb-4 text-center">أضيف حديثاً</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
              gap: '12px' 
            }}>
              {recentContent.data.slice(0, 12).map((item: ContentItem) => (
                <div 
                  key={item.id} 
                  style={{
                    backgroundColor: '#2a2a2d',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img 
                    src={item.poster || '/serverdata/images/default-poster.svg'} 
                    alt={item.titleAr}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '8px' }}>
                    <h3 style={{
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.titleAr}
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Star style={{ width: '14px', height: '14px', color: '#fbbf24', marginLeft: '2px' }} />
                        <span style={{ color: '#fbbf24', fontSize: '11px' }}>{item.rating}</span>
                      </div>
                      <span style={{ color: '#9ca3af', fontSize: '10px' }}>{item.quality}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default HomeOriginal;