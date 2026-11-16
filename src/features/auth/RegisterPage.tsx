import { AuthForm } from './AuthForm';
import { useAuth } from '../../app/providers';

export function RegisterPage() {
  const { authenticate } = useAuth();
  return <AuthForm mode="register" onAuthenticated={authenticate} />;
}
