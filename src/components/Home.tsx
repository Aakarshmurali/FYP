import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center px-4">
        <TrendingUp className="mx-auto text-blue-500 mb-8" size={64} />
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Portfolio Optimizer</h1>
        <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Optimize your investment portfolio with advanced analytics and real-time market data.
          Take control of your financial future today.
        </p>
        {user ? (
          <Link
            to="/portfolio-hub"
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center shadow-md hover:shadow-lg"
          >
            Go to Portfolio Hub
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        ) : (
          <Link
            to="/auth"
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center shadow-md hover:shadow-lg"
          >
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;