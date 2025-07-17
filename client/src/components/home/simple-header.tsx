import React from 'react';
import { Search, Menu, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SimpleHeader() {
  return (
    <header className="nav-clean sticky top-0 z-50">
      <div className="container-clean">
        <div className="flex items-center justify-between h-16">
          {/* الشعار */}
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-primary">
              <span className="text-red-500">YEMEN</span>{' '}
              <span className="text-blue-500">FLIX</span>
            </div>
          </div>

          {/* شريط البحث */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="ابحث عن فيلم أو مسلسل..."
                className="search-clean pr-10"
              />
            </div>
          </div>

          {/* الإجراءات */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="btn-ghost">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="btn-ghost">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="btn-ghost lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}