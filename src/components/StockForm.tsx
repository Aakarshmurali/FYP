import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { validateTicker } from '../utils/stockApi';

interface StockFormProps {
  onSubmit: (ticker: string, price: number) => void;
}

const StockForm: React.FC<StockFormProps> = ({ onSubmit }) => {
  const [ticker, setTicker] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!ticker || !price) {
      setError('Please enter both ticker and price.');
      setIsLoading(false);
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Please enter a valid positive number for price.');
      setIsLoading(false);
      return;
    }

    try {
      const isValid = await validateTicker(ticker);
      if (isValid) {
        onSubmit(ticker.toUpperCase(), priceValue);
        setTicker('');
        setPrice('');
      } else {
        setError('Invalid ticker symbol. Please try again.');
      }
    } catch (error) {
      setError('Error validating ticker. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="ticker" className="block text-sm font-medium text-gray-300 mb-1">Ticker Symbol</label>
          <input
            type="text"
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., AAPL"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter price"
            step="0.01"
            min="0.01"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
        ) : (
          <Plus className="mr-2" size={18} />
        )}
        {isLoading ? 'Adding...' : 'Add Stock'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default StockForm;