import React from "react";
import Header from "../components/common/Header";
import { Axis3d, BarChart2, Fuel, ShoppingBag, SwatchBook, Users, Zap } from "lucide-react";
import StatCard from "../components/common/StatCard";
import { motion } from "framer-motion";
import EmissionOverviewChart from "../components/overview/EmissionOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";

const OverviewPage = () => {
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

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<EmissionOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
				</div>
      </main>
    </div>
  );
};

export default OverviewPage;
