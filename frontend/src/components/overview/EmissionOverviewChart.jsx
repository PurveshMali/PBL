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
import { analyticsRequest } from "../../config/api";

const EmissionOverviewChart = () => {
  // State to hold the emission data
  const [emissionData, setEmissionData] = useState([]);

  // Fetch the data from the API
  useEffect(() => {
    const fetchEmissionData = async () => {
      try {
        const response = await analyticsRequest({ method: "get", path: "/api/call-emmision" });
        const data = response.data;
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
      className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Overview</p>
        <h2 className="mt-2 text-lg font-semibold text-white">Yearly Emission Overview of States (2024-25)</h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={emissionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey={"name"} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                borderColor: "rgba(255,255,255,0.08)",
                borderRadius: "16px",
              }}
              itemStyle={{ color: "#E2E8F0" }}
            />
            <Line
              type="monotone"
              dataKey="emission"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default EmissionOverviewChart;