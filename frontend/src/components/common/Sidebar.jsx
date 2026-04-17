import {
  Axis3d,
  BarChart2,
  BookText,
  Menu,
  Settings,
  Target,
  TrendingUp,
  Waypoints,
} from "lucide-react";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/overview" },
  { name: "Insights", icon: Waypoints, color: "#8b5cf6", href: "/insights" },
  { name: "Impact", icon: Axis3d, color: "#ec4899", href: "/impacts" },
  { name: "Predictions", icon: Target, color: "#10b981", href: "/predictions" },
  { name: "Reports", icon: BookText, color: "#f59e0b", href: "/reports" },
  { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
  { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <motion.div
      className={
        'relative z-10 flex-shrink-0 transition-all duration-300 ease-in-out'
      }
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className='flex h-full flex-col border-r border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl'>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="max-w-fit rounded-full border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item, index) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="mb-2 flex items-center rounded-2xl border border-transparent p-4 text-sm font-medium transition-colors hover:border-white/10 hover:bg-white/5">
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap text-slate-200"
                      initial={{ opacity: 0, x: 0 }}
                      animate={{ opacity: 1, x: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default SideBar;
