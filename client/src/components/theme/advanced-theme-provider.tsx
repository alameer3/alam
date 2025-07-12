import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "yemen" | "cinema" | "royal" | "heritage";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { value: Theme; label: string; description: string }[];
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
  themes: [],
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function AdvancedThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const themes = [
    {
      value: "light" as Theme,
      label: "فاتح",
      description: "مظهر فاتح ونظيف للنهار"
    },
    {
      value: "dark" as Theme,
      label: "داكن",
      description: "مظهر داكن مريح للعين"
    },
    {
      value: "yemen" as Theme,
      label: "يمني أصيل",
      description: "ألوان العلم اليمني التراثية"
    },
    {
      value: "cinema" as Theme,
      label: "سينما ذهبي",
      description: "مظهر سينمائي فاخر مع ذهبي"
    },
    {
      value: "royal" as Theme,
      label: "ملكي فاخر",
      description: "مظهر ملكي بألوان بنفسجية وذهبية"
    },
    {
      value: "heritage" as Theme,
      label: "تراثي عربي",
      description: "ألوان تراثية دافئة نحاسية"
    }
  ];

  useEffect(() => {
    const root = window.document.documentElement;
    
    // إزالة جميع classes السابقة
    root.classList.remove("light", "dark", "yemen", "cinema", "royal", "heritage");
    
    // إضافة theme الجديد
    root.classList.add(theme);
    
    // حفظ في localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
    themes,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useAdvancedTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useAdvancedTheme must be used within a AdvancedThemeProvider");

  return context;
};