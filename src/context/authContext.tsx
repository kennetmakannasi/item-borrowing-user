import { createContext, useContext, type ReactNode } from 'react'; // Tambahkan createContext & useContext
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { getProfileApi, logoutApi } from '../api/auth';
import type { UserProfile } from '../interfaces/auth';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const token = Cookies.get('auth_token');

  const { 
    data: profileRes, 
    isLoading, 
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: getProfileApi,
    enabled: !!token,
    retry: false,    
  });

  const user = profileRes?.success ? profileRes.data : null;

  const login = (newToken: string) => {
    Cookies.set('auth_token', newToken, { expires: 1, path: '/' });
    queryClient.invalidateQueries({ queryKey: ['authUser'] });
    window.location.replace('/')
  };

  const logout = () => {
    Cookies.remove('auth_token');
    queryClient.setQueryData(['authUser'], null); 
    queryClient.clear(); 
    logoutApi();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};