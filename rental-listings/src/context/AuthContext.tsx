import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Check your email to verify your account');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.user?.confirmed_at) {
          toast.error('Please verify your email before signing in');
        } else {
          toast.success('Successfully signed in');
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" />

      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full" />

      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>

      <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-blue-500">
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </button>
    </form>
  );
}
