import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiSend } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) throw error;
      
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error(error.message || 'Error sending reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface w-full max-w-md p-8">
        <Link to="/admin/login" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <FiArrowLeft /> Back to Login
        </Link>
        
        <h1 className="mb-2 text-2xl font-semibold text-white">Forgot Password</h1>
        <p className="mb-6 text-sm text-slate-400">Enter your email and we'll send you a link to reset your password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email Address</span>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="your@email.com" 
                required 
                className="input-base pl-10" 
              />
            </div>
          </label>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
            {!loading && <FiSend className="ml-2 h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
