import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from "recharts";

const emissionData = [
  { state: "Maharashtra", emissions: 250, category: "High" },
  { state: "Gujarat", emissions: 75, category: "Low" },
  { state: "Tamil Nadu", emissions: 60, category: "Low" },
  { state: "Rajasthan", emissions: 90, category: "Moderate" },
  { state: "Chhattisgarh", emissions: 280, category: "High" },
  { state: "Karnataka", emissions: 50, category: "Low" },
  { state: "Uttar Pradesh", emissions: 300, category: "High" },
  { state: "West Bengal", emissions: 200, category: "Moderate" },
  { state: "Bihar", emissions: 200, category: "Moderate" },
  { state: "Panjab", emissions: 200, category: "Moderate" },
  { state: "Gujrat", emissions: 200, category: "Moderate" },
];

const BandedChart = () => {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
      <h2 className="text-2xl text-white font-bold mb-4">State-Wise Emission Analysis</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={emissionData}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="state" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(31, 41, 55, 0.8)",
              borderColor: "#4B5563",
            }}
            itemStyle={{ color: "#E5E7EB" }}
          />
          <Legend />
          {/* Bands */}
          <ReferenceArea y1={0} y2={100} label="Low Emissions" fill="#34D399" fillOpacity={0.2} />
          <ReferenceArea y1={100} y2={200} label="Moderate Emissions" fill="#FBBF24" fillOpacity={0.2} />
          <ReferenceArea y1={200} y2={300} label="High Emissions" fill="#F87171" fillOpacity={0.2} />
          {/* Bars */}
          <Bar dataKey="emissions" fill="#8B5CF6" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BandedChart;
