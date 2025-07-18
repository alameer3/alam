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

const SeriesOriginal = () => {
  const [filters, setFilters] = useState({
    section: '0',
    category: '0',
    year: '0',
    rating: '0'
  });

  const { data: seriesData, isLoading } = useQuery({
    queryKey: ['/api/content', { type: 'series', ...filters }],
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
        <OriginalHeader pageTitle="مسلسلات | اكوام" />
        
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
                        <i className="icn icon-monitor ml-4"></i>
                        <h1 className="name font-size-34 font-weight-bold mb-0">مسلسلات</h1>
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
                                <option value="31">هندي</option>
                                <option value="32">تركي</option>
                                <option value="33">اسيوي</option>
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
                                <option value="23">دراما</option>
                                <option value="20">كوميدي</option>
                                <option value="18">اكشن</option>
                                <option value="27">رومانسي</option>
                                <option value="35">اثارة</option>
                                <option value="22">رعب</option>
                                <option value="21">جريمة</option>
                                <option value="30">انمي</option>
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

          {/* Series Grid */}
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
                    {seriesData?.data?.filter((item: ContentItem) => item.type === 'series')
                      .map((series: ContentItem) => (
                      <div key={series.id} className="col-lg-2 col-md-3 col-4 col-xs-6 mb-12">
                        <div className="block relative">
                          <a href={`/series/${series.id}`} className="img">
                            <img 
                              className="img-fluid"
                              src={series.poster || '/serverdata/images/default-poster.svg'}
                              alt={series.titleAr}
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
                                  <div className="title">{series.titleAr}</div>
                                  <div className="sub-title">{series.title}</div>
                                  <div className="labels">
                                    <span className="label label-primary">{series.quality}</span>
                                    <span className="label label-year">{new Date(series.releaseDate).getFullYear()}</span>
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

export default SeriesOriginal;