import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioHub = () => {
  const navigate = useNavigate();

  const BackButton = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className="mb-6 text-white flex items-center hover:text-blue-300 transition-colors duration-300 bg-gray-800 px-4 py-2 rounded-full shadow-md hover:shadow-lg"
    >
      <ArrowLeft className="mr-2" size={18} />
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10">
      <div className="container mx-auto px-4">
        <BackButton onClick={() => navigate('/')}>
          Back to Home
        </BackButton>
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 animate-fade-in-down">
            Portfolio Management Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Manage and optimize your investment portfolios with advanced tools
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/dashboard"
            className="bg-gray-800 p-8 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 flex flex-col items-center justify-center text-center transform hover:scale-105"
          >
            <Briefcase size={64} className="mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold mb-2 text-white">Your Portfolios</h2>
            <p className="text-gray-400">View and manage your existing portfolios</p>
          </Link>
          <Link
            to="/optimize"
            className="bg-gray-800 p-8 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 flex flex-col items-center justify-center text-center transform hover:scale-105"
          >
            <TrendingUp size={64} className="mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2 text-white">Optimize Portfolio</h2>
            <p className="text-gray-400">Explore different portfolio optimization techniques</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHub;