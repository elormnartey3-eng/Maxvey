import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, KeyRound, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';

interface AdminLoginProps {
  navigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate }) => {
  const { login, isAdmin } = useAuth();
  const [password, setPassword] = useState('MaxveyAdmin2026!');
  const [email, setEmail] = useState('maxwellunusual@gmail.com');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (isAdmin) {
    navigate('/admin');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(password, email);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Invalid administrator credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" showText={true} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/40 border border-red-900/60 rounded-full text-red-400 text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>AUTHENTICATED ADMIN PORTAL</span>
          </div>
          <h1 className="text-2xl font-bold uppercase text-white font-heading">
            MAXVEY MANAGEMENT SYSTEM
          </h1>
          <p className="text-xs text-zinc-400">
            Private administrative control center for Maxwell & authorized managers.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-950/60 border border-red-800 rounded-lg text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-[#121215] border border-[#27272a] rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-[#dc2626]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Admin Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 bg-[#09090b] border border-zinc-700 rounded text-xs text-white font-mono focus:outline-none focus:border-[#dc2626]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Default password: <span className="text-zinc-300">MaxveyAdmin2026!</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'AUTHENTICATING...' : 'ENTER ADMIN DASHBOARD'}</span>
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-zinc-500 hover:text-white inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </button>
          </div>
        </form>

        {/* Security & Google Sign-In Guidance */}
        <div className="p-4 bg-[#0e0e11] border border-[#27272a] rounded-xl text-xs text-zinc-400 space-y-2">
          <div className="flex items-center gap-1.5 text-zinc-200 font-semibold">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Security Architecture Note</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Administrative access is strictly protected by server-side authorization middleware (<code>requireAdmin</code>). Customers cannot access or alter products, stock, or orders without a valid cryptographically signed Bearer session token.
          </p>
        </div>

      </div>
    </div>
  );
};
