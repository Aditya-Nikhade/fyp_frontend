import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import OriginalGraphs from '../components/OriginalGraphs';
import AdditionalGraphs from '../components/AdditionalGraphs';

const GraphsPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('original');

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-800">Energy Trading Platform</h1>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Home
            </button>
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Market Performance Graphs</h2>
        
        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'original' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('original')}
            >
              Primary Graphs
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'additional' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('additional')}
            >
              Additional Graphs
            </button>
          </div>
        </div>
        
        {/* Graph Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeTab === 'original' ? (
            <OriginalGraphs />
          ) : (
            <AdditionalGraphs />
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphsPage; 