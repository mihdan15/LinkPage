// Auth Service
// Handle user authentication with Supabase

import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string,
  slug: string
): Promise<AuthUser> {
  // First check if slug is available
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existingProfile) {
    throw new Error('This username is already taken');
  }

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Failed to create user');
  }

  // Create profile for the user
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    slug: slug.toLowerCase(),
    display_name: displayName,
  });

  if (profileError) {
    // Rollback: delete the auth user if profile creation fails
    await supabase.auth.admin?.deleteUser(data.user.id);
    throw new Error(`Failed to create profile: ${profileError.message}`);
  }

  return {
    id: data.user.id,
    email: data.user.email || email,
  };
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Failed to sign in');
  }

  return {
    id: data.user.id,
    email: data.user.email || email,
  };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
  };
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user || null);
    }
  );

  return () => subscription.unsubscribe();
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('slug', slug.toLowerCase())
    .single();

  return !data;
}
