import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Menu, 
  Home, 
  Film, 
  Tv, 
  PlayCircle, 
  Layers, 
  Search,
  Heart,
  Clock,
  Settings,
  User,
  Bell,
  X
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
      description: "مجموعة الأفلام" 
    },
    { 
      path: "/series", 
      label: "مسلسلات", 
      icon: Tv, 
      description: "المسلسلات المتنوعة" 
    },
    { 
      path: "/television", 
      label: "تلفزيون", 
      icon: PlayCircle, 
      description: "البرامج التلفزيونية" 
    },
    { 
      path: "/miscellaneous", 
      label: "متنوع", 
      icon: Layers, 
      description: "محتوى متنوع" 
    },
    { 
      path: "/trailers", 
      label: "مقاطع دعائية", 
      icon: PlayCircle, 
      description: "أحدث المقاطع الدعائية" 
    },
  ];

  const userItems = [
    { 
      path: "/search", 
      label: "البحث", 
      icon: Search, 
      description: "البحث المتقدم" 
    },
    { 
      path: "/watchlists", 
      label: "قوائم المشاهدة", 
      icon: Heart, 
      description: "المفضلة والقوائم" 
    },
    { 
      path: "/notifications", 
      label: "الإشعارات", 
      icon: Bell, 
      description: "الإشعارات الجديدة",
      badge: 3
    },
    { 
      path: "/profile", 
      label: "الملف الشخصي", 
      icon: User, 
      description: "إعدادات الحساب" 
    },
  ];

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    // التنقل سيتم من خلال Link component
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-[280px] sm:w-[300px] p-0 bg-background/95 backdrop-blur-sm"
      >
        <SheetHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/logo_1.png" 
                alt="شعار يمن فليكس" 
                className="h-8 w-auto"
              />
              <SheetTitle className="text-right">
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  𝐘𝐄𝐌𝐄𝐍 🇾🇪 𝐅𝐋𝐈𝐗
                </span>
              </SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-right">
            منصة السينما اليمنية
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4">
            
            {/* التنقل الأساسي */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground px-2">
                التصفح
              </h4>
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Button
                      variant={location === item.path ? "secondary" : "ghost"}
                      className={`w-full justify-start gap-3 h-12 px-3 ${
                        location === item.path 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <div className="flex-1 text-right">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <Separator />

            {/* المستخدم والإعدادات */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground px-2">
                المستخدم
              </h4>
              <div className="space-y-1">
                {userItems.map((item) => (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Button
                      variant={location === item.path ? "secondary" : "ghost"}
                      className={`w-full justify-start gap-3 h-12 px-3 ${
                        location === item.path 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <div className="flex-1 text-right">
                        <div className="font-medium flex items-center justify-between">
                          {item.label}
                          {item.badge && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <Separator />

            {/* الإعدادات */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground px-2">
                الإعدادات
              </h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => handleNavigation("/settings")}
                >
                  <Settings className="h-5 w-5" />
                  <div className="flex-1 text-right">
                    <div className="font-medium">الإعدادات</div>
                    <div className="text-xs text-muted-foreground">
                      إعدادات التطبيق
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* مساحة إضافية في الأسفل */}
            <div className="h-20"></div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}