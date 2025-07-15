import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdvancedTheme } from "@/components/theme/advanced-theme-provider";
import { useResponsive } from "./responsive-layout";
import { 
  Film, 
  Tv, 
  Monitor, 
  Music, 
  Home, 
  Play,
  Sparkles,
  TrendingUp,
  Crown,
  BarChart3,
  CreditCard
} from "lucide-react";

const navigationItems = [
  { 
    path: "/", 
    label: "الرئيسية", 
    icon: Home,
    description: "الصفحة الرئيسية"
  },
  { 
    path: "/ones", 
    label: "المحتوى المميز", 
    icon: Crown,
    description: "المحتوى المميز"
  },
  { 
    path: "/movies", 
    label: "أفلام", 
    icon: Film,
    description: "مجموعة الأفلام"
  },
  { 
    path: "/series", 
    label: "مسلسلات", 
    icon: Tv,
    description: "المسلسلات والدراما"
  },
  { 
    path: "/shows", 
    label: "برامج تلفزيونية", 
    icon: Monitor,
    description: "البرامج التلفزيونية"
  },
  { 
    path: "/mix", 
    label: "منوعات", 
    icon: Music,
    description: "محتوى متنوع"
  },
  { 
    path: "/trailers", 
    label: "مقاطع دعائية", 
    icon: Play,
    description: "المقاطع الدعائية والكواليس"
  },

];

const featuredItems = [
  {
    path: "/search",
    label: "البحث المتقدم",
    icon: TrendingUp,
    badge: "جديد"
  },
  {
    path: "/trailers",
    label: "مقاطع دعائية",
    icon: Crown,
    badge: "مميز"
  }
];

export function EnhancedNavigation() {
  const [location] = useLocation();
  const { theme } = useAdvancedTheme();
  const { isMobile } = useResponsive();

  const getThemeClasses = () => {
    switch (theme) {
      case "yemen": return {
        active: "bg-yemen-red text-yemen-white border-yemen-red",
        hover: "hover:bg-yemen-red/10 hover:border-yemen-red/30"
      };
      case "cinema": return {
        active: "bg-cinema-gold text-cinema-dark border-cinema-gold",
        hover: "hover:bg-cinema-gold/10 hover:border-cinema-gold/30"
      };
      case "royal": return {
        active: "bg-royal-purple text-royal-gold border-royal-purple",
        hover: "hover:bg-royal-purple/10 hover:border-royal-purple/30"
      };
      case "heritage": return {
        active: "bg-heritage-gold text-heritage-copper border-heritage-gold",
        hover: "hover:bg-heritage-gold/10 hover:border-heritage-gold/30"
      };
      default: return {
        active: "bg-primary text-primary-foreground border-primary",
        hover: "hover:bg-primary/10 hover:border-primary/30"
      };
    }
  };

  const themeClasses = getThemeClasses();

  if (isMobile) {
    return null; // Navigation handled by mobile menu
  }

  return (
    <nav className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          
          {/* Main navigation */}
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 transition-all duration-300 ${
                      isActive 
                        ? themeClasses.active
                        : `${themeClasses.hover} text-muted-foreground hover:text-foreground`
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Featured items */}
          <div className="flex items-center gap-2">
            {featuredItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={`flex items-center gap-2 transition-all duration-300 ${
                      isActive 
                        ? themeClasses.active
                        : themeClasses.hover
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          theme === 'yemen' ? 'bg-yemen-red/20 text-yemen-red' :
                          theme === 'cinema' ? 'bg-cinema-gold/20 text-cinema-gold' :
                          theme === 'royal' ? 'bg-royal-purple/20 text-royal-purple' :
                          theme === 'heritage' ? 'bg-heritage-gold/20 text-heritage-gold' :
                          'bg-primary/20 text-primary'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}

            {/* Special theme indicator */}
            <div className={`h-6 w-1 rounded-full ${
              theme === 'yemen' ? 'bg-gradient-to-b from-yemen-red via-yemen-white to-accent' :
              theme === 'cinema' ? 'bg-cinema-gradient' :
              theme === 'royal' ? 'bg-royal-gradient' :
              theme === 'heritage' ? 'bg-heritage-gradient' :
              'bg-gradient-to-b from-primary to-accent'
            }`} />
          </div>
        </div>
      </div>
    </nav>
  );
}