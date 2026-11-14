'use client';

import { useAuthContext } from '@/context/AuthContext';

export function useUser() {
  const { user, profile, role, isLoading, signOut, refreshProfile } = useAuthContext();

  return {
    user,
    profile,
    role,
    isLoading,
    isAuthenticated: Boolean(user),
    isCustomer: role === 'customer',
    isCompanion: role === 'companion',
    isAdmin: role === 'admin',
    signOut,
    refreshProfile,
  };
}

