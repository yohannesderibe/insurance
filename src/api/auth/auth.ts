
import api from '../axios';
import { AxiosError } from 'axios';

// ---------- Interfaces ----------

export interface User {
  email?: string; // Not provided in response
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  userName: string;
  role: string;
}

export interface MessageResponse {
  message: string;
  success?: boolean;
  code?: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// ---------- Type Guard for AxiosError ----------

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

// ---------- Real API Implementation ----------

const realApi = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await api.post<LoginResponse>('/Auth/login', {
        email,
        password
      });

      // Construct User manually
      const user: User = {
        name: response.data.userName,
        role: response.data.role,
        email: email // since backend doesn't return email
      };

      return {
        token: response.data.token,
        user
      };
    } catch (error: unknown) {
      throw this.handleApiError(error);
    }
  },

  async forgotPassword(email: string): Promise<MessageResponse> {
    try {
      const response = await api.post('/Auth/send-otp', { email });
      return {
        message: response.data,
        success: true
      };
    } catch (error: unknown) {
      throw this.handleApiError(error);
    }
  },

  async verifyOtp(email: string, otp: string): Promise<MessageResponse> {
    try {
      const response = await api.post('/Auth/verify-otp', { email, otp });
      return {
        message: response.data,
        success: true
      };
    } catch (error: unknown) {
      throw this.handleApiError(error);
    }
  },

  async resetPassword(email: string, newPassword: string): Promise<MessageResponse> {
    try {
      const response = await api.post(
        `/Auth/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`
      );
      return {
        message: response.data,
        success: true
      };
    } catch (error: unknown) {
      throw this.handleApiError(error);
    }
  },


  
 async setAppUserPassword(token: string, password: string): Promise<MessageResponse> {
    try {
      const response = await api.post('/AppUser/set-password', null, {
        params: {
          token,
          newPassword: password
        }
      });
      return {
        message: response.data,
        success: true
      };
    } catch (error: unknown) {
      throw this.handleApiError(error);
    }
  },


  async setPassword(token: string, password: string): Promise<MessageResponse> {
  try {
    const response = await api.post('/Merchant/reset-password', {
      token,
      newPassword: password, // ✅ this is the required change
    });

    return {
      message: response.data,
      success: true
    };
  } catch (error: unknown) {
    throw this.handleApiError(error); 
  }
}
,

  handleApiError(error: unknown): ErrorResponse {
    if (isAxiosError(error)) {
      if (error.response) {
        const data = error.response.data as any;
        return {
          error: data?.error || 'API Error',
          message: data?.message || 'An error occurred',
          statusCode: error.response.status
        };
      }
      return {
        error: 'Network Error',
        message: error.message,
        statusCode: 503
      };
    }
    return {
      error: 'Application Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      statusCode: 500
    };
  }
};

// ---------- Export Auth API ----------

const authApi = realApi;
export default authApi;
