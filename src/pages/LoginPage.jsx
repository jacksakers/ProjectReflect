/**
 * LoginPage Component
 * 
 * User login screen with:
 * - Email/password form
 * - Link to signup page
 * - Gentle error handling
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      
      // Gentle error messages
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError('We couldn\'t find an account with those details. Double-check your email and password?');
      } else if (err.code === 'auth/wrong-password') {
        setError('That password doesn\'t seem quite right. Want to try again?');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Let\'s take a gentle pause. Too many attempts - please try again in a moment.');
      } else {
        setError('A small hiccup occurred. Let\'s try that again gently.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-peach-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="font-nunito text-3xl font-bold text-purple-900 mb-2">
            Welcome back
          </h1>
          <p className="font-nunito text-lg text-mauve-700">
            Continue your journey of reflection
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-peach-100 border-2 border-peach-400 rounded-xl p-4">
                <p className="font-nunito text-purple-900">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block font-nunito text-sm font-semibold text-purple-900 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-mauve-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito"
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-nunito text-sm font-semibold text-purple-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-mauve-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-4 bg-purple-600 text-white rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="font-nunito text-mauve-700">
            New to Project Reflect?{' '}
            <Link to="/signup" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
