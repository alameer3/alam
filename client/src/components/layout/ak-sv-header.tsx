import { useState } from "react";
import { useLocation } from "wouter";
import { Search, User, HelpCircle, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AkSvHeader() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* الجانب الأيمن - معلومات المستخدم */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <User className="w-4 h-4" />
              <span>أهلاً بك، ضيف</span>
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>

          {/* الوسط - شريط البحث */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="البحث في الأفلام والمسلسلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pr-4 pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm"
                dir="rtl"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            </form>
          </div>

          {/* الجانب الأيسر - الشعار والقائمة */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/")}
              className="text-white text-xl font-bold hover:text-orange-400 transition-colors"
            >
              △ أكواد
            </button>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span>الأقسام</span>
              <Menu className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}