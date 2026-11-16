import { http } from '../../lib/http';
import type { User } from '../../types';

export type { User } from '../../types';
export type AuthInput = { fullName?: string; email: string; password: string };
export const currentUser = () => http<{ user: User }>('/auth/me');
export const login = (input: AuthInput) =>
  http<{ user: User }>('/auth/login', { method: 'POST', data: input });
export const register = (input: AuthInput & { fullName: string }) =>
  http<{ user: User }>('/auth/register', { method: 'POST', data: input });
export const logout = () => http<null>('/auth/logout', { method: 'POST' });
