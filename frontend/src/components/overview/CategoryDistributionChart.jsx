import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/totalpiechart")
      .then((response) => response.json())
      .then((apiData) => {
        setData(apiData); // Use API data directly
      })
      .catch((error) => console.error("Error fetching pie data:", error));
  }, []);

  return (
    <motion.div
      className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Sector mix</p>
        <h2 className="mt-2 text-lg font-semibold text-white">CO2 Emission by Sectors (2022)</h2>
      </div>
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={data}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="Co2_Emissions_MetricTons"
              nameKey="Industry_Type"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                borderColor: "rgba(255,255,255,0.08)",
                borderRadius: "16px",
              }}
              itemStyle={{ color: "#E2E8F0" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;