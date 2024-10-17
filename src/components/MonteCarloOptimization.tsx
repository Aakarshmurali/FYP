import React, { useState, useEffect } from 'react';
import { PieChart, AlertTriangle } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getMonteCarloResults } from '../utils/monteCarloApi';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Portfolio {
  id: string;
  name: string;
  stocks: { ticker: string; price: number }[];
}

interface MonteCarloOptimizationProps {
  portfolio: Portfolio;
}

interface MonteCarloResult {
  tickers: string[];
  weights: number[];
  sharpe: number;
}

const MonteCarloOptimization: React.FC<MonteCarloOptimizationProps> = ({ portfolio }) => {
  const [optimizationResult, setOptimizationResult] = useState<MonteCarloResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonteCarloResults();
  }, [portfolio]);

  const fetchMonteCarloResults = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getMonteCarloResults(portfolio.id);
      setOptimizationResult(result);
    } catch (error) {
      console.error('Error fetching Monte Carlo results:', error);
      setError('Failed to fetch Monte Carlo results. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPieChart = () => {
    if (!optimizationResult) return null;

    const data = {
      labels: optimizationResult.tickers,
      datasets: [{
        data: optimizationResult.weights.map(w => w * 100), // Convert to percentages
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
        ],
      }],
    };

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-white">Optimized Portfolio Allocation</h3>
        <div className="h-64 md:h-80">
          <Pie data={data} options={{ 
            plugins: { 
              legend: { 
                labels: { color: 'white' },
                position: 'right' as const,
              } 
            },
            responsive: true,
            maintainAspectRatio: false,
          }} />
        </div>
      </div>
    );
  };

  const renderAllocationTable = () => {
    if (!optimizationResult) return null;

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-white">Optimized Allocation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-white">Ticker</th>
                <th className="p-3 text-white">Weight</th>
              </tr>
            </thead>
            <tbody>
              {optimizationResult.tickers.map((ticker, index) => (
                <tr key={ticker} className="border-b border-gray-600">
                  <td className="p-3 text-white">{ticker}</td>
                  <td className="p-3 text-white">{(optimizationResult.weights[index] * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" size={24} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Monte Carlo Simulation Results</h2>
      {optimizationResult && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-white">Optimization Summary</h3>
            <p className="text-gray-300">Sharpe Ratio: {optimizationResult.sharpe.toFixed(4)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {renderPieChart()}
            </div>
            <div>
              {renderAllocationTable()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonteCarloOptimization;