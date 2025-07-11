import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdvancedTheme } from "./advanced-theme-provider";
import { Sun, Moon, Camera, Palette, Zap, Monitor } from "lucide-react";

const themeIcons = {
  light: Sun,
  dark: Moon,
  cinema: Camera,
  classic: Palette,
  modern: Zap,
};

export function AdvancedThemeSwitcher() {
  const { theme, setTheme, themes } = useAdvancedTheme();
  const CurrentIcon = themeIcons[theme] || Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-9 px-0 transition-all duration-300 hover:scale-105">
          <CurrentIcon className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="sr-only">تبديل المظهر</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 animate-in slide-in-from-top-2">
        <DropdownMenuLabel className="text-right">اختر المظهر</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((themeOption) => {
          const Icon = themeIcons[themeOption.value];
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`flex items-center justify-between p-3 transition-colors cursor-pointer ${
                theme === themeOption.value ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <div className="text-right">
                  <div className="font-medium">{themeOption.label}</div>
                  <div className="text-xs text-muted-foreground">{themeOption.description}</div>
                </div>
              </div>
              {theme === themeOption.value && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}