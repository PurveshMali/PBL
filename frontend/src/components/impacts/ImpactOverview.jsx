import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
} from "recharts";
import { useState } from "react";

const healthImpactData = [
  { month: "Jan", respiratoryDiseases: 420, deathRate: 20, fuel: "Coal" },
  { month: "Jan", respiratoryDiseases: 310, deathRate: 8, fuel: "Oil" },
  { month: "Jan", respiratoryDiseases: 180, deathRate: 5, fuel: "Gas" },
  { month: "Jan", respiratoryDiseases: 50, deathRate: 1, fuel: "Renewable" },

  { month: "Feb", respiratoryDiseases: 400, deathRate: 13, fuel: "Coal" },
  { month: "Feb", respiratoryDiseases: 300, deathRate: 9, fuel: "Oil" },
  { month: "Feb", respiratoryDiseases: 170, deathRate: 4, fuel: "Gas" },
  { month: "Feb", respiratoryDiseases: 45, deathRate: 1, fuel: "Renewable" },

  { month: "Mar", respiratoryDiseases: 450, deathRate: 50, fuel: "Coal" },
  { month: "Mar", respiratoryDiseases: 320, deathRate: 10, fuel: "Oil" },
  { month: "Mar", respiratoryDiseases: 200, deathRate: 6, fuel: "Gas" },
  { month: "Mar", respiratoryDiseases: 60, deathRate: 2, fuel: "Renewable" },

  { month: "Apr", respiratoryDiseases: 430, deathRate: 90, fuel: "Coal" },
  { month: "Apr", respiratoryDiseases: 310, deathRate: 9, fuel: "Oil" },
  { month: "Apr", respiratoryDiseases: 190, deathRate: 5, fuel: "Gas" },
  { month: "Apr", respiratoryDiseases: 55, deathRate: 1, fuel: "Renewable" },

  { month: "May", respiratoryDiseases: 480, deathRate: 25, fuel: "Coal" },
  { month: "May", respiratoryDiseases: 330, deathRate: 11, fuel: "Oil" },
  { month: "May", respiratoryDiseases: 210, deathRate: 7, fuel: "Gas" },
  { month: "May", respiratoryDiseases: 65, deathRate: 2, fuel: "Renewable" },

  { month: "Jun", respiratoryDiseases: 460, deathRate: 100, fuel: "Coal" },
  { month: "Jun", respiratoryDiseases: 320, deathRate: 10, fuel: "Oil" },
  { month: "Jun", respiratoryDiseases: 200, deathRate: 6, fuel: "Gas" },
  { month: "Jun", respiratoryDiseases: 60, deathRate: 2, fuel: "Renewable" },

  { month: "Jul", respiratoryDiseases: 490, deathRate: 150, fuel: "Coal" },
  { month: "Jul", respiratoryDiseases: 340, deathRate: 12, fuel: "Oil" },
  { month: "Jul", respiratoryDiseases: 220, deathRate: 8, fuel: "Gas" },
  { month: "Jul", respiratoryDiseases: 70, deathRate: 2, fuel: "Renewable" },
];

const ImpactOverview = () => {
  const [selectedFuel, setSelectedFuel] = useState("Coal");

  // Filter data based on the selected fuel
  const filteredData = healthImpactData
    .filter((entry) => entry.fuel === selectedFuel)
    .map(({ month, respiratoryDiseases, deathRate }) => ({
      month,
      respiratoryDiseases,
      deathRate,
    }));

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Health Impact Overview
        </h2>

        <select
          className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedFuel}
          onChange={(e) => setSelectedFuel(e.target.value)}
        >
          <option value="Coal">Coal</option>
          <option value="Oil">Oil</option>
          <option value="Gas">Gas</option>
          <option value="Renewable">Renewable</option>
        </select>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <AreaChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend
              verticalAlign="bottom"
              height={24}
              wrapperStyle={{ color: "#E5E7EB" }}
            />
            <Area
              type="monotone"
              dataKey="respiratoryDiseases"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
              name="Respiratory Diseases"
            />
            <Area
              type="monotone"
              dataKey="deathRate"
              stroke="#da1e1e"
              fill="#da1e1e"
              fillOpacity={0.3}
              name="Death Rate"
            />
            
          </AreaChart>
          
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ImpactOverview;
