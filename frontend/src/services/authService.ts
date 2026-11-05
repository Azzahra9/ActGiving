import api from '../lib/axios';

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    reset_token: string;
    reset_url?: string;
    expires_in_minutes: number;
  };
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const authService = {
  /**
   * Request password reset token and send email
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset user password using token
   * POST /api/auth/reset-password
   */
  resetPassword: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>('/auth/reset-password', payload);
    return response.data;
  },
};

export default authService;
