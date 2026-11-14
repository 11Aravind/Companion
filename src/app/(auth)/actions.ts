'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { UserRole } from '@/types/user';

const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SignUpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['customer', 'companion']),
  city: z.string().optional(),
  headline: z.string().optional(),
});

export type AuthActionResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const parsed = SignInSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { success: false, error: authError?.message || 'Invalid email or password' };
  }

  // Fetch user role from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  const role: UserRole = profile?.role || 'customer';

  let destination = '/dashboard';
  if (role === 'companion') destination = '/companion/dashboard';
  else if (role === 'admin') destination = '/admin/dashboard';

  revalidatePath('/', 'layout');
  return { success: true, redirectTo: destination };
}

export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as 'customer' | 'companion';
  const city = (formData.get('city') as string) || 'Chennai';
  const headline = (formData.get('headline') as string) || '';

  const parsed = SignUpSchema.safeParse({
    fullName,
    email,
    phone,
    password,
    role,
    city,
    headline,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        role,
      },
    },
  });

  if (authError || !authData.user) {
    return { success: false, error: authError?.message || 'Failed to create account' };
  }

  // Ensure role-specific profile row exists
  if (role === 'companion') {
    await supabase.from('companion_profiles').upsert({
      id: authData.user.id,
      headline: headline || 'Personal Companion & Support Specialist',
      bio: '',
      city,
      hourly_rate: 350.0,
      service_radius_km: 25,
      languages: ['English'],
      is_online: false,
      is_verified: false,
      identity_status: 'unverified',
    });
  } else {
    await supabase.from('customer_profiles').upsert({
      id: authData.user.id,
      preferences: {},
      saved_places: [],
    });
  }

  const destination = role === 'companion' ? '/companion/dashboard' : '/dashboard';
  revalidatePath('/', 'layout');
  return { success: true, redirectTo: destination };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function resetPasswordAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string;
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Valid email address is required' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

