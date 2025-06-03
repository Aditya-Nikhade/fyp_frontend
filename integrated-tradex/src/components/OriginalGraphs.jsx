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

const OriginalGraphs = ({ objectivePlot, sdPlot }) => {
  // Transform the data for the objective function plot
  const objectiveData = objectivePlot.map((value, index) => ({
    iteration: index,
    objective: value
  }));

  // Transform the data for the supply-demand plot
  const supplyDemandData = sdPlot.map(([supply, demand], index) => ({
    iteration: index,
    supply: supply,
    demand: demand
  }));

  const commonAxisProps = {
    tick: { fontSize: 12 },
    tickSize: 8,
    tickMargin: 12
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-semibold mb-4">Objective Function Convergence</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={objectiveData}
              margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                {...commonAxisProps}
                dataKey="iteration" 
                label={<CustomXAxisLabel />}
                interval={Math.floor(objectiveData.length / 10)}
              />
              <YAxis 
                {...commonAxisProps}
                domain={['auto', 'auto']}
                label={{ value: 'Objective', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip 
                formatter={(value) => [value.toFixed(2), 'Objective']}
                labelFormatter={(label) => `Iteration ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="objective" 
                stroke="#ff7300" 
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Supply-Demand Balance</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={supplyDemandData}
              margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                {...commonAxisProps}
                dataKey="iteration" 
                label={<CustomXAxisLabel />}
                interval={Math.floor(supplyDemandData.length / 10)}
              />
              <YAxis 
                {...commonAxisProps}
                domain={['auto', 'auto']}
                label={{ value: 'MWh', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip 
                formatter={(value) => [value.toFixed(2), 'MWh']}
                labelFormatter={(label) => `Iteration ${label}`}
              />
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
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="demand" 
                stroke="#8884d8" 
                name="Total Demand"
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

export default OriginalGraphs; 