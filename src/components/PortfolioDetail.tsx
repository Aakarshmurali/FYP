import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import StockForm from './StockForm';
import { ArrowLeft, Edit2, Trash2, PieChart, Check } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (id && user) {
        const docRef = doc(db, 'portfolios', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          setPortfolio({ id: docSnap.id, ...docSnap.data() });
          setNewName(docSnap.data().name);
        } else {
          navigate('/dashboard');
        }
      }
    };
    fetchPortfolio();
  }, [id, user, navigate]);

  const addStock = async (ticker: string, price: number) => {
    if (portfolio) {
      const updatedStocks = [...(portfolio.stocks || []), { ticker, price }];
      await updateDoc(doc(db, 'portfolios', portfolio.id), { stocks: updatedStocks });
      setPortfolio({ ...portfolio, stocks: updatedStocks });
    }
  };

  const removeStock = async (ticker: string) => {
    if (portfolio) {
      const updatedStocks = portfolio.stocks.filter((stock: any) => stock.ticker !== ticker);
      await updateDoc(doc(db, 'portfolios', portfolio.id), { stocks: updatedStocks });
      setPortfolio({ ...portfolio, stocks: updatedStocks });
    }
  };

  const updateStock = async (oldTicker: string, newTicker: string, newPrice: number) => {
    if (portfolio) {
      const updatedStocks = portfolio.stocks.map((stock: any) =>
        stock.ticker === oldTicker ? { ticker: newTicker, price: newPrice } : stock
      );
      await updateDoc(doc(db, 'portfolios', portfolio.id), { stocks: updatedStocks });
      setPortfolio({ ...portfolio, stocks: updatedStocks });
      setEditingStock(null);
    }
  };

  const editPortfolioName = async () => {
    if (portfolio && newName.trim() !== '') {
      await updateDoc(doc(db, 'portfolios', portfolio.id), { name: newName.trim() });
      setPortfolio({ ...portfolio, name: newName.trim() });
      setEditingName(false);
    }
  };

  const deletePortfolio = async () => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      await deleteDoc(doc(db, 'portfolios', portfolio.id));
      navigate('/dashboard');
    }
  };

  const calculateTotalValue = () => {
    return portfolio?.stocks?.reduce((total: number, stock: any) => total + stock.price, 0) || 0;
  };

  const renderPieChart = () => {
    if (!portfolio || !portfolio.stocks || portfolio.stocks.length === 0) return null;

    const data = {
      labels: portfolio.stocks.map((stock: any) => stock.ticker),
      datasets: [{
        data: portfolio.stocks.map((stock: any) => stock.price),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
        ],
      }],
    };

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-white">Portfolio Allocation</h3>
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

  const BackButton = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className="mb-6 text-white flex items-center hover:text-blue-300 transition-colors duration-300 bg-gray-800 px-4 py-2 rounded-full shadow-md hover:shadow-lg"
    >
      <ArrowLeft className="mr-2" size={18} />
      {children}
    </button>
  );

  if (!portfolio) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10">
      <div className="container mx-auto px-4">
        <BackButton onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </BackButton>
        <div className="flex justify-between items-center mb-6">
          {editingName ? (
            <div className="flex items-center">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg mr-2"
              />
              <button
                onClick={editPortfolioName}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-white">{portfolio.name}</h1>
          )}
          <div className="flex space-x-4">
            <button
              onClick={() => setEditingName(!editingName)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Edit2 size={24} />
            </button>
            <button
              onClick={deletePortfolio}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Add Stock</h2>
          <StockForm onSubmit={addStock} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Stocks in Portfolio</h2>
          {portfolio.stocks && portfolio.stocks.length > 0 ? (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="p-3 text-white">Ticker</th>
                      <th className="p-3 text-white">Price</th>
                      <th className="p-3 text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.stocks.map((stock: any) => (
                      <tr key={stock.ticker} className="border-b border-gray-600">
                        <td className="p-3 text-white">
                          {editingStock === stock.ticker ? (
                            <input
                              type="text"
                              value={stock.ticker}
                              onChange={(e) => {
                                const updatedStocks = portfolio.stocks.map((s: any) =>
                                  s.ticker === stock.ticker ? { ...s, ticker: e.target.value } : s
                                );
                                setPortfolio({ ...portfolio, stocks: updatedStocks });
                              }}
                              className="bg-gray-700 text-white px-2 py-1 rounded"
                            />
                          ) : (
                            stock.ticker
                          )}
                        </td>
                        <td className="p-3 text-white">
                          {editingStock === stock.ticker ? (
                            <input
                              type="number"
                              value={stock.price}
                              onChange={(e) => {
                                const updatedStocks = portfolio.stocks.map((s: any) =>
                                  s.ticker === stock.ticker ? { ...s, price: parseFloat(e.target.value) } : s
                                );
                                setPortfolio({ ...portfolio, stocks: updatedStocks });
                              }}
                              className="bg-gray-700 text-white px-2 py-1 rounded"
                            />
                          ) : (
                            `$${stock.price.toFixed(2)}`
                          )}
                        </td>
                        <td className="p-3">
                          {editingStock === stock.ticker ? (
                            <button
                              onClick={() => updateStock(stock.ticker, stock.ticker, stock.price)}
                              className="text-green-500 hover:text-green-400 mr-2"
                            >
                              <Check size={20} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingStock(stock.ticker)}
                              className="text-blue-500 hover:text-blue-400 mr-2"
                            >
                              <Edit2 size={20} />
                            </button>
                          )}
                          <button
                            onClick={() => removeStock(stock.ticker)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xl font-semibold text-white">
                Total Portfolio Value: ${calculateTotalValue().toFixed(2)}
              </p>
              {renderPieChart()}
            </div>
          ) : (
            <p className="text-gray-400">No stocks in this portfolio yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;