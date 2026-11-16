import { useAuth } from './providers';
import { ChatPage } from '../features/conversations/ChatPage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';

export function AppRouter() {
  const { user, loading } = useAuth();
  if (loading)
    return <main className="grid min-h-screen place-items-center text-muted">Loading Zentra…</main>;
  if (user) return <ChatPage />;
  return window.location.pathname === '/register' ? <RegisterPage /> : <LoginPage />;
}
