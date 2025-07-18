import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Dummy data for line chart
const lineData = [
  { name: 'May', value: 5 },
  { name: 'Jun', value: 20 },
  { name: 'Jul', value: 28 },
  { name: 'Aug', value: 32 },
  { name: 'Sep', value: 45 },
  { name: 'Oct', value: 45 },
  { name: 'Nov', value: 55 },
];

// Dummy data for donut chart
const pieData = [
  { name: 'Lab 1', value: 15 },
  { name: 'Lab 2', value: 33 },
  { name: 'Lab 3', value: 20 },
  { name: 'Lab 4', value: 32 },
];

const COLORS = ['#22c55e', '#ef4444', '#0ea5e9', '#f59e0b'];

const Charts = () => {
  return (
    <div className="dashboard-graphs">
      {/* Line Chart */}
      <div className="graph-card">
        <h4>Consommation des cartouches</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Donut Chart */}
      <div className="graph-card">
        <h4>Répartition par Lab</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
