import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Search, Star, Calendar, Globe } from 'lucide-react';

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

const HomePage = () => {
  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/content/featured'],
    enabled: true
  });

  const { data: recentContent, isLoading: recentLoading } = useQuery({
    queryKey: ['/api/content/recent'],
    enabled: true
  });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section relative bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 py-20">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="hero-logo mb-8">
              <svg width="120" height="100" viewBox="0 0 87 80" fill="none" className="mx-auto">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#007bff"/>
                    <stop offset="50%" stopColor="#28a745"/>
                    <stop offset="100%" stopColor="#6f42c1"/>
                  </linearGradient>
                </defs>
                <path d="M43.5 0L87 20V60L43.5 80L0 60V20L43.5 0Z" fill="url(#logoGradient)"/>
                <text x="43.5" y="45" textAnchor="middle" fill="white" fontSize="18" fontFamily="STC-Bold">أكوام</text>
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              شمس المواقع العربية
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              الموقع العربي الأول لتحميل ومشاهدة الأفلام والمسلسلات
            </p>
            
            {/* Search Form */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative flex">
                <input 
                  type="text" 
                  placeholder="ابحث عن فيلم أو مسلسل أو برنامج..."
                  className="w-full px-6 py-4 text-lg rounded-r-full bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button className="px-8 rounded-l-full bg-blue-600 hover:bg-blue-700">
                  <Search className="w-5 h-5 ml-2" />
                  بحث
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/movies">
              <Card className="category-card movies group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-red-500 to-orange-600">
                <CardContent className="p-8 text-center text-white">
                  <div className="text-4xl mb-4">🎬</div>
                  <h3 className="text-xl font-bold mb-2">أفلام</h3>
                  <p className="text-red-100">أحدث الأفلام العربية والأجنبية</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/series">
              <Card className="category-card series group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <CardContent className="p-8 text-center text-white">
                  <div className="text-4xl mb-4">📺</div>
                  <h3 className="text-xl font-bold mb-2">مسلسلات</h3>
                  <p className="text-blue-100">المسلسلات العربية والتركية والأجنبية</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/shows">
              <Card className="category-card shows group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-green-500 to-teal-600">
                <CardContent className="p-8 text-center text-white">
                  <div className="text-4xl mb-4">🖥️</div>
                  <h3 className="text-xl font-bold mb-2">تلفزيون</h3>
                  <p className="text-green-100">البرامج التلفزيونية والرياضية</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/mix">
              <Card className="category-card mix group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <CardContent className="p-8 text-center text-white">
                  <div className="text-4xl mb-4">🔀</div>
                  <h3 className="text-xl font-bold mb-2">منوعات</h3>
                  <p className="text-purple-100">ألعاب، تطبيقات، مسرحيات</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">المحتوى المميز</h2>
            <Link href="/featured">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                عرض الكل
              </Button>
            </Link>
          </div>
          
          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-700 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredContent?.data?.map((item: ContentItem) => (
                <Link key={item.id} href={`/${item.type}/${item.id}`}>
                  <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gray-800 border-gray-700">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={item.poster || '/serverdb/images/default-poster.svg'} 
                          alt={item.titleAr}
                          className="w-full h-60 object-cover rounded-t-lg"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                          {item.quality}
                        </div>
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center">
                          <Star className="w-3 h-3 ml-1" />
                          {item.rating}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                          مميز
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2 line-clamp-2">{item.titleAr}</h3>
                        <div className="flex items-center text-gray-400 text-sm space-x-4 space-x-reverse">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 ml-1" />
                            {new Date(item.releaseDate).getFullYear()}
                          </span>
                          <span className="flex items-center">
                            <Globe className="w-4 h-4 ml-1" />
                            {item.country}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">أضيف حديثاً</h2>
            <Link href="/recent">
              <Button variant="outline">عرض الكل</Button>
            </Link>
          </div>
          
          {recentLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-300 dark:bg-gray-700 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentContent?.data?.map((item: ContentItem) => (
                <Link key={item.id} href={`/${item.type}/${item.id}`}>
                  <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={item.poster || '/serverdb/images/default-poster.svg'} 
                          alt={item.titleAr}
                          className="w-full h-60 object-cover rounded-t-lg"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                          {item.quality}
                        </div>
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center">
                          <Star className="w-3 h-3 ml-1" />
                          {item.rating}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                          جديد
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-gray-900 dark:text-white font-semibold mb-2 line-clamp-2">{item.titleAr}</h3>
                        <div className="flex items-center text-gray-500 text-sm space-x-4 space-x-reverse">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 ml-1" />
                            {new Date(item.releaseDate).getFullYear()}
                          </span>
                          <span className="flex items-center">
                            <Globe className="w-4 h-4 ml-1" />
                            {item.country}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-lg">أفلام</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">3000+</div>
              <div className="text-lg">مسلسلات</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-lg">برامج</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-lg">مستخدم</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;