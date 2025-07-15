import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Film, Tv, MonitorSpeaker, Play, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home, gradient: "from-blue-500 to-blue-600", hoverGradient: "from-blue-400 to-blue-500" },
  { href: "/movies", label: "الأفلام", icon: Film, gradient: "from-red-500 to-red-600", hoverGradient: "from-red-400 to-red-500" },
  { href: "/series", label: "المسلسلات", icon: Tv, gradient: "from-green-500 to-green-600", hoverGradient: "from-green-400 to-green-500" },
  { href: "/television", label: "التلفزيون", icon: MonitorSpeaker, gradient: "from-purple-500 to-purple-600", hoverGradient: "from-purple-400 to-purple-500" },
  { href: "/trailers", label: "المقاطع الدعائية", icon: Play, gradient: "from-orange-500 to-orange-600", hoverGradient: "from-orange-400 to-orange-500" },
  { href: "/miscellaneous", label: "المنوعات", icon: Sparkles, gradient: "from-pink-500 to-pink-600", hoverGradient: "from-pink-400 to-pink-500" },
];

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-background/95 backdrop-blur-md sticky top-16 z-40 shadow-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full p-2 shadow-inner border border-border/30">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 hover:scale-105",
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105` 
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <IconComponent 
                    className={cn(
                      "w-4 h-4 transition-all duration-300",
                      isActive ? "text-current drop-shadow-sm" : "group-hover:scale-110"
                    )} 
                  />
                  <span className="font-medium text-sm hidden lg:block">
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                  )}
                  {!isActive && (
                    <div className={cn(
                      "absolute inset-0 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300",
                      item.hoverGradient
                    )} />
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
