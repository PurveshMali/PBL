import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // To redirect the user if not authenticated
import Header from "../components/common/Header";
import {
  BarChart2,
  Fuel,
  SwatchBook,
  Zap,
} from "lucide-react";
import StatCard from "../components/common/StatCard";
import { motion } from "framer-motion";
import EmissionOverviewChart from "../components/overview/EmissionOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import StateEmission from "../components/overview/StateEmission";
import SideBar from "../components/common/Sidebar";
import axios from "axios"; // To make requests to backend

const OverviewPage = () => {
  const navigate = useNavigate();
  const [isValidUser, setIsValidUser] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to access this page, redirecting to login...");
        navigate("/login");
      } else {
        try {
          // Validate token with backend
          await axios.get("http://localhost:3000/api/auth/validate", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          alert("Invalid or expired token, redirecting to login...");
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview Dashboard" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Overall India Emission"
            icon={Zap}
            value="2,693 MW"
            color="#6366F1"
          />
          <StatCard
            name="Total Plants Analyze"
            icon={SwatchBook}
            value="1,234"
            color="#8B5CF6"
          />
          <StatCard 
            name="Fuel Types" 
            icon={Fuel} 
            value="4-5" 
            color="#EC4899" 
          />
          <StatCard
            name="Conversion Rate"
            icon={BarChart2}
            value="12.5%"
            color="#10B981"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EmissionOverviewChart />
          <CategoryDistributionChart />
          <StateEmission />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
