import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Custom X-axis label component
const CustomXAxisLabel = props => {
  const { x, y, width } = props.viewBox;
  return (
    <g>
      <text x={x + width / 2} y={y + 70} textAnchor="middle" fill="#666">
        Iterations
      </text>
    </g>
  );
};

const AdditionalGraphs = ({ pPlot, lPlot }) => {
  // Transform the data for the generator production plot
  const productionData = pPlot.map(([gen1, gen2, gen3], index) => ({
    iteration: index,
    generator1: gen1,
    generator2: gen2,
    generator3: gen3
  }));

  // Transform the data for the price plot
  const priceData = lPlot.map(([price1, price2, price3], index) => ({
    iteration: index,
    price1: price1,
    price2: price2,
    price3: price3
  }));

  const commonAxisProps = {
    tick: { fontSize: 12 },
    tickSize: 8,
    tickMargin: 12
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-semibold mb-4">Generator Production Convergence</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={productionData}
              margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                {...commonAxisProps}
                dataKey="iteration" 
                label={<CustomXAxisLabel />}
                interval={Math.floor(productionData.length / 10)}
              />
              <YAxis 
                {...commonAxisProps}
                domain={['auto', 'auto']}
                label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip 
                formatter={(value) => [value.toFixed(2) + " MW", ""]}
                labelFormatter={(label) => `Iteration ${label}`}
              />
              <Legend 
                verticalAlign="bottom" 
                wrapperStyle={{ paddingTop: "20px" }}
              />
              <Line 
                type="monotone" 
                dataKey="generator1" 
                stroke="#82ca9d" 
                name="Generator 1"
                dot={false}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="generator2" 
                stroke="#8884d8" 
                name="Generator 2"
                dot={false}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="generator3" 
                stroke="#ffc658" 
                name="Generator 3"
                dot={false}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Price Convergence (₹)</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={priceData}
              margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                {...commonAxisProps}
                dataKey="iteration" 
                label={<CustomXAxisLabel />}
                interval={Math.floor(priceData.length / 10)}
              />
              <YAxis 
                {...commonAxisProps}
                domain={['auto', 'auto']}
                label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip 
                formatter={(value) => ["₹" + value.toFixed(2), ""]}
                labelFormatter={(label) => `Iteration ${label}`}
              />
              <Legend 
                verticalAlign="bottom" 
                wrapperStyle={{ paddingTop: "20px" }}
              />
              <Line 
                type="monotone" 
                dataKey="price1" 
                stroke="#82ca9d" 
                name="Price 1"
                dot={false}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="price2" 
                stroke="#8884d8" 
                name="Price 2"
                dot={false}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="price3" 
                stroke="#ffc658" 
                name="Price 3"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdditionalGraphs; 