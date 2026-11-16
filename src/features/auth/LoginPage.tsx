import { AuthForm } from './AuthForm';
import { useAuth } from '../../app/providers';

export function LoginPage() {
  const { authenticate } = useAuth();
  return <AuthForm mode="login" onAuthenticated={authenticate} />;
}
