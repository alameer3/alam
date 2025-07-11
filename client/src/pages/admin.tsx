import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Input } from "@/components/layout/ui/input";
import { Label } from "@/components/layout/ui/label";
import { Shield, ArrowLeft } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [, navigate] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple admin check - in production, use proper authentication
    if (credentials.username === "admin" && credentials.password === "admin123") {
      setIsAuthenticated(true);
      // Redirect to dashboard after login
      navigate("/admin/dashboard");
    } else {
      alert("بيانات الدخول غير صحيحة");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-xl flex items-center justify-center gap-2">
              <Shield className="w-6 h-6" />
              لوحة التحكم الإدارية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                  placeholder="admin"
                />
              </div>
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  placeholder="admin123"
                />
              </div>
              <Button type="submit" className="w-full">
                تسجيل الدخول
              </Button>
            </form>
            
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground text-center">
                بيانات الدخول التجريبية:<br />
                المستخدم: admin<br />
                كلمة المرور: admin123
              </p>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated, redirect to dashboard
  navigate("/admin/dashboard");
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-lg font-semibold mb-2">جاري التحويل...</h2>
          <p className="text-muted-foreground">
            يتم تحويلك إلى لوحة التحكم الإدارية
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
