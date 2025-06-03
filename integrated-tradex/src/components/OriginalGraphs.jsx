import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Generate data matching the MATLAB plots exactly
const generateData = () => {
  const data = [];
  for (let i = 0; i <= 120; i++) {
    let objectiveValue;
    let supplyValue;
    let demandValue;
    
    // Objective Function graph remains unchanged
    if (i === 0) {
      objectiveValue = 3600;
    } else if (i < 5) {
      objectiveValue = 3600 - ((3600 - 1750) * i / 5);
    } else {
      objectiveValue = 1750;
    }
    
    // Smooth Supply-Demand graph to merge around iteration 8
    if (i === 0) {
      supplyValue = 450;
      demandValue = 850;
    } else if (i < 8) {
      supplyValue = 450 + (160 * (1 - Math.exp(-i / 2)));
      demandValue = 850 - (240 * (1 - Math.exp(-i / 2)));
    } else {
      supplyValue = 610;
      demandValue = 610;
    }
    
    data.push({
      iteration: i,
      objective: objectiveValue,
      supply: supplyValue,
      demand: demandValue
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

const OriginalGraphs = () => {
  const data = generateData();
  
  const commonProps = {
    width: 800,
    height: 400,
    data: data,
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
        <h2 className="text-xl font-semibold mb-4">Objective Function Convergence</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              {...commonAxisProps}
              dataKey="iteration" 
              label={<CustomXAxisLabel />}
              interval={10}
            />
            <YAxis 
              {...commonAxisProps}
              domain={[1600, 3700]}
              label={{ value: 'Objective', angle: -90, position: 'insideLeft', offset: 10 }}
              interval={0}
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="objective" 
              stroke="#ff7300" 
              dot={false}
              strokeWidth={1}
            />
          </LineChart>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Supply-Demand Balance</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              {...commonAxisProps}
              dataKey="iteration" 
              label={<CustomXAxisLabel />}
              interval={10}
            />
            <YAxis 
              {...commonAxisProps}
              domain={[450, 900]}
              label={{ value: 'MWh', angle: -90, position: 'insideLeft', offset: 10 }}
              interval={0}
            />
            <Tooltip />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              wrapperStyle={{ paddingTop: "10px", bottom: 20 }}
            />
            <Line 
              type="monotone" 
              dataKey="supply" 
              stroke="#82ca9d" 
              name="Total Generation"
              dot={false}
              strokeWidth={1}
            />
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="#8884d8" 
              name="Total Demand"
              dot={false}
              strokeWidth={1}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default OriginalGraphs; 