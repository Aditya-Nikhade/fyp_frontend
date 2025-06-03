import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import OriginalGraphs from '../components/OriginalGraphs';
import AdditionalGraphs from '../components/AdditionalGraphs';

const GraphsPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // If no results data is available, redirect back to dashboard
  if (!results) {
    navigate('/dashboard');
    return null;
  }

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
              Return Home
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
        
        {/* Graphs Grid */}
        <div className="space-y-8">
          {/* Original Graphs */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Primary Market Analysis</h3>
            <OriginalGraphs 
              objectivePlot={results.objective_plot}
              lPlot={results.l_plot}
              pPlot={results.p_plot}
              sdPlot={results.sd_plot}
            />
        </div>
        
          {/* Additional Graphs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Additional Market Insights</h3>
            <AdditionalGraphs 
              objective={results.objective}
              prices={results.prices}
              productions={results.productions}
              demands={results.demands}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphsPage; 