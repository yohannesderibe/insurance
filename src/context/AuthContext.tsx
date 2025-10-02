// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react';
import { jwtDecode } from 'jwt-decode';
import authApi from '../api/auth/auth';
import type { AuthContextType, AuthUser, DecodedToken, LoginResponse } from '../type/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper functions for privilege checking
  const hasPrivilege = (privilege: string): boolean => {
    return user?.privileges?.includes(privilege) ?? false;
  };



  const hasAnyPrivilege = (privileges: string[]): boolean => {
    if (!user?.privileges) return false;
    return privileges.some(priv => user.privileges.includes(priv));
  };

  const hasAllPrivileges = (privileges: string[]): boolean => {
    if (!user?.privileges) return false;
    return privileges.every(priv => user.privileges.includes(priv));
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  // Decode token and extract user info
  const decodeToken = (token: string): AuthUser | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log("🔓 Full decoded token:", decoded);

      // privileges might come as an array of objects
      const rawPrivileges = (decoded.privileges || decoded.privilege || []);
      const normalizedPrivileges: string[] = rawPrivileges.map((p: any) => {
        if (typeof p === "string") {
          return p.toLowerCase().replace(/\s+/g, "_");
        }
        if (p.privilegeName) {
          return p.privilegeName.toLowerCase().replace(/\s+/g, "_");
        }
        return "";
      }).filter((p: string) => p !== "");

      return {
        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || '',
        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '',
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '',
        role: role || '',
        privileges: normalizedPrivileges
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
        console.log("🔓 Stored user:", storedUser);
    if (storedToken) {
      try {
        const decodedUser = decodeToken(storedToken);
        if (decodedUser) {
          setUser(decodedUser);
          setToken(storedToken);
        }
      } catch (err) {
        console.error('Failed to decode stored token:', err);
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response: LoginResponse = await authApi.login(email, password);
      const decodedUser = decodeToken(response.token);
      
      if (decodedUser) {
        setUser(decodedUser);
        setToken(response.token);
        localStorage.setItem('user', JSON.stringify(decodedUser));
        localStorage.setItem('authToken', response.token);
      }
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading,
    hasPrivilege,
    hasAnyPrivilege,
    hasAllPrivileges,
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
