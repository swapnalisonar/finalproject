import { supabase } from './supabase';

export async function login(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error?.message || null;
}

export async function isLoggedIn() {
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}

export async function logout() {
  await supabase.auth.signOut();
}
