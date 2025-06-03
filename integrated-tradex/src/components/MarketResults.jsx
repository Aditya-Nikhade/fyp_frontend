import React from 'react';

const MarketResults = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-500 mb-2">Current Market Price</h3>
        <div className="text-4xl font-bold text-blue-600">₹423.94</div>
        <div className="text-sm text-gray-500">Final converged price per MWh</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-500 mb-2">Objective Function</h3>
        <div className="text-4xl font-bold text-green-600">1745.40</div>
        <div className="text-sm text-gray-500">Social welfare value</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-500 mb-2">Total Generation</h3>
        <div className="text-4xl font-bold text-blue-600">610.43 MW</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-500 mb-2">Total Demand</h3>
        <div className="text-4xl font-bold text-blue-600">610.38 MW</div>
      </div>
    </div>
  );
};

export default MarketResults; 