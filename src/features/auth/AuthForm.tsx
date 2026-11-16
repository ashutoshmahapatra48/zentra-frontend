import { useState, type FormEvent } from 'react';
import { login, register } from './api';
import type { User } from './api';

export function AuthForm({
  mode,
  onAuthenticated,
}: {
  mode: 'login' | 'register';
  onAuthenticated: (user: User) => void;
}) {
  const registering = mode === 'register';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = registering
        ? await register({ fullName, email, password })
        : await login({ email, password });
      onAuthenticated(result.user);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-5 text-ink">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-line bg-white p-7 shadow-lg"
      >
        <h1 className="font-display text-3xl font-semibold">
          {registering ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mb-6 mt-2 text-sm text-muted">
          {registering ? 'Register to start chatting.' : 'Log in to continue your conversations.'}
        </p>
        {registering && (
          <input
            required
            maxLength={100}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="mb-3 w-full rounded-lg border border-line p-3"
          />
        )}
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-3 w-full rounded-lg border border-line p-3"
        />
        <input
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (at least 8 characters)"
          className="mb-4 w-full rounded-lg border border-line p-3"
        />
        {error && (
          <p role="alert" className="mb-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="w-full rounded-lg bg-primary p-3 font-medium text-white disabled:opacity-50"
        >
          {busy ? 'Please wait…' : registering ? 'Register' : 'Log in'}
        </button>
        <a
          href={registering ? '/login' : '/register'}
          className="mt-4 block text-center text-sm text-primary"
        >
          {registering ? 'Already registered? Log in' : 'New here? Create an account'}
        </a>
      </form>
    </main>
  );
}
