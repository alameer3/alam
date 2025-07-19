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
      {/* الدائرة الخارجية */}
      <div 
        className="absolute inset-0 rounded-full border-4 border-white/30"
        style={{ 
          background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
          backdropFilter: 'blur(10px)'
        }}
      ></div>
      
      {/* الدائرة الداخلية */}
      <div 
        className="absolute rounded-full border-2 border-white flex items-center justify-center"
        style={{ 
          width: size * 0.8, 
          height: size * 0.8,
          background: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%)',
          backdropFilter: 'blur(5px)'
        }}
      >
        {/* المحتوى الداخلي */}
        <div className="text-center">
          {/* الرمز المثلثي */}
          <div 
            className="text-white font-bold mb-1"
            style={{ fontSize: size * 0.2 }}
          >
            △
          </div>
          {/* النص */}
          <div 
            className="text-white font-medium leading-tight"
            style={{ fontSize: size * 0.08 }}
          >
            المكتبة الترفيهية
          </div>
        </div>
      </div>
      
      {/* تأثير الضوء */}
      <div 
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          top: '10%',
          left: '10%'
        }}
      ></div>
    </div>
  );
};

export default AuthenticLogo;