import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TrendingUp, Mail, Lock } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/portfolio-hub');
    } catch (error) {
      console.error('Authentication error:', error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError('This email is already in use. Please try logging in.');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address. Please check and try again.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. Please use a stronger password.');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setError('Invalid email or password. Please try again.');
            break;
          default:
            setError('An error occurred. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"}}>
      <div className="bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-xl w-full max-w-md backdrop-blur-sm">
        <div className="text-center mb-8">
          <TrendingUp className="mx-auto text-blue-500 mb-4" size={48} />
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;