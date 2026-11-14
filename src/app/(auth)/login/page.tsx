'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CompanionLogo } from '@/components/ui/logo';
import { signInAction } from '../actions';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'customer';

  const [role, setRole] = React.useState<'customer' | 'companion' | 'admin'>(
    defaultRole as 'customer' | 'companion' | 'admin'
  );
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await signInAction(formData);

    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
    } else if (result.redirectTo) {
      router.push(result.redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-charcoal">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-5">
          <CompanionLogo href="/" size="lg" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-navy-900">Welcome back</h2>
        <p className="mt-1 text-xs text-charcoal-muted">
          Sign in to your Companion platform account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-8 border border-charcoal-border shadow-card rounded-3xl bg-white">
          {/* Role Segmented Selector */}
          <div className="flex rounded-2xl bg-navy-50 p-1 mb-6 border border-charcoal-border">
            {(['customer', 'companion', 'admin'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 rounded-xl py-2 text-xs font-bold capitalize transition-all ${
                  role === r
                    ? 'bg-navy-900 text-white shadow-subtle'
                    : 'text-charcoal-muted hover:text-navy-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="role" value={role} />

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-navy-900 hover:underline font-bold"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold h-11 rounded-xl shadow-subtle mt-2"
            >
              Sign In as {role.charAt(0).toUpperCase() + role.slice(1)} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-charcoal-border text-center text-xs text-charcoal-muted">
            Don’t have an account yet?{' '}
            <Link href={`/signup?role=${role}`} className="font-bold text-navy-900 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-900" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
