import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import {
  AlertTriangle,
  BarChart2,
  DollarSign,
  Fuel,
  Package,
  SwatchBook,
  TrendingUp,
  Zap,
} from "lucide-react";
import ProductsTable from "../components/insights/StateTable";
import TrendChart from "../components/insights/TrendChart";
import BandedChart from "../components/insights/BandedChart";

const PowerPlantInsights = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Insights Dashboard" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
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
          <StatCard name="Fuel Types" icon={Fuel} value="4-5" color="#EC4899" />
          <StatCard
            name="Conversion Rate"
            icon={BarChart2}
            value="12.5%"
            color="#10B981"
          />
        </motion.div>

        <ProductsTable />

        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          <TrendChart />
          <BandedChart />
        </div>
      </main>
    </div>
  );
};
export default PowerPlantInsights;
