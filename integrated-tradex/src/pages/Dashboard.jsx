import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import MarketResults from '../components/MarketResults';
import ProducerConsumerResults from '../components/ProducerConsumerResults';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleGraphsClick = () => {
    if (!results) {
      setShowWarning(true);
    } else {
      navigate('/graphs', { state: { results } });
    }
  };

  const runOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ iterations_to_run: 1000 }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to run optimization');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-800">Energy Trading Platform</h1>
          
          <div className="flex space-x-4">
            <button 
              onClick={runOptimization}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Running...' : 'Run Iterations'}
            </button>

            <button 
              onClick={handleGraphsClick}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Graphs
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

      {/* Warning Popup */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-xl font-bold mb-4">Warning</h3>
            <p className="mb-6">Please run iterations first to view the graphs.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {results && (
          <div className="space-y-8">
            <MarketResults 
              objective={results.objective}
              prices={results.l}
              productions={results.p}
              demands={results.q}
              objectivePlot={results.objective_plot}
              lPlot={results.l_plot}
              pPlot={results.p_plot}
              sdPlot={results.sd_plot}
            />
            
            <ProducerConsumerResults
              productions={results.p}
              prices={results.l}
              demands={results.q}
            />

            <div className="text-sm text-gray-600 bg-white p-4 rounded-lg shadow-md">
              <p>Iterations performed: {results.iterations_performed}</p>
              <p>Max iterations requested: {results.max_iterations_requested}</p>
            </div>
          </div>
        )}

        {!results && !loading && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-6">Welcome to the Energy Trading Platform</h2>
            <p className="text-lg mb-8 text-gray-600">Click "Run Iterations" to view market optimization results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 