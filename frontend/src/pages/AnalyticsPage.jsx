import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Factory, Gauge, MapPinned } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import EmissionOverviewChart from "../components/overview/EmissionOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import StateEmission from "../components/overview/StateEmission";
import AIPoweredInsights from "../components/predictions/AIPoweredInsights";
import { analyticsRequest } from "../config/api";

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [totalEmission, setTotalEmission] = useState(0);
  const [totalPlants, setTotalPlants] = useState(0);
  const [topState, setTopState] = useState("-");
  const [sectorCount, setSectorCount] = useState(0);

  useEffect(() => {
    const loadDashboardFacts = async () => {
      setLoading(true);
      try {
        const [emissionRes, plantsRes, statesRes, sectorsRes] = await Promise.all([
          analyticsRequest({ method: "get", path: "/api/totalemmision" }),
          analyticsRequest({ method: "get", path: "/api/totalplants" }),
          analyticsRequest({ method: "get", path: "/api/call-emmision" }),
          analyticsRequest({ method: "get", path: "/api/totalpiechart" }),
        ]);

        const stateRows = Array.isArray(statesRes.data) ? statesRes.data : [];
        const top = stateRows[0]?.State || "-";

        const sectors = Array.isArray(sectorsRes.data) ? sectorsRes.data.length : 0;

        setTotalEmission(Number(emissionRes.data) || 0);
        setTotalPlants(Number(plantsRes.data) || 0);
        setTopState(top);
        setSectorCount(sectors);
      } catch (error) {
        console.error("Failed to load analytics facts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardFacts();
  }, []);

  const cards = useMemo(
    () => [
      {
        name: "Total SO2 (2024-25)",
        value: loading ? "Loading..." : `${Math.round(totalEmission)} mg/Nm3`,
        icon: Gauge,
        color: "#14b8a6",
      },
      {
        name: "Plants Tracked",
        value: loading ? "Loading..." : totalPlants,
        icon: Factory,
        color: "#3b82f6",
      },
      {
        name: "Highest Emitting State",
        value: loading ? "Loading..." : topState,
        icon: MapPinned,
        color: "#f59e0b",
      },
      {
        name: "Sector Buckets",
        value: loading ? "Loading..." : sectorCount,
        icon: Activity,
        color: "#a855f7",
      },
    ],
    [loading, totalEmission, totalPlants, topState, sectorCount]
  );

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Analytics Center" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.section
          className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 mb-6 shadow-[0_30px_80px_rgba(2,6,23,0.4)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Command view</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Operational Analytics</h2>
          <p className="mt-3 text-sm text-slate-300">
            This view consolidates live totals, state-level SO2 patterns, and sector distributions from the analytics API.
          </p>
        </motion.section>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {cards.map((card) => (
            <StatCard key={card.name} name={card.name} value={card.value} icon={card.icon} color={card.color} />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EmissionOverviewChart />
          <CategoryDistributionChart />
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <StateEmission />
          <AIPoweredInsights />
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
