import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Briefcase } from 'lucide-react';
import MonteCarloSimulation from './MonteCarloSimulation';

const MonteCarloOptimization = () => {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPortfolios();
    }
  }, [user]);

  const fetchPortfolios = async () => {
    try {
      if (user) {
        const q = query(collection(db, 'portfolios'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedPortfolios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPortfolios(fetchedPortfolios);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setError('Failed to fetch portfolios. Please try again later.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Monte Carlo Optimization</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {!selectedPortfolio ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-4 text-white">Select Portfolio to Optimize</h3>
          {portfolios.length === 0 ? (
            <p className="text-gray-400">No portfolios available. Create a portfolio first.</p>
          ) : (
            <div className="space-y-4">
              {portfolios.map((portfolio) => (
                <button
                  key={portfolio.id}
                  onClick={() => setSelectedPortfolio(portfolio)}
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  <span className="flex items-center">
                    <Briefcase className="mr-3" size={24} />
                    {portfolio.name}
                  </span>
                  <span className="text-sm">
                    {portfolio.stocks?.length || 0} stocks
                  </span>
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
            <Briefcase className="mr-2" size={18} />
            Back to Portfolio Selection
          </button>
          <MonteCarloSimulation portfolio={selectedPortfolio} />
        </div>
      )}
    </div>
  );
};

export default MonteCarloOptimization;