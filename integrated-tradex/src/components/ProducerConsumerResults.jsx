import React from 'react';

const ProducerConsumerResults = () => {
  // Producer data
  const producers = [
    { id: 1, production: 203.4782, price: 423.9389 },
    { id: 2, production: 203.4763, price: 423.9312 },
    { id: 3, production: 203.4744, price: 423.9312 }
  ];

  // Consumer data with allocation from each generator
  const consumers = [
    { id: 1, fromGen1: 38.1160, fromGen2: 38.1164, fromGen3: 38.1168, total: 114.3492 },
    { id: 2, fromGen1: 34.3783, fromGen2: 34.3743, fromGen3: 34.3704, total: 103.1230 },
    { id: 3, fromGen1: 36.2780, fromGen2: 36.2785, fromGen3: 36.2789, total: 108.8354 },
    { id: 4, fromGen1: 36.2780, fromGen2: 36.2785, fromGen3: 36.2789, total: 108.8354 },
    { id: 5, fromGen1: 29.2050, fromGen2: 29.2054, fromGen3: 29.2058, total: 87.6162 },
    { id: 6, fromGen1: 29.2050, fromGen2: 29.2054, fromGen3: 29.2058, total: 87.6162 }
  ];

  return (
    <div className="space-y-8">
      {/* Producers Table */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-auto">
        <h3 className="text-xl font-semibold mb-4">Producers</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Production (MW)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price (₹/MWh)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {producers.map((producer) => (
              <tr key={producer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Generator {producer.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{producer.production.toFixed(4)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{producer.price.toFixed(4)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Consumers Table */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-auto">
        <h3 className="text-xl font-semibold mb-4">Consumers</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consumer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From Gen 1
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From Gen 2
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From Gen 3
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total (MW)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {consumers.map((consumer) => (
              <tr key={consumer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Consumer {consumer.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{consumer.fromGen1.toFixed(4)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{consumer.fromGen2.toFixed(4)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{consumer.fromGen3.toFixed(4)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{consumer.total.toFixed(4)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProducerConsumerResults; 