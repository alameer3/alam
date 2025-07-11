import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartSearchSystem } from "@/components/search/smart-search-system";
import { AdvancedThemeSwitcher } from "@/components/theme/advanced-theme-switcher";
import { useAuth } from "@/hooks/useAuth";
import { Heart, User, Bell, Menu, X, Film, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function EnhancedHeader() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3); // عدد الإشعارات الجديدة

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const navigationItems = [
    { path: "/", label: "الرئيسية", icon: "🏠" },
    { path: "/movies", label: "أفلام", icon: "🎬" },
    { path: "/series", label: "مسلسلات", icon: "📺" },
    { path: "/television", label: "برامج تلفزيونية", icon: "📡" },
    { path: "/miscellaneous", label: "متنوع", icon: "🎭" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* الشعار */}
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg">
              <Film className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                أكاديمية السينما
              </h1>
              <p className="text-xs text-muted-foreground">منصة الأفلام العربية</p>
            </div>
          </Link>

          {/* شريط البحث الذكي */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <SmartSearchSystem onSearch={handleSearch} />
          </div>

          {/* أدوات التنقل */}
          <div className="flex items-center gap-2">
            {/* مبدل الثيمات */}
            <AdvancedThemeSwitcher />

            {/* المفضلة */}
            <Button variant="ghost" size="sm" className="relative hidden sm:flex">
              <Heart className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                2
              </Badge>
            </Button>

            {/* الإشعارات */}
            <Button variant="ghost" size="sm" className="relative hidden sm:flex">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* قائمة المستخدم */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImageUrl} alt={user.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1 text-right">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="ml-2 h-4 w-4" />
                    <span>الملف الشخصي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Heart className="ml-2 h-4 w-4" />
                    <span>المفضلة</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="ml-2 h-4 w-4" />
                    <span>الإعدادات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive">
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" className="hidden sm:flex">
                تسجيل الدخول
              </Button>
            )}

            {/* قائمة الجوال */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-right">القائمة الرئيسية</SheetTitle>
                </SheetHeader>
                
                {/* البحث في الجوال */}
                <div className="mt-6 mb-6">
                  <SmartSearchSystem onSearch={handleSearch} />
                </div>

                {/* عناصر التنقل */}
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={location === item.path ? "default" : "ghost"}
                        className="w-full justify-start gap-3 h-12"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>

                {/* أدوات إضافية للجوال */}
                <div className="mt-6 space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Heart className="h-4 w-4" />
                    <span>المفضلة</span>
                    <Badge variant="secondary" className="mr-auto">2</Badge>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Bell className="h-4 w-4" />
                    <span>الإشعارات</span>
                    {notifications > 0 && (
                      <Badge variant="destructive" className="mr-auto">{notifications}</Badge>
                    )}
                  </Button>
                </div>

                {/* معلومات المستخدم في الجوال */}
                {user && (
                  <div className="mt-6 p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.profileImageUrl} alt={user.username} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}