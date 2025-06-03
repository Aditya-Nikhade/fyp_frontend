import React from 'react';

const MarketResults = ({ objective, prices, productions, demands }) => {
  // Calculate totals
  const totalGeneration = productions?.reduce((sum, p) => sum + p, 0) || 0;
  const totalDemand = demands?.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0) || 0;
  const avgPrice = prices?.reduce((sum, p) => sum + p, 0) / (prices?.length || 1) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-500 mb-2">Current Market Price</h3>
        <div className="text-4xl font-bold text-blue-600">₹{avgPrice.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Final converged price per MWh</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-500 mb-2">Objective Function</h3>
        <div className="text-4xl font-bold text-green-600">{objective?.toFixed(2) || '0.00'}</div>
        <div className="text-sm text-gray-500">Social welfare value</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-500 mb-2">Total Generation</h3>
        <div className="text-4xl font-bold text-blue-600">{totalGeneration.toFixed(2)} MW</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-500 mb-2">Total Demand</h3>
        <div className="text-4xl font-bold text-blue-600">{totalDemand.toFixed(2)} MW</div>
      </div>
    </div>
  );
};

export default MarketResults; 