import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
import { Briefcase, DollarSign, Edit2, Trash2 } from 'lucide-react';

interface PortfolioListProps {
  portfolios: DocumentData[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  editingPortfolio: string | null;
  setEditingPortfolio: (id: string | null) => void;
}

const PortfolioList: React.FC<PortfolioListProps> = ({ 
  portfolios, 
  onDelete, 
  onEdit, 
  editingPortfolio, 
  setEditingPortfolio 
}) => {
  const [editName, setEditName] = useState('');

  const calculateTotalValue = (stocks: any[]) => {
    return stocks.reduce((total, stock) => total + stock.price, 0);
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (editName.trim()) {
      onEdit(id, editName.trim());
      setEditName('');
    }
  };

  return (
    <div className="mt-6">
      {portfolios.length === 0 ? (
        <p className="text-gray-400 text-center py-8">You don't have any portfolios yet. Create one to get started!</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <li key={portfolio.id} className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Briefcase className="text-blue-400 mr-3" size={24} />
                  {editingPortfolio === portfolio.id ? (
                    <form onSubmit={(e) => handleEditSubmit(e, portfolio.id)} className="flex">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-gray-600 text-white px-2 py-1 rounded mr-2"
                        placeholder="New name"
                      />
                      <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
                    </form>
                  ) : (
                    <h3 className="text-xl font-semibold text-white">{portfolio.name}</h3>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingPortfolio(portfolio.id);
                      setEditName(portfolio.name);
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(portfolio.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center text-gray-300 mb-4">
                <DollarSign className="mr-2" size={18} />
                <span>Total value: ${calculateTotalValue(portfolio.stocks || []).toFixed(2)}</span>
              </div>
              <p className="text-gray-400 mb-4">
                {portfolio.stocks?.length || 0} stocks in portfolio
              </p>
              <Link
                to={`/portfolio/${portfolio.id}`}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PortfolioList;