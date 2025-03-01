import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const EmissionOverviewChart = () => {
  // State to hold the emission data
  const [emissionData, setEmissionData] = useState([]);

  // Fetch the data from the API
  useEffect(() => {
    const fetchEmissionData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/call-emmision"); // Your Flask API endpoint
        const data = await response.json();
        console.log(response);
        // Transform the data to match the required format
        const formattedData = data.map((item) => ({
          name: item.State, // Assuming "State" is the column for names
          emission: item["Average SO2 (mg/Nm3) - 2024-25"], // Assuming this is the SO2 value column
        }));

        // Update the state with the formatted data
        setEmissionData(formattedData);
      } catch (error) {
        console.error("Error fetching emission data:", error);
      }
    };

    fetchEmissionData();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Yearly Emission Overview of States (2024-25)</h2>

      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={emissionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey={"name"} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="emission"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default EmissionOverviewChart;