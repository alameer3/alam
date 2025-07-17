import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface Movie {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  poster: string;
  releaseDate: string;
  rating: number;
  ratingCount: number;
  quality: string;
  language: string;
  country: string;
  type: string;
}

interface MoviesResponse {
  data: Movie[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AkSvEnhancedMovies() {
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");

  useEffect(() => {
    // إضافة classes مطابقة للموقع الأصلي
    document.body.classList.add('header-fixed', 'header-pages');
    
    // إزالة classes عند مغادرة الصفحة
    return () => {
      document.body.classList.remove('header-fixed', 'header-pages');
    };
  }, []);

  const { data: moviesData, isLoading, error } = useQuery<MoviesResponse>({
    queryKey: ["/api/content/movie", currentPage, selectedGenre, selectedYear, selectedCountry, selectedQuality],
    enabled: true,
  });

  const handleMovieClick = (movie: Movie) => {
    const slugTitle = movie.titleAr || movie.title;
    setLocation(`/movie/${movie.id}/${encodeURIComponent(slugTitle)}`);
  };

  const resetFilters = () => {
    setSelectedGenre("");
    setSelectedYear("");
    setSelectedCountry("");
    setSelectedQuality("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="site-container">
        <div className="main-header-height"></div>
        <div className="container py-4">
          <div className="text-center py-5">
            <div className="spinner-border text-orange" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="site-container">
        <div className="main-header-height"></div>
        <div className="container py-4">
          <div className="alert alert-danger text-center">
            حدث خطأ في تحميل الأفلام
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="site-container">
      <div className="main-header-height"></div>
      
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-transparent p-0">
            <li className="breadcrumb-item">
              <a href="/" className="text-orange">اكوام</a>
            </li>
            <li className="breadcrumb-item active text-white" aria-current="page">
              أفلام
            </li>
          </ol>
        </nav>

        {/* عنوان الصفحة */}
        <div className="page-header mb-4">
          <h1 className="text-white font-weight-bold font-size-32 mb-2">أفلام</h1>
          <p className="text-white-50 font-size-16 mb-0">
            اكتشف أحدث الأفلام العربية والأجنبية المتاحة للمشاهدة والتحميل
          </p>
        </div>

        {/* فلاتر البحث المتقدمة - مطابقة للموقع الأصلي */}
        <div className="filters-section mb-4">
          <div className="card bg-dark border-secondary">
            <div className="card-header bg-transparent border-secondary">
              <h5 className="text-white mb-0">
                <i className="icon-filter ml-2"></i>
                فلاتر البحث المتقدمة
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="text-white font-size-14 mb-2">النوع</label>
                  <select 
                    className="form-control bg-dark text-white border-secondary"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    <option value="">جميع الأنواع</option>
                    <option value="action">أكشن</option>
                    <option value="drama">دراما</option>
                    <option value="comedy">كوميديا</option>
                    <option value="horror">رعب</option>
                    <option value="romance">رومانسي</option>
                    <option value="thriller">إثارة</option>
                    <option value="animation">رسوم متحركة</option>
                    <option value="documentary">وثائقي</option>
                    <option value="adventure">مغامرة</option>
                    <option value="family">عائلي</option>
                  </select>
                </div>
                
                <div className="col-md-3 mb-3">
                  <label className="text-white font-size-14 mb-2">سنة الإنتاج</label>
                  <select 
                    className="form-control bg-dark text-white border-secondary"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">جميع السنوات</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                  </select>
                </div>
                
                <div className="col-md-3 mb-3">
                  <label className="text-white font-size-14 mb-2">البلد</label>
                  <select 
                    className="form-control bg-dark text-white border-secondary"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    <option value="">جميع البلدان</option>
                    <option value="مصر">مصر</option>
                    <option value="السعودية">السعودية</option>
                    <option value="الإمارات">الإمارات</option>
                    <option value="لبنان">لبنان</option>
                    <option value="سوريا">سوريا</option>
                    <option value="الأردن">الأردن</option>
                    <option value="المغرب">المغرب</option>
                    <option value="تونس">تونس</option>
                    <option value="أمريكا">أمريكا</option>
                    <option value="بريطانيا">بريطانيا</option>
                    <option value="فرنسا">فرنسا</option>
                    <option value="تركيا">تركيا</option>
                    <option value="الهند">الهند</option>
                    <option value="كوريا">كوريا</option>
                  </select>
                </div>
                
                <div className="col-md-3 mb-3">
                  <label className="text-white font-size-14 mb-2">الجودة</label>
                  <select 
                    className="form-control bg-dark text-white border-secondary"
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                  >
                    <option value="">جميع الجودات</option>
                    <option value="4K">4K Ultra HD</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="720p">720p HD</option>
                    <option value="480p">480p</option>
                    <option value="360p">360p</option>
                    <option value="WEB-DL">WEB-DL</option>
                    <option value="BluRay">BluRay</option>
                    <option value="CAM">CAM</option>
                  </select>
                </div>
              </div>
              
              <div className="text-center mt-3">
                <button 
                  className="btn btn-orange mr-2"
                  onClick={() => setCurrentPage(1)}
                >
                  <i className="icon-search ml-1"></i>
                  تطبيق الفلاتر
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={resetFilters}
                >
                  <i className="icon-refresh ml-1"></i>
                  إعادة تعيين
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* نتائج البحث */}
        <div className="results-info mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <p className="text-white-50 mb-0">
              {moviesData?.total ? `${moviesData.total} فيلم` : 'لا توجد أفلام'}
            </p>
            <div className="view-options">
              <button className="btn btn-sm btn-outline-secondary active">
                <i className="icon-grid"></i>
              </button>
              <button className="btn btn-sm btn-outline-secondary ml-2">
                <i className="icon-list"></i>
              </button>
            </div>
          </div>
        </div>

        {/* شبكة الأفلام - مطابقة للموقع الأصلي */}
        {moviesData?.data?.length ? (
          <div className="movies-grid mb-5">
            <div className="row">
              {moviesData.data.map((movie) => (
                <div key={movie.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
                  <div 
                    className="movie-card card bg-dark border-0 h-100 cursor-pointer hover-scale"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="card-img-wrapper position-relative">
                      <img 
                        src={movie.poster || '/images/default-poster.jpg'} 
                        className="card-img-top" 
                        alt={movie.titleAr || movie.title}
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                      
                      {/* شارات الجودة والتقييم */}
                      <div className="position-absolute" style={{ top: '10px', right: '10px' }}>
                        {movie.quality && (
                          <span className="badge badge-orange font-size-12">
                            {movie.quality}
                          </span>
                        )}
                      </div>
                      
                      <div className="position-absolute" style={{ top: '10px', left: '10px' }}>
                        <div className="rating-badge bg-dark-50 text-white px-2 py-1 rounded">
                          <i className="icon-star text-warning"></i>
                          <span className="font-size-12 ml-1">
                            {movie.rating ? movie.rating.toFixed(1) : '0.0'}
                          </span>
                        </div>
                      </div>

                      {/* أيقونة التشغيل */}
                      <div className="play-overlay position-absolute d-flex align-items-center justify-content-center">
                        <div className="play-button bg-orange rounded-circle d-flex align-items-center justify-content-center">
                          <i className="icon-play text-white font-size-24"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body p-3">
                      <h6 className="card-title text-white font-weight-bold mb-2 text-truncate">
                        {movie.titleAr || movie.title}
                      </h6>
                      
                      <div className="movie-info">
                        <div className="row font-size-12 text-white-50">
                          <div className="col-6">
                            <i className="icon-calendar ml-1"></i>
                            {new Date(movie.releaseDate).getFullYear()}
                          </div>
                          <div className="col-6 text-left">
                            <i className="icon-flag ml-1"></i>
                            {movie.country}
                          </div>
                        </div>
                        
                        <div className="row font-size-12 text-white-50 mt-1">
                          <div className="col-6">
                            <i className="icon-globe ml-1"></i>
                            {movie.language}
                          </div>
                          <div className="col-6 text-left">
                            <i className="icon-eye ml-1"></i>
                            {movie.ratingCount} مشاهدة
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="icon-video-camera font-size-48 text-white-25 mb-3"></i>
            <h3 className="text-white-50 mb-2">لا توجد أفلام</h3>
            <p className="text-white-25">جرب تغيير إعدادات الفلاتر</p>
          </div>
        )}

        {/* صفحات التنقل */}
        {moviesData?.totalPages && moviesData.totalPages > 1 && (
          <div className="pagination-wrapper d-flex justify-content-center">
            <nav aria-label="Movies pagination">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link bg-dark text-white border-secondary"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="icon-arrow-right"></i>
                  </button>
                </li>
                
                {Array.from({ length: Math.min(5, moviesData.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button 
                        className="page-link bg-dark text-white border-secondary"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${currentPage === moviesData.totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link bg-dark text-white border-secondary"
                    onClick={() => setCurrentPage(Math.min(moviesData.totalPages, currentPage + 1))}
                    disabled={currentPage === moviesData.totalPages}
                  >
                    <i className="icon-arrow-left"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}