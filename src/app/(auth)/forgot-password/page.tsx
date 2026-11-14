'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CompanionLogo } from '@/components/ui/logo';
import { resetPasswordAction } from '../actions';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await resetPasswordAction(formData);

    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to send reset link.');
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-charcoal">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-5">
          <CompanionLogo href="/" size="lg" />
        </div>
        <h2 className="text-2xl font-black text-navy-900 tracking-tight">Reset your password</h2>
        <p className="mt-1 text-xs text-charcoal-muted">
          Enter your registered email and we'll send you instructions to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="rounded-3xl border border-charcoal-border shadow-card bg-white p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center space-y-3 py-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-navy-900 text-base">Password Reset Link Sent</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                If an account exists for <span className="font-bold text-navy-900">{email}</span>, you will receive an email shortly with reset instructions.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold border-charcoal-border">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-navy-900 block mb-1.5">Registered Email</label>
                <Input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold h-11 rounded-xl shadow-subtle mt-2"
              >
                Send Reset Link
              </Button>

              <div className="pt-4 text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-navy-900 font-bold">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
