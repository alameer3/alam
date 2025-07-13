import { useState } from "react";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  User as UserIcon, 
  Settings, 
  Heart, 
  Clock, 
  Bell, 
  LogOut,
  Shield
} from "lucide-react";

interface UserMenuProps {
  user?: User;
  onLogout?: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [location, navigate] = useLocation();
  const [notifications] = useState(3);

  const handleLogout = () => {
    onLogout?.();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profilePicture || ""} alt={user?.username || "User"} />
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.username || "مستخدم"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>الملف الشخصي</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/watchlists")}>
          <Heart className="mr-2 h-4 w-4" />
          <span>المفضلة</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/watch-history")}>
          <Clock className="mr-2 h-4 w-4" />
          <span>سجل المشاهدة</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/notifications")}>
          <Bell className="mr-2 h-4 w-4" />
          <div className="flex items-center justify-between w-full">
            <span>الإشعارات</span>
            {notifications > 0 && (
              <Badge variant="destructive" className="h-4 w-4 p-0 text-xs">
                {notifications}
              </Badge>
            )}
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>الإعدادات</span>
        </DropdownMenuItem>
        
        {user?.role === 'admin' && (
          <DropdownMenuItem onClick={() => navigate("/unified-admin")}>
            <Shield className="mr-2 h-4 w-4" />
            <span>لوحة التحكم</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}