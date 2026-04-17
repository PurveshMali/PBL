import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Flame, TrendingUp, Wind, GaugeCircle } from "lucide-react";
import { analyticsRequest } from "../../config/api";

const getInsightStyle = (title) => {
  const normalized = title.toLowerCase();

  if (normalized.includes("pollut")) {
    return { Icon: Flame, color: "text-rose-300" };
  }

  if (normalized.includes("energy source") || normalized.includes("best performing")) {
    return { Icon: Wind, color: "text-emerald-300" };
  }

  if (normalized.includes("policy")) {
    return { Icon: GaugeCircle, color: "text-cyan-300" };
  }

  return { Icon: TrendingUp, color: "text-amber-300" };
};

const AIPoweredInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsRequest({ method: "get", path: "/get-insights" })
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
      className="w-full rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">AI assistant</p>
          <h2 className="text-xl font-semibold text-white mt-2">AI-Powered Insights</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
          <Activity className="h-4 w-4" />
          Live
        </div>
      </div>
      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-400">Loading insights...</p>
        ) : insights.length > 0 ? (
          insights.map((item, index) => {
            const { Icon, color } = getInsightStyle(item.title);

            return (
              <div key={index} className="flex items-start space-x-3 rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className={`rounded-full border border-white/10 bg-white/5 p-2 ${color} bg-opacity-20`}>
                  <Icon className={`size-6 ${color}`} />
                </div>
                <div className="text-slate-300 font-medium">
                  <strong className="text-white text-lg">{item.title}:</strong>
                  <p className="mt-1 text-slate-400 font-normal text-sm leading-6">{item.content || "No details available"}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-slate-400">No insights available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default AIPoweredInsights;
