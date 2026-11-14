'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, AlertCircle, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CompanionLogo } from '@/components/ui/logo';
import { signUpAction } from '../actions';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'customer';

  const [role, setRole] = React.useState<'customer' | 'companion'>(
    (defaultRole === 'companion' ? 'companion' : 'customer') as 'customer' | 'companion'
  );
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [city, setCity] = React.useState('Chennai');
  const [headline, setHeadline] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set('role', role);

    const result = await signUpAction(formData);

    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to create account. Please check your inputs.');
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
        <h2 className="text-2xl font-black text-navy-900 tracking-tight">Create your account</h2>
        <p className="mt-1 text-xs text-charcoal-muted">
          Join the community for verified companion care and accompaniment
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="rounded-3xl border border-charcoal-border shadow-card bg-white p-6 sm:p-8">
          {/* Role selector */}
          <div className="flex rounded-2xl bg-navy-50 p-1 mb-6 border border-charcoal-border">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'customer'
                  ? 'bg-navy-900 text-white shadow-subtle'
                  : 'text-charcoal-muted hover:text-navy-900'
              }`}
            >
              I need a Companion
            </button>
            <button
              type="button"
              onClick={() => setRole('companion')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'companion'
                  ? 'bg-navy-900 text-white shadow-subtle'
                  : 'text-charcoal-muted hover:text-navy-900'
              }`}
            >
              I want to be a Partner
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1.5">Full Name</label>
              <Input
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                icon={<User className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1.5">Email Address</label>
              <Input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1.5">Phone Number</label>
              <Input
                name="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                icon={<Phone className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy-900 block mb-1.5">Password</label>
              <Input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            {role === 'companion' && (
              <>
                <div>
                  <label className="text-xs font-bold text-navy-900 block mb-1.5">Base Operating City</label>
                  <Input
                    name="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Chennai, Mumbai, Bengaluru"
                    icon={<MapPin className="h-4 w-4" />}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-navy-900 block mb-1.5">Professional Headline</label>
                  <Input
                    name="headline"
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Healthcare Assistant & Patient Support Specialist"
                  />
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Companions undergo government ID verification before receiving live bookings.
                  </span>
                </div>
              </>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold h-11 rounded-xl shadow-subtle mt-2"
            >
              Sign Up as {role === 'companion' ? 'Companion Partner' : 'Customer'}{' '}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-charcoal-border text-center text-xs text-charcoal-muted">
            Already have an account?{' '}
            <Link href={`/login?role=${role}`} className="font-bold text-navy-900 hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-900" />
        </div>
      }
    >
      <SignupForm />
    </React.Suspense>
  );
}
