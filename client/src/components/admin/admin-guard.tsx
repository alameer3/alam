import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Lock } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, isLoading } = useAdminAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      setLocation("/admin-login");
    }
  }, [isAdmin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>جاري التحقق من صلاحيات الوصول...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2 border-destructive">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-destructive rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">
              وصول مرفوض
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                هذه الصفحة مخصصة للمشرفين المعتمدين فقط
              </p>
              <p className="text-sm text-muted-foreground">
                يرجى تسجيل الدخول بحساب المشرف للوصول لهذه الصفحة
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => setLocation("/admin-login")}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Lock className="w-4 h-4 ml-2" />
                تسجيل دخول المشرف
              </Button>
              
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="w-full"
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
            
            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <p>🔐 نظام حماية متقدم</p>
              <p>جميع محاولات الوصول غير المصرح بها يتم تسجيلها</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}