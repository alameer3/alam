import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Film, 
  Tv, 
  Radio, 
  Theater, 
  TrendingUp, 
  Clock, 
  Star,
  ChevronRight
} from "lucide-react";

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  description?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

export function EnhancedNavigation() {
  const [location] = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      path: "/",
      label: "الرئيسية",
      icon: <Home className="h-5 w-5" />,
      description: "اكتشف أحدث الأفلام والمسلسلات"
    },
    {
      path: "/movies",
      label: "أفلام",
      icon: <Film className="h-5 w-5" />,
      badge: "جديد",
      description: "مجموعة شاملة من الأفلام العربية والأجنبية",
      isTrending: true
    },
    {
      path: "/series",
      label: "مسلسلات",
      icon: <Tv className="h-5 w-5" />,
      description: "أحدث المسلسلات العربية والتركية والأجنبية"
    },
    {
      path: "/television",
      label: "برامج تلفزيونية",
      icon: <Radio className="h-5 w-5" />,
      description: "برامج وثائقية وترفيهية متنوعة"
    },
    {
      path: "/miscellaneous",
      label: "متنوع",
      icon: <Theater className="h-5 w-5" />,
      badge: "محدّث",
      description: "محتوى متنوع وحصري",
      isNew: true
    }
  ];

  const quickActions = [
    {
      label: "المفضلة",
      icon: <Star className="h-4 w-4" />,
      count: 12,
      color: "text-yellow-500"
    },
    {
      label: "شاهدت مؤخراً",
      icon: <Clock className="h-4 w-4" />,
      count: 8,
      color: "text-blue-500"
    },
    {
      label: "الأعلى تقييماً",
      icon: <TrendingUp className="h-4 w-4" />,
      count: 25,
      color: "text-green-500"
    }
  ];

  return (
    <nav className="bg-card/50 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        {/* التنقل الرئيسي */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {navigationItems.map((item) => {
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "relative group h-10 px-4 transition-all duration-200 hover:scale-105",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                      
                      {/* الشارات */}
                      {item.badge && (
                        <Badge 
                          variant={isActive ? "secondary" : "default"}
                          className="text-xs px-1.5 py-0.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      
                      {/* أيقونات الحالة */}
                      {item.isTrending && (
                        <TrendingUp className="h-3 w-3 text-orange-500 animate-pulse" />
                      )}
                      {item.isNew && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* شرح عند التمرير */}
                    {item.description && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        {item.description}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-popover"></div>
                      </div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* الإجراءات السريعة */}
          <div className="hidden lg:flex items-center gap-2">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-3 flex items-center gap-2">
                  <div className={cn("transition-colors group-hover:scale-110", action.color)}>
                    {action.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.count}</p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* شريط إضافي للفلاتر السريعة */}
        <div className="flex items-center gap-2 pb-4 overflow-x-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">فلاتر سريعة:</span>
          {[
            "أحدث الإضافات",
            "الأعلى تقييماً", 
            "مترجم",
            "مدبلج",
            "عربي",
            "أجنبي",
            "HD",
            "4K"
          ].map((filter) => (
            <Badge
              key={filter}
              variant="outline"
              className="cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>
    </nav>
  );
}