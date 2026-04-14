import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiSave } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the session/token for recovery
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expired or invalid. Please request a new reset link.');
        navigate('/admin/login');
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;
      
      toast.success('Password updated successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error(error.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface w-full max-w-md p-8">
        <h1 className="mb-2 text-2xl font-semibold text-white">Reset Password</h1>
        <p className="mb-6 text-sm text-slate-400">Please enter your new password below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">New Password</span>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                className="input-base pl-10" 
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Confirm New Password</span>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••" 
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
            {loading ? 'Updating...' : 'Update Password'}
            {!loading && <FiSave className="ml-2 h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
