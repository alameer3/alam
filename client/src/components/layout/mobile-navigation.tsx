import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetClose 
} from "@/components/ui/sheet";
import { AdvancedThemeSwitcher } from "@/components/theme/advanced-theme-switcher";
import { 
  Menu, 
  X, 
  Home, 
  Film, 
  Tv, 
  Radio, 
  Layers, 
  Search, 
  Heart, 
  User, 
  Settings,
  Crown,
  Upload,
  Bell
} from "lucide-react";

export function MobileNavigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { 
      path: "/", 
      label: "الرئيسية", 
      icon: Home,
      description: "الصفحة الرئيسية"
    },
    { 
      path: "/movies", 
      label: "أفلام", 
      icon: Film,
      description: "جميع الأفلام"
    },
    { 
      path: "/series", 
      label: "مسلسلات", 
      icon: Tv,
      description: "المسلسلات والدراما"
    },
    { 
      path: "/television", 
      label: "برامج تلفزيونية", 
      icon: Radio,
      description: "البرامج التلفزيونية"
    },
    { 
      path: "/miscellaneous", 
      label: "متنوع", 
      icon: Layers,
      description: "محتوى متنوع"
    },
  ];

  const userActions = [
    {
      path: "/search",
      label: "البحث المتقدم",
      icon: Search,
      description: "بحث شامل في المحتوى"
    },
    {
      path: "/favorites",
      label: "المفضلة",
      icon: Heart,
      description: "المحتوى المفضل لديك"
    },
    {
      path: "/upload",
      label: "رفع الملفات",
      icon: Upload,
      description: "رفع محتوى جديد"
    }
  ];

  const isCurrentPath = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="lg:hidden relative"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">فتح القائمة</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-[320px] sm:w-[400px] p-0 bg-background/95 backdrop-blur-xl border-l border-border/50"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Film className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <SheetTitle className="text-right text-lg font-bold">
                    أكاديمية السينما
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground text-right">
                    استكشف عالم السينما
                  </p>
                </div>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              
              {/* Primary Navigation */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                  التصفح الرئيسي
                </h3>
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isCurrentPath(item.path);
                    
                    return (
                      <SheetClose asChild key={item.path}>
                        <Link href={item.path}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-3 h-12 px-3 text-right ${
                              isActive 
                                ? "bg-primary/10 text-primary border border-primary/20" 
                                : "hover:bg-muted/50"
                            }`}
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <div className="flex-1 text-right">
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.description}
                              </div>
                            </div>
                            {isActive && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </Button>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </div>

              {/* User Actions */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                  الأدوات والمزايا
                </h3>
                <nav className="space-y-1">
                  {userActions.map((action) => {
                    const Icon = action.icon;
                    
                    return (
                      <SheetClose asChild key={action.path}>
                        <Link href={action.path}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-12 px-3 text-right hover:bg-muted/50"
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <div className="flex-1 text-right">
                              <div className="font-medium">{action.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {action.description}
                              </div>
                            </div>
                          </Button>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </div>

              {/* Theme Switcher */}
              <div className="border-t border-border/50 pt-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                  المظهر والثيمات
                </h3>
                <div className="px-2">
                  <AdvancedThemeSwitcher />
                </div>
              </div>

              {/* Premium Section */}
              <div className="border-t border-border/50 pt-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-primary">اشتراك VIP</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    احصل على مزايا حصرية ومحتوى متميز
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    ترقية الآن
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">أهلاً بك</div>
                  <div className="text-muted-foreground">مستخدم عادي</div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}