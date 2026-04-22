import { api } from './axios';
import { User } from '../store/auth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface SendOtpData {
  phone: string;
}

interface VerifyOtpData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export async function sendOtp(phone: string): Promise<SendOtpData> {
  const { data } = await api.post<ApiResponse<SendOtpData>>('/auth/send-otp', { phone });
  return data.data;
}

export async function verifyOtp(phone: string, code: string): Promise<VerifyOtpData> {
  const { data } = await api.post<ApiResponse<VerifyOtpData>>('/auth/verify-otp', { phone, code });
  return data.data;
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken });
}
