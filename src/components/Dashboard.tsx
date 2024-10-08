import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import PortfolioList from './PortfolioList';
import PortfolioForm from './PortfolioForm';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const navigate = useNavigate();
  const [editingPortfolio, setEditingPortfolio] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPortfolios();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const fetchPortfolios = async () => {
    if (user) {
      const q = query(collection(db, 'portfolios'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedPortfolios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPortfolios(fetchedPortfolios);
    }
  };

  const addPortfolio = async (name: string) => {
    if (user) {
      try {
        await addDoc(collection(db, 'portfolios'), {
          name,
          userId: user.uid,
          stocks: [],
          createdAt: new Date()
        });
        fetchPortfolios();
      } catch (error) {
        console.error('Error adding portfolio:', error);
      }
    }
  };

  const deletePortfolio = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'portfolios', id));
        fetchPortfolios();
      } catch (error) {
        console.error('Error deleting portfolio:', error);
      }
    }
  };

  const editPortfolio = async (id: string, newName: string) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'portfolios', id), { name: newName });
        fetchPortfolios();
        setEditingPortfolio(null);
      } catch (error) {
        console.error('Error updating portfolio:', error);
      }
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10">
      <div className="container mx-auto px-4">
        <BackButton onClick={() => navigate('/portfolio-hub')}>
          Back to Hub
        </BackButton>
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 animate-fade-in-down">
            Your Portfolios
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Manage and track your investment portfolios
          </p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-lg">
          <PortfolioForm onSubmit={addPortfolio} />
          <PortfolioList 
            portfolios={portfolios} 
            onDelete={deletePortfolio} 
            onEdit={editPortfolio}
            editingPortfolio={editingPortfolio}
            setEditingPortfolio={setEditingPortfolio}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;