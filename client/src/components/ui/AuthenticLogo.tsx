interface AuthenticLogoProps {
  size?: number;
  className?: string;
}

const AuthenticLogo = ({ size = 160, className = "" }: AuthenticLogoProps) => {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* الدائرة الخارجية الأولى */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{ 
          border: '3px solid white',
          backgroundColor: 'rgba(0,0,0,0.2)'
        }}
      ></div>
      
      {/* الدائرة الداخلية */}
      <div 
        className="absolute rounded-full flex items-center justify-center"
        style={{ 
          width: size * 0.85, 
          height: size * 0.85,
          border: '2px solid white',
          backgroundColor: 'rgba(0,0,0,0.7)',
          top: '7.5%',
          left: '7.5%'
        }}
      >
        {/* المحتوى الداخلي */}
        <div className="text-center">
          {/* الرمز المثلثي */}
          <div 
            className="text-white font-bold mb-2"
            style={{ fontSize: size * 0.25, lineHeight: '1' }}
          >
            △
          </div>
          {/* النص */}
          <div 
            className="text-white font-medium"
            style={{ fontSize: size * 0.095, lineHeight: '1.2' }}
          >
            المكتبة الترفيهية
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticLogo;