import { useState, useEffect } from "react";

export interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop' | 'large-desktop';
}

export function useResponsive(): ResponsiveBreakpoints {
  const [breakpoints, setBreakpoints] = useState<ResponsiveBreakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    screenSize: 'desktop'
  });

  useEffect(() => {
    function updateBreakpoints() {
      const width = window.innerWidth;
      
      const newBreakpoints: ResponsiveBreakpoints = {
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1280,
        isLargeDesktop: width >= 1280,
        screenSize: width < 768 ? 'mobile' : 
                   width < 1024 ? 'tablet' : 
                   width < 1280 ? 'desktop' : 'large-desktop'
      };

      setBreakpoints(newBreakpoints);
    }

    updateBreakpoints();
    window.addEventListener('resize', updateBreakpoints);

    return () => window.removeEventListener('resize', updateBreakpoints);
  }, []);

  return breakpoints;
}

export function ResponsiveWrapper({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div 
      className={`
        ${className}
        ${isMobile ? 'px-2 py-1' : isTablet ? 'px-4 py-2' : 'px-6 py-3'}
        transition-all duration-200
      `}
    >
      {children}
    </div>
  );
}

export function ResponsiveGrid({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div 
      className={`
        grid gap-4 
        ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4 lg:grid-cols-6'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function ResponsiveSpacing({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div 
      className={`
        ${className}
        ${isMobile ? 'mb-4' : isTablet ? 'mb-6' : 'mb-8'}
      `}
    >
      {children}
    </div>
  );
}