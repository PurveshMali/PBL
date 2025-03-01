import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { BarChart2, Fuel, SwatchBook, Zap } from "lucide-react";
import StatCard from "../components/common/StatCard";
import { motion } from "framer-motion";
import EmissionOverviewChart from "../components/overview/EmissionOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/StateEmission";
import axios from "axios";

const OverviewPage = () => {
  const navigate = useNavigate();
  const [isValidUser, setIsValidUser] = useState(false);
  const [totalValue, setTotalValue] = useState(0); // ✅ Default 0 instead of null
  const [totalPlants, setTotalPlants] = useState(0);

  // ✅ Check authentication when the page loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        await axios.get("http://localhost:3000/api/auth/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsValidUser(true);
      } catch (error) {
        alert("Invalid session! Redirecting to login...");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // ✅ Optimized Fetch Data
  useEffect(() => {
    const fetchEmissionData = async () => {
      try {
        const [emissionRes, plantsRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/totalemmision"),
          axios.get("http://127.0.0.1:5000/api/totalplants"),
        ]);

        setTotalValue(emissionRes.data);
        setTotalPlants(plantsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEmissionData();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

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
            value={`${totalValue || "Loading..."} mg/Nm3`} // ✅ Cleaner format
            color="#6366F1"
          />
          <StatCard
            name="Total Plants Analyze"
            icon={SwatchBook}
            value={totalPlants || "Loading..."}
            color="#8B5CF6"
          />
          <StatCard name="Fuel Types" icon={Fuel} value="4-5" color="#EC4899" />
          <StatCard name="Conversion Rate" icon={BarChart2} value="12.5%" color="#10B981" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EmissionOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;