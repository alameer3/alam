import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import OriginalHeader from '../components/layout/OriginalHeader';
import OriginalFooter from '../components/layout/OriginalFooter';

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

const ShowsOriginal = () => {
  const [filters, setFilters] = useState({
    section: '0',
    category: '0',
    year: '0',
    rating: '0'
  });

  const { data: showsData, isLoading } = useQuery({
    queryKey: ['/api/content', { type: 'show', ...filters }],
    enabled: true
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <>
      {/* إضافة CSS الأصلي */}
      <link rel="stylesheet" href="/css/akwam_original/plugins.css" />
      <link rel="stylesheet" href="/css/akwam_original/style.css" />
      <link rel="stylesheet" href="/css/akwam_original/akwam.css" />
      <link rel="stylesheet" href="/css/original-enhancements.css" />
      
      <div className="body header-fixed header-pages">
        <OriginalHeader pageTitle="تلفزيون | اكوام" />
        
        {/* Page Content */}
        <div className="page page-archive">
          {/* Archive Cover */}
          <div className="archive-cover mb-4" style={{
            backgroundImage: "url('https://img.downet.net/uploads/xVeQg.webp')"
          }}>
            <div className="container">
              <div className="row pb-3">
                <div className="col-12 mt-auto">
                  <div className="row">
                    <div className="col-md-auto col-12 mb-12 mb-md-0">
                      <div className="main-category d-flex align-items-center justify-content-center radius p-4 h-100">
                        <i className="icn icon-tv ml-4"></i>
                        <h1 className="name font-size-34 font-weight-bold mb-0">تلفزيون</h1>
                      </div>
                    </div>
                    <div className="col-md">
                      <form id="filter" method="get">
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-12">
                            <div className="form-group mb-12">
                              <select 
                                className="form-control select2" 
                                name="section"
                                value={filters.section}
                                onChange={(e) => handleFilterChange('section', e.target.value)}
                              >
                                <option value="0">القسم</option>
                                <option value="29">عربي</option>
                                <option value="30">اجنبي</option>
                                <option value="31">رياضة</option>
                                <option value="32">مصارعة</option>
                                <option value="33">اطفال</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 col-12">
                            <div className="form-group mb-12 mb-lg-0">
                              <select 
                                className="form-control select2" 
                                name="category"
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                              >
                                <option value="0">التصنيف</option>
                                <option value="40">توك شو</option>
                                <option value="41">برامج منوعة</option>
                                <option value="42">رياضة</option>
                                <option value="43">مصارعة</option>
                                <option value="44">اطفال</option>
                                <option value="45">طبخ</option>
                                <option value="46">سفر</option>
                                <option value="47">وثائقي</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 col-12">
                            <div className="form-group mb-12 mb-lg-0">
                              <select 
                                className="form-control select2" 
                                name="year"
                                value={filters.year}
                                onChange={(e) => handleFilterChange('year', e.target.value)}
                              >
                                <option value="0">سنة الإنتاج</option>
                                {Array.from({length: 30}, (_, i) => 2025 - i).map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 col-12">
                            <div className="form-group mb-0">
                              <select 
                                className="form-control select2" 
                                name="rating"
                                value={filters.rating}
                                onChange={(e) => handleFilterChange('rating', e.target.value)}
                              >
                                <option value="0">التقييم</option>
                                {Array.from({length: 9}, (_, i) => i + 1).map(rating => (
                                  <option key={rating} value={rating}>+{rating}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shows Grid */}
          <div className="container">
            <div className="widget-2 archive-content">
              <div className="widget-body">
                {isLoading ? (
                  <div className="row">
                    {Array.from({length: 12}).map((_, i) => (
                      <div key={i} className="col-lg-2 col-md-3 col-4 col-xs-6 mb-12">
                        <div className="block relative">
                          <div className="img animate-pulse bg-gray-300" style={{ height: '280px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="row">
                    {showsData?.data?.filter((item: ContentItem) => item.type === 'show')
                      .map((show: ContentItem) => (
                      <div key={show.id} className="col-lg-2 col-md-3 col-4 col-xs-6 mb-12">
                        <div className="block relative">
                          <a href={`/show/${show.id}`} className="img">
                            <img 
                              className="img-fluid"
                              src={show.poster || '/serverdata/images/default-poster.svg'}
                              alt={show.titleAr}
                              loading="lazy"
                            />
                            <div className="absolute-container">
                              <div className="layer">
                                <div className="icons">
                                  <div className="icon play">
                                    <i className="icon-play"></i>
                                  </div>
                                </div>
                                <div className="info">
                                  <div className="title">{show.titleAr}</div>
                                  <div className="sub-title">{show.title}</div>
                                  <div className="labels">
                                    <span className="label label-primary">{show.quality}</span>
                                    <span className="label label-year">{new Date(show.releaseDate).getFullYear()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                <div className="row">
                  <div className="col-12">
                    <nav aria-label="Page navigation">
                      <ul className="pagination justify-content-center">
                        <li className="page-item disabled">
                          <span className="page-link">السابق</span>
                        </li>
                        <li className="page-item active">
                          <span className="page-link">1</span>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">2</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">3</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">التالي</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <OriginalFooter />
      </div>
    </>
  );
};

export default ShowsOriginal;