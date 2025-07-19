import { useState } from 'react';
import { Link } from 'wouter';
import '../styles/home-simple.css';

export default function Home() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: '#161619',
      backgroundImage: `linear-gradient(to bottom, rgba(22, 22, 25, 0.7), rgba(0, 0, 0, 0.9)), url('/serverdata/images/home-bg.webp')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>

      {/* هيدر بسيط مطابق للصورة المرجعية */}
      <header style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 40px',
        zIndex: 100
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* أيقونة المستخدم والقائمة يسار */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{ 
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              👤 أهلاً ضيف
            </div>
          </div>
          
          {/* شعار أكوام يمين */}
          <div style={{ 
            color: '#fff',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            ⬡ أكوام
          </div>
        </div>
      </header>

      {/* المحتوى المركزي */}
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        paddingTop: '120px'
      }}>
        
        {/* الشعار الدائري مطابق تماماً للصورة المرجعية */}
        <div className="circular-logo" style={{ 
          width: '258px',
          height: '258px',
          borderRadius: '50%',
          position: 'relative',
          marginBottom: '40px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          {/* الحدود المزدوجة البيضاء */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            border: '2px solid #fff',
            zIndex: 2
          }}></div>
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            right: '14px',
            bottom: '14px',
            borderRadius: '50%',
            border: '5px solid #fff',
            zIndex: 1
          }}></div>
          
          {/* الدائرة الداخلية السوداء */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            right: '24px',
            bottom: '24px',
            borderRadius: '50%',
            backgroundColor: '#161619',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3
          }}>
            {/* شعار المثلث الأبيض */}
            <svg width="60" height="55" style={{ marginBottom: '15px' }}>
              <path 
                fill="#fff"
                d="M68.479,46.753 L55.101,55.064 L59.686,64.395 L26.302,64.395 L43.500,33.248 L48.558,41.524 L61.642,34.285 L43.500,-0.001 L0.000,80.001 L87.000,80.001 L68.479,46.753 Z"
                transform="scale(0.7)"
              />
            </svg>
            
            {/* النص تحت الشعار */}
            <div style={{
              color: '#fff',
              fontSize: '16px',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              المكتبة الترفيهية
            </div>
          </div>
          
          {/* رابط للنقر */}
          <Link href="/ones" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            zIndex: 10
          }}></Link>
        </div>

        {/* شريط البحث مطابق للصورة المرجعية */}
        <div style={{ 
          width: '100%',
          maxWidth: '600px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            display: 'flex',
            backgroundColor: 'rgba(39, 39, 44, 0.9)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <input
              type="text"
              placeholder="ابحث عن فيلم او مسلسل او لعبة او برنامج ..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{
                flex: 1,
                padding: '16px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                direction: 'rtl',
                textAlign: 'right'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#f3951e',
                border: 'none',
                color: '#fff',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}

            >
              بحث
            </button>
          </div>
        </div>

        {/* الأقسام الأربعة مطابقة للصورة المرجعية */}
        <div className="grid-4" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
          width: '100%',
          maxWidth: '600px',
          marginBottom: '50px'
        }}>
          {/* أفلام */}
          <Link href="/movies" style={{
            backgroundColor: 'rgba(39, 39, 44, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '20px 15px',
            textAlign: 'center',
            color: '#fff',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '120px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📽️</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>أفلام</div>
          </Link>

          {/* مسلسلات */}
          <Link href="/series" style={{
            backgroundColor: 'rgba(39, 39, 44, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '20px 15px',
            textAlign: 'center',
            color: '#fff',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '120px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📺</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>مسلسلات</div>
          </Link>

          {/* تلفزيون */}
          <Link href="/shows" style={{
            backgroundColor: 'rgba(39, 39, 44, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '20px 15px',
            textAlign: 'center',
            color: '#fff',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '120px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📡</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>تلفزيون</div>
          </Link>

          {/* منوعات */}
          <Link href="/mix" style={{
            backgroundColor: 'rgba(39, 39, 44, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '20px 15px',
            textAlign: 'center',
            color: '#fff',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '120px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎮</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>منوعات</div>
          </Link>
        </div>
      </div>

      {/* التذييل مطابق للصورة المرجعية */}
      <footer style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '30px 40px',
        textAlign: 'center'
      }}>
        
        {/* أيقونات التواصل الاجتماعي */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <a href="#" style={{ color: '#777', fontSize: '20px', textDecoration: 'none' }}>🏠</a>
          <a href="#" style={{ color: '#777', fontSize: '20px', textDecoration: 'none' }}>📘</a>
          <a href="#" style={{ color: '#777', fontSize: '20px', textDecoration: 'none' }}>▲</a>
          <a href="#" style={{ color: '#777', fontSize: '20px', textDecoration: 'none' }}>📱</a>
          <a href="#" style={{ color: '#777', fontSize: '20px', textDecoration: 'none' }}>🎬</a>
          <a href="#" style={{ color: '#777', fontSize: '20px', textDecoration: 'none' }}>📧</a>
          <a href="#" style={{ color: '#777', fontSize: '20px', textDecoration: 'none' }}>✉️</a>
        </div>

        {/* روابط التذييل */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '15px',
          flexWrap: 'wrap'
        }}>
          <a href="#" style={{ color: '#999', fontSize: '14px', textDecoration: 'none' }}>أكوام</a>
          <a href="#" style={{ color: '#999', fontSize: '14px', textDecoration: 'none' }}>اتصل بنا</a>
          <a href="#" style={{ color: '#999', fontSize: '14px', textDecoration: 'none' }}>DMCA</a>
          <a href="#" style={{ color: '#999', fontSize: '14px', textDecoration: 'none' }}>API</a>
          <a href="#" style={{ color: '#999', fontSize: '14px', textDecoration: 'none' }}>حقوق الطبع</a>
          <a href="#" style={{ color: '#999', fontSize: '14px', textDecoration: 'none' }}>سياسة الخصوصية</a>
        </div>

        {/* نص حقوق الطبع */}
        <div style={{
          color: '#666',
          fontSize: '12px'
        }}>
          جميع الحقوق محفوظة لـ شبكة اكوام © 2025
        </div>
      </footer>
    </div>
  );
}