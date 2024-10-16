import React from 'react';
import { TrendingUp, BarChart2, PieChart, Activity } from 'lucide-react';

interface OptimizationTechniquesProps {
  onSelectTechnique: (technique: string) => void;
}

const OptimizationTechniques: React.FC<OptimizationTechniquesProps> = ({ onSelectTechnique }) => {
  const techniques = [
    { id: 'monte-carlo', name: 'Monte Carlo Simulation', icon: TrendingUp, description: 'Uses random sampling to simulate various portfolio outcomes.' },
    { id: 'mean-variance', name: 'Mean-Variance Optimization', icon: BarChart2, description: 'Balances return and risk based on modern portfolio theory.' },
    { id: 'black-litterman', name: 'Black-Litterman Model', icon: PieChart, description: 'Combines market equilibrium with investor views.' },
    { id: 'risk-parity', name: 'Risk Parity', icon: Activity, description: 'Allocates assets based on risk contribution rather than capital allocation.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {techniques.map((technique, index) => (
        <div
          key={technique.id}
          className="bg-gray-700 p-6 rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-300 cursor-pointer transform hover:scale-105"
          onClick={() => onSelectTechnique(technique.id)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <technique.icon className="text-blue-400 mb-4" size={32} />
          <h2 className="text-xl font-bold mb-2 text-white">{technique.name}</h2>
          <p className="text-gray-300">{technique.description}</p>
        </div>
      ))}
    </div>
  );
};

export default OptimizationTechniques;