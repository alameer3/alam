import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequestForAuth as apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  loadUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      login: async (username: string, password: string) => {
        try {
          set({ isLoading: true });
          
          const response = await apiRequest('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          if (response.token && response.user) {
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // تعيين الـ token في الـ localStorage وheaders
            localStorage.setItem('auth_token', response.token);
            
            return { success: true, message: response.message || 'تم تسجيل الدخول بنجاح' };
          } else {
            set({ isLoading: false });
            return { success: false, message: 'فشل في تسجيل الدخول' };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.message || 'خطأ في تسجيل الدخول' 
          };
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true });
          
          const response = await apiRequest('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.token && response.user) {
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            localStorage.setItem('auth_token', response.token);
            
            return { success: true, message: response.message || 'تم التسجيل بنجاح' };
          } else {
            set({ isLoading: false });
            return { success: false, message: 'فشل في التسجيل' };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.message || 'خطأ في التسجيل' 
          };
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          const { token } = get();
          if (!token) {
            return { success: false, message: 'غير مصرح' };
          }

          set({ isLoading: true });
          
          const response = await apiRequest('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          if (response.user) {
            set({
              user: response.user,
              isLoading: false,
            });
            
            return { success: true, message: response.message || 'تم تحديث الملف الشخصي' };
          } else {
            set({ isLoading: false });
            return { success: false, message: 'فشل في تحديث الملف الشخصي' };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.message || 'خطأ في تحديث الملف الشخصي' 
          };
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          const { token } = get();
          if (!token) {
            return { success: false, message: 'غير مصرح' };
          }

          set({ isLoading: true });
          
          const response = await apiRequest('/api/auth/change-password', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
          });

          set({ isLoading: false });
          
          return { success: true, message: response.message || 'تم تغيير كلمة المرور' };
        } catch (error: any) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.message || 'خطأ في تغيير كلمة المرور' 
          };
        }
      },

      loadUser: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          if (!token) {
            set({ isLoading: false });
            return;
          }

          set({ isLoading: true, token });
          
          const response = await apiRequest('/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.user) {
            set({
              user: response.user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Token غير صحيح، قم بحذفه
            localStorage.removeItem('auth_token');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          // Token غير صحيح أو منتهي الصلاحية
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook للاستخدام السهل في المكونات
export function useAuthData() {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loadUser,
  } = useAuth();

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loadUser,
  };
}