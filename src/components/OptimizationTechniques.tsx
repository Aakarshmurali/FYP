import React from 'react';
import { TrendingUp, BarChart2, PieChart } from 'lucide-react';

interface OptimizationTechniquesProps {
  onSelectTechnique: (technique: string) => void;
}

const OptimizationTechniques: React.FC<OptimizationTechniquesProps> = ({ onSelectTechnique }) => {
  const techniques = [
    { id: 'monte-carlo', name: 'Monte Carlo Simulation', icon: TrendingUp, description: 'Uses random sampling to simulate various portfolio outcomes.' },
    { id: 'mean-variance', name: 'Mean-Variance Optimization', icon: BarChart2, description: 'Balances return and risk based on modern portfolio theory.' },
    { id: 'black-litterman', name: 'Black-Litterman Model', icon: PieChart, description: 'Combines market equilibrium with investor views.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {techniques.map((technique) => (
        <div
          key={technique.id}
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer"
          onClick={() => onSelectTechnique(technique.id)}
        >
          <technique.icon className="text-blue-500 mb-4" size={32} />
          <h2 className="text-xl font-bold mb-2 text-white">{technique.name}</h2>
          <p className="text-gray-400">{technique.description}</p>
        </div>
      ))}
    </div>
  );
};

export default OptimizationTechniques;