import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { bypassAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    bypassAuth();
    navigate('/dashboard');
  };

  const handleBypassAuth = () => {
    bypassAuth();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 flex flex-col justify-center">
        <h1 className="text-5xl font-semibold mb-6">Welcome to TradeX</h1>
        <p className="text-xl mb-8">
          Experience fast, secure, and real-time trading with advanced optimization technology.
        </p>
        <button 
          className="px-6 py-3 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 rounded-lg"
          onClick={handleBypassAuth}
        >
          Login to the platform
        </button>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex justify-center items-center bg-white p-12">
        <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
            {isLogin ? 'Login to Your Account' : 'Create Your Account'}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-6"
            >
              Enter
            </button>
          </form>

          <div className="text-center">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 