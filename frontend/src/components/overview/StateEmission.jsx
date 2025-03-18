import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const StateEmission = () => {
  const [emissionData, setEmissionData] = useState([]);

  // Fetch the data from the API
  useEffect(() => {
    const fetchEmissionData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/call-emmisionofstates"); // Your Flask API endpoint
        const data = await response.json();
        console.log("API Response:", data); // Debugging

        // Transform the data to match the required format
        const formattedData = data.map((item) => ({
          name: item.State, // Assuming "State" is the column for names
          emission: item["Average SO2 (mg/Nm3) - 2024-25"], // SO2 emission value
        }));

        // Update the state with the formatted data
        setEmissionData(formattedData);
      } catch (error) {
        console.error("Error fetching emission data:", error);
      }
    };

    fetchEmissionData();
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className='text-lg font-medium mb-4 text-gray-100'>Emission By States</h2>

      <div className='h-80'>
        <ResponsiveContainer>
          <BarChart data={emissionData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis dataKey='name' stroke='#9CA3AF' />
            <YAxis stroke='#9CA3AF' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey="emission" fill='#8884d8'>
              {emissionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default StateEmission;