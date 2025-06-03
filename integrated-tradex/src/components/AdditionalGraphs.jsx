import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Generate smoother generator production convergence data to match the image
const generateProductionData = () => {
  const data = [];
  
  // Final convergence values
  const finalGen1 = 203;
  const finalGen2 = 201;
  const finalGen3 = 206;
  
  // Starting values
  const startGen1 = 38;
  const startGen2 = 35;
  const startGen3 = 42;
  
  // Parameters for smooth curve
  const inflectionPoint = 17; // Point where curve has maximum slope
  const curveScale = 8; // Controls the steepness of the curve
  
  for (let i = 0; i <= 110; i++) {
    // Using sigmoid function for smooth S-curve
    const sigmoid = (val) => 1 / (1 + Math.exp(-(val - inflectionPoint) / curveScale));
    
    // Calculate percentage of progress along curve (0 to 1)
    const progressGen1 = sigmoid(i);
    const progressGen2 = sigmoid(i - 0.8); // Slightly offset for Gen2
    const progressGen3 = sigmoid(i + 0.8); // Slightly offset for Gen3
    
    // Calculate values using sigmoid function
    const gen1 = startGen1 + (finalGen1 - startGen1) * progressGen1;
    const gen2 = startGen2 + (finalGen2 - startGen2) * progressGen2;
    const gen3 = startGen3 + (finalGen3 - startGen3) * progressGen3;
    
    data.push({
      iteration: i,
      generator1: gen1,
      generator2: gen2,
      generator3: gen3
    });
  }
  return data;
};

// Generate price convergence data
const generatePriceData = () => {
  const data = [];
  for (let i = 0; i <= 120; i++) {
    let price;
    
    if (i === 0) {
      price = 350;
    } else if (i < 8) {
      price = 350 + (424 - 350) * (1 - Math.exp(-i / 2));
    } else {
      price = 424;
    }
    
    data.push({
      iteration: i,
      price: price
    });
  }
  return data;
};

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

const AdditionalGraphs = () => {
  const productionData = generateProductionData();
  const priceData = generatePriceData();
  
  const lineChartProps = {
    width: 800,
    height: 400,
    margin: { top: 10, right: 30, left: 20, bottom: 80 }
  };

  const commonAxisProps = {
    tick: { fontSize: 12 },
    tickSize: 8,
    tickMargin: 12
  };

  return (
    <div>
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Generator Production Convergence</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <LineChart 
            {...lineChartProps}
            data={productionData}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              {...commonAxisProps}
              dataKey="iteration" 
              label={<CustomXAxisLabel />}
              interval={11}
            />
            <YAxis 
              {...commonAxisProps}
              domain={[0, 220]}
              label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft', offset: 10 }}
            />
            <Tooltip formatter={(value) => [value.toFixed(2) + " MW", ""]} />
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
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Price Convergence (₹)</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <LineChart 
            {...lineChartProps}
            data={priceData}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              {...commonAxisProps}
              dataKey="iteration" 
              label={<CustomXAxisLabel />}
              interval={8}
            />
            <YAxis 
              {...commonAxisProps}
              domain={[350, 440]}
              label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft', offset: 10 }}
            />
            <Tooltip formatter={(value) => ["₹" + value.toFixed(2), ""]} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default AdditionalGraphs; 