import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div 
      className={cn(
        "min-h-screen bg-background transition-all duration-300",
        {
          "mobile-layout": isMobile,
          "tablet-layout": isTablet,
          "desktop-layout": !isMobile && !isTablet,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

// Hook لاستخدام حالة الشاشة
export function useResponsive() {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 0,
    height: 0
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width,
        height
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
}

// مكون للشبكة المتجاوبة
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "gap-4",
  className 
}: ResponsiveGridProps) {
  return (
    <div 
      className={cn(
        "grid",
        gap,
        {
          [`grid-cols-${cols.mobile}`]: cols.mobile,
          [`md:grid-cols-${cols.tablet}`]: cols.tablet,
          [`lg:grid-cols-${cols.desktop}`]: cols.desktop,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

// مكون للتحكم في المساحات المتجاوبة
interface ResponsiveSpacingProps {
  children: React.ReactNode;
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  margin?: {
    mobile?: string;
    tablet?: string;  
    desktop?: string;
  };
  className?: string;
}

export function ResponsiveSpacing({ 
  children, 
  padding = { mobile: "p-4", tablet: "p-6", desktop: "p-8" },
  margin,
  className 
}: ResponsiveSpacingProps) {
  return (
    <div 
      className={cn(
        padding.mobile,
        padding.tablet && `md:${padding.tablet}`,
        padding.desktop && `lg:${padding.desktop}`,
        margin?.mobile,
        margin?.tablet && `md:${margin.tablet}`,
        margin?.desktop && `lg:${margin.desktop}`,
        className
      )}
    >
      {children}
    </div>
  );
}