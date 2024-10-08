import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface PortfolioFormProps {
  onSubmit: (name: string) => void;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter portfolio name"
          className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <Plus className="mr-2" size={18} />
          Add Portfolio
        </button>
      </div>
    </form>
  );
};

export default PortfolioForm;