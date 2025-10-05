import api from '../axios';
import { AxiosError } from 'axios';

// ---------- Interfaces ----------

export interface User {
  email?: string;
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
  // ✅ Login
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await api.post<LoginResponse>('/Auth/login', {
        email,
        password
      });

      const user: User = {
        name: response.data.userName,
        role: response.data.role,
        email
      };

      return {
        token: response.data.token,
        user
      };
    } catch (error: unknown) {
      throw this.handleApiError(error);
    }
  },

  // ✅ Forgot Password (send OTP)
  async forgotPassword(email: string): Promise<MessageResponse> {
    try {
      const response = await api.post('/Auth/forgot-password', { email });
      return {
        message: response.data,
        success: true
      };
    } catch (error: unknown) {
      throw this.handleApiError(error);
    }
  },

  // ✅ Verify OTP
  async verifyOtp(email: string, otpCode: string): Promise<MessageResponse> {
    try {
      const response = await api.post('/Auth/verify-otp', {
        email,
        otpCode
      });
      return {
        message: response.data,
        success: true
      };
    } catch (error: unknown) {
      throw this.handleApiError(error);
    }
  },

  // ✅ Resend OTP
  async resendOtp(email: string): Promise<MessageResponse> {
    try {
      const response = await api.post('/Auth/resend-otp', { email });
      return {
        message: response.data,
        success: true
      };
    } catch (error: unknown) {
      throw this.handleApiError(error);
    }
  },

  // ✅ Reset Password (requires only email and newPassword according to your API)
  async resetPassword(email: string, newPassword: string): Promise<MessageResponse> {
    try {
      const response = await api.post('/Auth/reset-password', {
        email,
        newPassword
      });
      return {
        message: response.data,
        success: true
      };
    } catch (error: unknown) {
      throw this.handleApiError(error);
    }
  },

  // ---------- Error Handling ----------
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