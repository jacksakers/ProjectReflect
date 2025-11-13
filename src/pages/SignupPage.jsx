/**
 * SignupPage Component
 * 
 * User registration screen with:
 * - Email/password/name form
 * - Password confirmation
 * - Link to login page
 * - Gentle error handling
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Those passwords don\'t quite match. Let\'s try again?');
      return;
    }

    if (password.length < 6) {
      setError('For your security, please choose a password with at least 6 characters');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await signup(email, password, displayName);
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      
      // Gentle error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('It looks like you already have an account with us. Want to sign in instead?');
      } else if (err.code === 'auth/invalid-email') {
        setError('That email address doesn\'t look quite right. Could you check it?');
      } else if (err.code === 'auth/weak-password') {
        setError('Let\'s make your password a bit stronger for your safety');
      } else {
        setError('A small hiccup occurred. Let\'s try that again gently.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="font-nunito text-3xl font-bold text-purple-900 mb-2">
            Begin your journey
          </h1>
          <p className="font-nunito text-lg text-purple-700">
            Create your personal space for reflection
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-orange-100 border-2 border-orange-400 rounded-xl p-4">
                <p className="font-nunito text-purple-900">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="displayName" className="block font-nunito text-sm font-semibold text-purple-900 mb-2">
                Name (optional)
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-purple-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito"
                placeholder="What should we call you?"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-nunito text-sm font-semibold text-purple-900 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-purple-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito"
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
                className="w-full p-4 rounded-xl border-2 border-purple-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito"
                placeholder="At least 6 characters"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block font-nunito text-sm font-semibold text-purple-900 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-purple-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-4 bg-purple-600 text-white rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating your space...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="font-nunito text-purple-700">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
