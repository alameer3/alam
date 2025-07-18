import { useState } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";

const HomeHero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container py-5 my-5">
      {/* زر الصفحة الرئيسية الدائري */}
      <div className="home-site-btn-container mt-5">
        <h1>
          <Link href="/" className="link absolute top-0 right-0 w-full h-full z-10 rounded-full" />
        </h1>
        <div 
          className="home-site-btn"
          style={{
            backgroundImage: "url('/images/site-new.webp')",
            transition: "background-position 5s"
          }}
        >
          <span className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="87px" height="80px">
              <path 
                fillRule="evenodd" 
                fill="rgb(255, 255, 255)"
                d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"
              />
            </svg>
          </span>
          <span className="text font-size-20 font-weight-medium text-white">
            الصفحة الرئيسية
          </span>
        </div>
      </div>

      {/* صندوق البحث والقوائم */}
      <div className="widget-2 widget mb-4">
        <div className="widget-body row">
          <div className="col-lg-8 mx-auto">
            {/* نموذج البحث المحسن */}
            <form className="form d-flex no-gutters mb-20 flex gap-0 mb-5" action="/search" method="get">
              <div className="col pl-12 flex-1 relative">
                <input 
                  type="text" 
                  className="form-control w-full px-4 py-3 rounded-r-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                  id="widget2SearchInput" 
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج ..."
                />
                <label htmlFor="widget2SearchInput" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  {!searchQuery && (
                    <div className="label-text hidden">
                      <p>ابحث عن فيلم او مسلسل او لعبة او برنامج ...</p>
                      <p>^200 مثال: الجزيرة</p>
                      <p>^400 مثال آخر: اسم مؤقت</p>
                      <p>^600 مثال: FIFA</p>
                      <p>^800 ابحث هنا في اكوام باسم الفيلم او المسلسل او اي لعبة او برنامج ترغب به</p>
                    </div>
                  )}
                </label>
              </div>
              <div className="col-auto">
                <button 
                  type="submit" 
                  className="btn bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-l-lg font-medium transition-all duration-300"
                >
                  بحث
                </button>
              </div>
            </form>

            {/* القوائم الرئيسية */}
            <div className="main-categories-list">
              <div className="row grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-lg col-4">
                  <Link href="/movies" className="item block text-center text-white py-6 h-full rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <div className="icn mb-2">
                      <i className="icon-video-camera text-3xl"></i>
                    </div>
                    <div className="font-size-16 font-medium">أفلام</div>
                  </Link>
                </div>
                <div className="col-lg col-4">
                  <Link href="/series" className="item block text-center text-white py-6 h-full rounded-lg bg-gradient-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <div className="icn mb-2">
                      <i className="icon-monitor text-3xl"></i>
                    </div>
                    <div className="font-size-16 font-medium">مسلسلات</div>
                  </Link>
                </div>
                <div className="col-lg col-4">
                  <Link href="/shows" className="item block text-center text-white py-6 h-full rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <div className="icn mb-2">
                      <i className="icon-tv text-3xl"></i>
                    </div>
                    <div className="font-size-16 font-medium">تلفزيون</div>
                  </Link>
                </div>
                <div className="col-lg col-4">
                  <Link href="/mix" className="item block text-center text-white py-6 h-full rounded-lg bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <div className="icn mb-2">
                      <i className="icon-mix text-3xl"></i>
                    </div>
                    <div className="font-size-16 font-medium">منوعات</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-categories-list-end"></div>
    </div>
  );
};

export default HomeHero;