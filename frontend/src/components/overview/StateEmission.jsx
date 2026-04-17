import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { analyticsRequest } from "../../config/api";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const StateEmission = () => {
  const [emissionData, setEmissionData] = useState([]);

  // Fetch the data from the API
  useEffect(() => {
    const fetchEmissionData = async () => {
      try {
        const response = await analyticsRequest({ method: "get", path: "/api/call-emmisionofstates" });
        const data = response.data;
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
      className='lg:col-span-2 rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className='mb-5'>
        <p className='text-[11px] uppercase tracking-[0.35em] text-slate-400'>State analysis</p>
        <h2 className='mt-2 text-lg font-semibold text-white'>Emission by States</h2>
      </div>

      <div className='h-80'>
        <ResponsiveContainer>
          <BarChart data={emissionData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis dataKey='name' stroke='#9CA3AF' />
            <YAxis stroke='#9CA3AF' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                borderColor: "rgba(255,255,255,0.08)",
                borderRadius: "16px",
              }}
              itemStyle={{ color: "#E2E8F0" }}
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