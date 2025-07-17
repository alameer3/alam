import { ChevronRight, Home } from "lucide-react";
import { useLocation } from "wouter";

interface BreadcrumbItem {
  title: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const [, setLocation] = useLocation();

  const handleClick = (href: string) => {
    setLocation(href);
  };

  return (
    <nav className={`flex items-center space-x-2 rtl:space-x-reverse text-sm ${className}`}>
      <button
        onClick={() => handleClick("/")}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 text-gray-500" />
          <button
            onClick={() => handleClick(item.href)}
            className={`transition-colors ${
              item.current
                ? "text-orange-400 font-medium cursor-default"
                : "text-gray-400 hover:text-white"
            }`}
            disabled={item.current}
          >
            {item.title}
          </button>
        </div>
      ))}
    </nav>
  );
}