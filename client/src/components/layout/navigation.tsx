import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Film, Tv, MonitorSpeaker, Clapperboard, Play, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home, color: "text-blue-500" },
  { href: "/movies", label: "الأفلام", icon: Film, color: "text-red-500" },
  { href: "/series", label: "المسلسلات", icon: Tv, color: "text-green-500" },
  { href: "/television", label: "التلفزيون", icon: MonitorSpeaker, color: "text-purple-500" },
  { href: "/trailers", label: "المقاطع الدعائية", icon: Play, color: "text-orange-500" },
  { href: "/miscellaneous", label: "المنوعات", icon: Sparkles, color: "text-pink-500" },
];

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-card/95 backdrop-blur-md sticky top-16 z-40 shadow-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-1 space-x-reverse bg-background/50 rounded-full p-2 shadow-inner">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:bg-background/80",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md scale-105" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <IconComponent 
                    className={cn(
                      "w-4 h-4 transition-colors duration-300",
                      isActive ? "text-current" : item.color
                    )} 
                  />
                  <span className="font-medium text-sm hidden lg:block">
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
