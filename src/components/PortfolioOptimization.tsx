import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, BarChart2, PieChart, AlertTriangle, ChevronDown, Briefcase, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import MonteCarloOptimization from './MonteCarloOptimization';
import MeanVarianceOptimization from './MeanVarianceOptimization';
import OptimizationTechniques from './OptimizationTechniques';

const PortfolioOptimization: React.FC = () => {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
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

  const renderOptimizationComponent = () => {
    switch (selectedTechnique) {
      case 'monte-carlo':
        return <MonteCarloOptimization portfolio={selectedPortfolio} />;
      case 'mean-variance':
        return <MeanVarianceOptimization portfolio={selectedPortfolio} />;
      case 'black-litterman':
        return <div className="text-center text-white">Black-Litterman Model (Not implemented)</div>;
      case 'risk-parity':
        return <div className="text-center text-white">Risk Parity Model (Not implemented)</div>;
      default:
        return null;
    }
  };

  const getTechniqueIcon = (technique: string) => {
    switch (technique) {
      case 'monte-carlo':
        return <TrendingUp className="mr-2" size={24} />;
      case 'mean-variance':
        return <BarChart2 className="mr-2" size={24} />;
      case 'black-litterman':
        return <PieChart className="mr-2" size={24} />;
      case 'risk-parity':
        return <Activity className="mr-2" size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/portfolio-hub')}
          className="mb-8 text-white flex items-center hover:text-blue-300 transition-colors duration-300 bg-gray-800 px-4 py-2 rounded-full shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Hub
        </button>
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Portfolio Optimization</h1>
        
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg relative mb-8 animate-fade-in" role="alert">
            <div className="flex items-center">
              <AlertTriangle className="mr-2" size={24} />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 animate-fade-in">
          {!selectedTechnique ? (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-white text-center">Choose an Optimization Technique</h2>
              <OptimizationTechniques onSelectTechnique={setSelectedTechnique} />
            </>
          ) : !selectedPortfolio ? (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-white text-center">Select a Portfolio to Optimize</h2>
              {portfolios.length === 0 ? (
                <p className="text-gray-400 text-center">No portfolios available. Create a portfolio first.</p>
              ) : (
                <div className="space-y-4">
                  {portfolios.map((portfolio) => (
                    <button
                      key={portfolio.id}
                      onClick={() => setSelectedPortfolio(portfolio)}
                      className="w-full flex items-center justify-between p-4 rounded-lg transition-colors bg-gray-700 text-white hover:bg-gray-600 hover:shadow-md"
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
            </>
          ) : (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => {
                    setSelectedPortfolio(null);
                    setSelectedTechnique(null);
                  }}
                  className="text-white flex items-center hover:text-blue-300 transition-colors duration-300"
                >
                  <ArrowLeft className="mr-2" size={18} />
                  Change Technique
                </button>
                <button
                  onClick={() => setSelectedPortfolio(null)}
                  className="text-white flex items-center hover:text-blue-300 transition-colors duration-300"
                >
                  <Briefcase className="mr-2" size={18} />
                  Change Portfolio
                </button>
              </div>
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h2 className="text-2xl font-semibold mb-2 text-white flex items-center">
                  {getTechniqueIcon(selectedTechnique)}
                  {selectedTechnique.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h2>
                <p className="text-gray-300">Optimizing: {selectedPortfolio.name}</p>
              </div>
              {renderOptimizationComponent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioOptimization;