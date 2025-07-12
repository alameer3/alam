import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Settings, LogOut, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuthData } from '@/hooks/useAuth';

const profileSchema = z.object({
  firstName: z.string().max(50, 'الاسم الأول يجب أن يكون أقل من 50 حرف').optional(),
  lastName: z.string().max(50, 'الاسم الأخير يجب أن يكون أقل من 50 حرف').optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string().min(6, 'كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function UserProfile() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const { toast } = useToast();
  const { user, updateProfile, changePassword, logout, isLoading } = useAuthData();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile(data);
      
      if (result.success) {
        toast({
          title: "تم تحديث الملف الشخصي",
          description: result.message,
        });
        setIsProfileOpen(false);
      } else {
        toast({
          title: "فشل التحديث",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      
      if (result.success) {
        toast({
          title: "تم تغيير كلمة المرور",
          description: result.message,
        });
        setIsPasswordOpen(false);
        passwordForm.reset();
      } else {
        toast({
          title: "فشل تغيير كلمة المرور",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.profileImageUrl || ''} alt={user.firstName || user.username} />
        <AvatarFallback>
          {user.firstName ? user.firstName.charAt(0) : user.username.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="hidden md:block">
        <p className="text-sm font-medium">{user.firstName || user.username}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>

      <div className="flex items-center gap-1">
        {/* تحديث الملف الشخصي */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Edit3 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>تحديث الملف الشخصي</DialogTitle>
              <DialogDescription>
                قم بتحديث معلوماتك الشخصية
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    {...profileForm.register('firstName')}
                    placeholder="الاسم الأول"
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">الاسم الأخير</Label>
                  <Input
                    id="lastName"
                    {...profileForm.register('lastName')}
                    placeholder="الاسم الأخير"
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register('email')}
                  placeholder="البريد الإلكتروني"
                />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'جاري التحديث...' : 'تحديث'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* تغيير كلمة المرور */}
        <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>تغيير كلمة المرور</DialogTitle>
              <DialogDescription>
                قم بتغيير كلمة المرور الحالية إلى كلمة مرور جديدة
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register('currentPassword')}
                  placeholder="كلمة المرور الحالية"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register('newPassword')}
                  placeholder="كلمة المرور الجديدة"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register('confirmPassword')}
                  placeholder="تأكيد كلمة المرور"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* تسجيل الخروج */}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}