import React from 'react';

const ProducerConsumerResults = ({ productions, prices, demands }) => {
  // Transform data for producers
  const producers = productions?.map((production, i) => ({
    id: i + 1,
    production,
    price: prices?.[i] || 0
  })) || [];

  // Transform data for consumers
  const consumers = demands?.map((demandRow, i) => ({
    id: i + 1,
    fromGen1: demandRow?.[0] || 0,
    fromGen2: demandRow?.[1] || 0,
    fromGen3: demandRow?.[2] || 0,
    total: demandRow?.reduce((sum, d) => sum + d, 0) || 0
  })) || [];

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