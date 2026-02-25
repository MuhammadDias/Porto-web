import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLock, FiMail } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message || 'Login failed');
        return;
      }
      if (data?.user) {
        toast.success('Login successful');
        navigate('/admin');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface w-full max-w-md p-8">
        <h1 className="mb-2 text-2xl font-semibold text-white">Admin Login</h1>
        <p className="mb-6 text-sm text-slate-400">Sign in using your Supabase account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" required className="input-base pl-10" />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required className="input-base pl-10" />
            </div>
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <FiArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
