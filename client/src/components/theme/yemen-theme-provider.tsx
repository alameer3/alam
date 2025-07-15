import { createContext, useContext, useEffect, useState } from "react";

type YemenThemeProviderProps = {
  children: React.ReactNode;
};

type YemenThemeProviderState = {
  theme: "yemen";
  isYemenTheme: boolean;
};

const initialState: YemenThemeProviderState = {
  theme: "yemen",
  isYemenTheme: true,
};

const YemenThemeProviderContext = createContext<YemenThemeProviderState>(initialState);

export function YemenThemeProvider({
  children,
  ...props
}: YemenThemeProviderProps) {
  const [theme] = useState<"yemen">("yemen");

  useEffect(() => {
    const root = window.document.documentElement;
    
    // إزالة جميع themes السابقة
    root.classList.remove("light", "dark", "yemen", "cinema", "royal", "heritage");
    
    // إضافة الثيم اليمني الأصيل فقط
    root.classList.add("yemen");
    
    // تحديث localStorage للحفاظ على التفضيل
    localStorage.setItem("yemen-flix-theme", "yemen");
  }, []);

  const value = {
    theme,
    isYemenTheme: true,
  };

  return (
    <YemenThemeProviderContext.Provider {...props} value={value}>
      {children}
    </YemenThemeProviderContext.Provider>
  );
}

export const useYemenTheme = () => {
  const context = useContext(YemenThemeProviderContext);

  if (context === undefined)
    throw new Error("useYemenTheme must be used within a YemenThemeProvider");

  return context;
};