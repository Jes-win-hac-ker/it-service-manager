// src/services/authService.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase first.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin emails - customize as needed
const ADMIN_EMAILS = [
  'sajitcr@gmail.com',
  'jeswinjoy654@gmail.com',
  'manager@company.com',
  'support@company.com',
  'admin@example.com'
];

export const authService = {
  // ✅ Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error.message);
      return null;
    }
    return user;
  },

  // ✅ Sign in with role check
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { data: null, error };

    const user = data.user;
    if (!user) return { data: null, error: new Error("No user returned") };

    // Determine role
    const role = ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")
      ? "admin"
      : "client";

    // Save role for app usage
    localStorage.setItem("role", role);

    return { data: { user, role }, error: null };
  },

  // ✅ Sign up
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username,
        },
      },
    });
    return { data, error };
  },

  // ✅ Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem("role"); // clear role on logout
    return { error };
  },

  // ✅ Role helpers
  isAdmin(email: string) {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  },

  getUserRole(email: string) {
    return ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "client";
  },

  // ✅ Auth state listener
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  getSupabaseClient() {
    return supabase;
  }
};
