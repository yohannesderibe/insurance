export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  privileges: string[];
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  hasPrivilege: (privilege: string) => boolean;
  hasAnyPrivilege: (privileges: string[]) => boolean;
  hasAllPrivileges: (privileges: string[]) => boolean;
  hasRole: (role: string) => boolean;
}

export interface DecodedToken {
  ["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]: string;
  ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]: string;
  ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]: string;
  ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]: string;
  privileges?: any[] | string[];
  [key: string]: any;
}

export interface LoginResponse {
  token: string;
}
