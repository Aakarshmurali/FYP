import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, BarChart2, PieChart, AlertTriangle, ChevronDown, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import MonteCarloSimulation from './MonteCarloSimulation';

const PortfolioOptimization = () => {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchPortfolios();
    }
  }, [user]);

  const fetchPortfolios = async () => {
    try {
      const q = query(collection(db, 'portfolios'), where('userId', '==', user?.uid));
      const querySnapshot = await getDocs(q);
      const fetchedPortfolios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPortfolios(fetchedPortfolios);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setError('Failed to fetch portfolios. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/portfolio-hub')}
          className="mb-6 text-white flex items-center hover:text-blue-300 transition-colors duration-300 bg-gray-800 px-4 py-2 rounded-full shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Hub
        </button>
        <h1 className="text-4xl font-bold text-white mb-8">Portfolio Optimization</h1>
        
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative mb-6" role="alert">
            <div className="flex items-center">
              <AlertTriangle className="mr-2" size={24} />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {!selectedPortfolio ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Select a Portfolio to Optimize</h2>
            {portfolios.length === 0 ? (
              <p className="text-gray-400">No portfolios available. Create a portfolio first.</p>
            ) : (
              <div className="space-y-4">
                {portfolios.map((portfolio) => (
                  <button
                    key={portfolio.id}
                    onClick={() => setSelectedPortfolio(portfolio)}
                    className="w-full flex items-center justify-between p-4 rounded-lg transition-colors bg-gray-700 text-white hover:bg-gray-600"
                  >
                    <span className="flex items-center">
                      <Briefcase className="mr-3" size={24} />
                      {portfolio.name}
                    </span>
                    <ChevronDown size={20} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedPortfolio(null)}
              className="mb-6 text-white flex items-center hover:text-blue-300"
            >
              <ArrowLeft className="mr-2" size={18} />
              Back to Portfolio Selection
            </button>
            <MonteCarloSimulation portfolio={selectedPortfolio} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioOptimization;