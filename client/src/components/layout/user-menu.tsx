import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  User, 
  Heart, 
  Clock, 
  List, 
  Bell, 
  Settings, 
  LogOut, 
  Shield,
  Star,
  BookOpen
} from "lucide-react";

interface UserMenuProps {
  isMobile?: boolean;
  className?: string;
}

export function UserMenu({ isMobile = false, className = "" }: UserMenuProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock authentication state
  const [notificationCount] = useState(3); // Mock notification count
  
  // Mock user data
  const user = {
    id: 1,
    username: "مستخدم Yemen Flix",
    email: "user@yemenflix.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
    isAdmin: false
  };

  if (!isLoggedIn) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link href="/login">
          <Button variant="outline" size="sm">
            تسجيل الدخول
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">
            إنشاء حساب
          </Button>
        </Link>
      </div>
    );
  }

  const menuItems = [
    {
      icon: User,
      label: "الملف الشخصي",
      href: "/profile",
      description: "عرض وتعديل ملفك الشخصي"
    },
    {
      icon: Heart,
      label: "المفضلة",
      href: "/watchlists",
      description: "قائمة المحتوى المفضل لديك"
    },
    {
      icon: List,
      label: "قوائم المشاهدة",
      href: "/watchlists",
      description: "قوائمك المخصصة"
    },
    {
      icon: Clock,
      label: "سجل المشاهدة",
      href: "/profile",
      description: "المحتوى الذي شاهدته مؤخراً"
    },
    {
      icon: Bell,
      label: "الإشعارات",
      href: "/notifications",
      description: "إشعاراتك وتحديثاتك",
      badge: notificationCount > 0 ? notificationCount : undefined
    },
    {
      icon: Settings,
      label: "الإعدادات",
      href: "/profile",
      description: "إعدادات الحساب والتفضيلات"
    }
  ];

  if (user.isAdmin) {
    menuItems.push({
      icon: Shield,
      label: "لوحة التحكم الإدارية",
      href: "/admin-dashboard",
      description: "إدارة المحتوى والمستخدمين"
    });
  }

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className={`relative ${className}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                  {user.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-right">{user.username}</SheetTitle>
                <SheetDescription className="text-right">{user.email}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <div className="mt-6 space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link key={`mobile-menu-${index}-${item.href}`} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-auto py-3 px-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="font-medium flex items-center gap-2">
                          {item.label}
                          {item.badge && (
                            <Badge variant="destructive" className="h-5 px-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                </Link>
              );
            })}
            
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                onClick={() => setIsLoggedIn(false)}
                className="w-full justify-start gap-3 h-auto py-3 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-right">
                    <div className="font-medium">تسجيل الخروج</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      خروج من حسابك
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`relative ${className}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {user.username.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-right">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                {user.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-right">
              <div className="font-medium">{user.username}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{user.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link key={`dropdown-menu-${index}-${item.href}`} href={item.href}>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <IconComponent className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="h-4 px-1 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </DropdownMenuItem>
            </Link>
          );
        })}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20"
        >
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}