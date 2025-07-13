import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus, UserPlus, Users, Shield, Star, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  favorites?: number[];
  watchHistory?: number[];
}

export default function UsersManagement() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const users: User[] = [
    {
      id: 1,
      username: "ahmed_mohamed",
      email: "ahmed@example.com",
      isAdmin: false,
      createdAt: "2024-01-15T10:30:00Z",
      favorites: [1, 2, 3],
      watchHistory: [1, 2, 3, 4, 5]
    },
    {
      id: 2,
      username: "sara_ali",
      email: "sara@example.com",
      isAdmin: false,
      createdAt: "2024-01-20T14:20:00Z",
      favorites: [2, 4],
      watchHistory: [1, 2, 4]
    },
    {
      id: 3,
      username: "admin_user",
      email: "admin@example.com",
      isAdmin: true,
      createdAt: "2024-01-01T09:00:00Z",
      favorites: [],
      watchHistory: []
    }
  ];

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create a new user
    toast({ title: "تم إضافة المستخدم بنجاح" });
    setIsAddUserOpen(false);
    setUserForm({ username: '', email: '', password: '', isAdmin: false });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.isAdmin).length,
    regular: users.filter(u => !u.isAdmin).length,
    active: users.filter(u => u.watchHistory && u.watchHistory.length > 0).length
  };

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-white">{userStats.total}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">المديرون</p>
                <p className="text-2xl font-bold text-white">{userStats.admins}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/10">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">المستخدمون النشطون</p>
                <p className="text-2xl font-bold text-white">{userStats.active}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Star className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">المستخدمون العاديون</p>
                <p className="text-2xl font-bold text-white">{userStats.regular}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10">
                <UserPlus className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <Card className="bg-card border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              إدارة المستخدمين
            </CardTitle>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة مستخدم جديد
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                  <DialogDescription>
                    أضف مستخدم جديد للمنصة مع تحديد الصلاحيات المناسبة
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="username">اسم المستخدم</Label>
                    <Input
                      id="username"
                      value={userForm.username}
                      onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="اسم المستخدم"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="البريد الإلكتروني"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      id="password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="كلمة المرور"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      checked={userForm.isAdmin}
                      onChange={(e) => setUserForm(prev => ({ ...prev, isAdmin: e.target.checked }))}
                    />
                    <Label htmlFor="isAdmin">مدير</Label>
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    إضافة المستخدم
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-right p-3 text-gray-400">اسم المستخدم</th>
                  <th className="text-right p-3 text-gray-400">البريد الإلكتروني</th>
                  <th className="text-right p-3 text-gray-400">الدور</th>
                  <th className="text-right p-3 text-gray-400">تاريخ الإنضمام</th>
                  <th className="text-right p-3 text-gray-400">المفضلة</th>
                  <th className="text-right p-3 text-gray-400">النشاط</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800">
                    <td className="p-3 text-white">{user.username}</td>
                    <td className="p-3 text-gray-300">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isAdmin 
                          ? 'bg-orange-500/20 text-orange-500' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.isAdmin ? 'مدير' : 'مستخدم'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-300">{formatDate(user.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-gray-300">{user.favorites?.length || 0}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-300">{user.watchHistory?.length || 0}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}