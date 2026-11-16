import axios, { type AxiosRequestConfig } from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

export type ApiEnvelope<T> = { success: true; message: string; data: T };

export const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/** Sends a request and unwraps the common API success envelope. */
export async function http<T>(path: string, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await apiClient.request<ApiEnvelope<T>>({ url: path, ...config });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || error.message || 'Request failed');
    }
    throw error;
  }
}
