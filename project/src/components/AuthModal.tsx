import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Demo sign up - just store in localStorage
        const demoUser = {
          id: Date.now().toString(),
          email: email,
          created_at: new Date().toISOString()
        };
        localStorage.setItem('demo-user', JSON.stringify(demoUser));
        setSuccess('Account created successfully! Signing you in...');
        setTimeout(() => {
          onSuccess?.(demoUser);
          onClose();
        }, 1000);
      } else {
        // Demo sign in - check if user exists
        const existingUser = localStorage.getItem('demo-user');
        if (existingUser) {
          const user = JSON.parse(existingUser);
          onSuccess?.(user);
          onClose();
        } else {
          setError('No account found. Please create an account first.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowPassword(false);
    setLoading(false);
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 max-w-md w-full scale-in"
        style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User 
              size={24} 
              style={{ color: '#3B82F6', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
            />
            <h2 
              className="text-xl font-bold"
              style={{ color: 'white', textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 transition-all hover:scale-110 ripple"
            style={{ 
              color: 'white', 
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50">
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus-ring text-white placeholder-white/60 backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg focus-ring text-white placeholder-white/60 backdrop-blur-sm"
                placeholder="Enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus-ring text-white placeholder-white/60 backdrop-blur-sm"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-medium transition-all hover-lift ripple disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(59, 130, 246, 0.8)',
              color: 'white',
              border: '1px solid rgba(59, 130, 246, 1)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
            }}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            onClick={switchMode}
            className="mt-1 text-blue-300 hover:text-blue-200 font-medium transition-colors"
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};