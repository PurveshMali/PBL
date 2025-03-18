import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

// Map insights to icons and colors
const ICONS_MAP = {
  "Revenue Growth": TrendingUp,
  "Customer Retention": Users,
  "Market Trends": ShoppingBag,
  "Pricing Strategy": DollarSign,
};


const COLOR_MAP = {
  "Revenue Growth": "text-green-500",
  "Customer Retention": "text-blue-500",
  "Market Trends": "text-purple-500",
  "Pricing Strategy": "text-yellow-500",
};

const AIPoweredInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/get-insights")
      .then((response) => {
        // Clean up titles by trimming spaces
        const cleanedInsights = response.data.insights.map((insight) => ({
          title: insight.title.trim().replace(/\*\*/g, ""), // Remove "**" if present
          content: insight.content.trim(),
        }));
        setInsights(cleanedInsights);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching insights:", error);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      className="w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        AI-Powered Insights
      </h2>
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-400">Loading insights...</p>
        ) : insights.length > 0 ? (
          insights.map((item, index) => {
            // Select an icon or default to TrendingUp
            const Icon = ICONS_MAP[item.title] || TrendingUp;
            const color = COLOR_MAP[item.title] || "text-green-500";

            return (
              <div key={index} className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${color} bg-opacity-20`}>
                  <Icon className={`size-6 ${color}`} />
                </div>
                <div className="text-gray-300 font-medium">
                  <strong className="text-blue-500 text-xl">{item.title}:</strong> <br />
                  <p className="text-gray-400 font-normal text-base">{item.content || "No details available"}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400">No insights available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default AIPoweredInsights;
