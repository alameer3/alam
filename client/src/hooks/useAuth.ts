import { useState, useEffect } from 'react';
import type { User } from '../../shared/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    // محاكاة المستخدم المدير للاختبار
    // في التطبيق الحقيقي، سيتم جلب هذا من الخادم
    const mockAdminUser: User = {
      id: 1,
      username: 'admin',
      email: 'admin@ak.sv',
      firstName: 'مدير',
      lastName: 'النظام',
      avatar: null,
      role: 'admin',
      isActive: true,
      lastLogin: new Date().toISOString(),
      joinDate: new Date().toISOString(),
      preferences: {
        language: 'ar',
        theme: 'light',
        notifications: true
      }
    };

    // محاكاة التحقق من المصادقة
    setTimeout(() => {
      setState({
        user: mockAdminUser,
        isAuthenticated: true,
        loading: false
      });
    }, 500);
  }, []);

  return state;
}