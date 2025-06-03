import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="text-2xl font-bold">TradeX Platform</div>
        <div>
          <button 
            onClick={() => navigate('/auth')}
            className="py-2 px-6 rounded-full bg-white text-blue-800 font-medium hover:bg-blue-100 transition"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-8">Energy Trading Platform</h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
          Revolutionizing energy markets with optimization algorithms and real-time trading
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/auth')}
            className="py-3 px-8 rounded-full bg-yellow-500 text-blue-900 text-lg font-semibold hover:bg-yellow-400 transition"
          >
            Get Started
          </button>
          <button className="py-3 px-8 rounded-full border-2 border-white text-lg font-semibold hover:bg-white hover:text-blue-900 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-blue-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-700 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Market Optimization</h3>
              <p>Advanced algorithms to maximize market efficiency and social welfare</p>
            </div>
            <div className="bg-blue-700 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Real-time Trading</h3>
              <p>Live market data and instant order execution on our secure platform</p>
            </div>
            <div className="bg-blue-700 p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Visualization Tools</h3>
              <p>Comprehensive graphs and analytics to track market performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 py-10">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 TradeX Energy Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 