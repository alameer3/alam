import { ReactNode } from "react";
import { useLocation } from 'wouter';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [location] = useLocation();
  
  // للصفحة الرئيسية، نعرض المحتوى بدون Layout إضافي
  if (location === '/') {
    return <>{children}</>;
  }

  // للصفحات الأخرى، نعرض Layout عادي
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;