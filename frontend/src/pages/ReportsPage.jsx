import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileSpreadsheet,
  FileJson,
  Filter,
  Loader,
  Search,
  Sparkles,
} from "lucide-react";

import Header from "../components/common/Header";
import { analyticsRequest } from "../config/api";

const buildCsv = (rows) => {
  if (!rows?.length) return "";

  const headers = Object.keys(rows[0]);
  const escapeValue = (value) => {
    const raw = value == null ? "" : String(value);
    if (raw.includes(",") || raw.includes('"') || raw.includes("\n")) {
      return `"${raw.replace(/"/g, '""')}"`;
    }
    return raw;
  };

  const csvRows = [headers.join(",")];
  for (const row of rows) {
    csvRows.push(headers.map((h) => escapeValue(row[h])).join(","));
  }
  return csvRows.join("\n");
};

const saveBlob = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [reports, setReports] = useState([]);
  const [downloading, setDownloading] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const [totalRes, plantsRes, statesRes, sectorsRes] = await Promise.all([
          analyticsRequest({ method: "get", path: "/api/totalemmision" }),
          analyticsRequest({ method: "get", path: "/api/totalplants" }),
          analyticsRequest({ method: "get", path: "/api/call-emmisionofstates" }),
          analyticsRequest({ method: "get", path: "/api/totalpiechart" }),
        ]);

        const totalEmission = Number(totalRes.data) || 0;
        const totalPlants = Number(plantsRes.data) || 0;
        const stateRows = Array.isArray(statesRes.data) ? statesRes.data : [];
        const sectorRows = Array.isArray(sectorsRes.data) ? sectorsRes.data : [];

        const topStates = [...stateRows]
          .sort(
            (a, b) =>
              Number(b["Average SO2 (mg/Nm3) - 2024-25"] || 0) -
              Number(a["Average SO2 (mg/Nm3) - 2024-25"] || 0)
          )
          .slice(0, 10);

        const generatedAt = new Date().toISOString();

        setReports([
          {
            id: "summary",
            title: "National SO2 Summary",
            type: "summary",
            description:
              "Total SO2 emission and plant count snapshot generated from the analytics backend.",
            generatedAt,
            rows: [
              {
                metric: "Total SO2 (2024-25)",
                value: totalEmission,
                unit: "mg/Nm3",
              },
              {
                metric: "Plants Tracked",
                value: totalPlants,
                unit: "count",
              },
            ],
          },
          {
            id: "state",
            title: "Top Emitting States",
            type: "state",
            description:
              "Top states ranked by 2024-25 SO2 average from the plant registry.",
            generatedAt,
            rows: topStates.map((row, idx) => ({
              rank: idx + 1,
              state: row.State,
              so2_2024_25: row["Average SO2 (mg/Nm3) - 2024-25"],
            })),
          },
          {
            id: "sector",
            title: "Sector Emission Mix",
            type: "sector",
            description:
              "CO2 sector distribution report used by the pie chart analytics panel.",
            generatedAt,
            rows: sectorRows.map((row) => ({
              sector: row.Industry_Type,
              co2_metric_tons: row.Co2_Emissions_MetricTons,
            })),
          },
        ]);
      } catch (error) {
        console.error("Failed to load report data:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesFilter = filter === "all" || report.type === filter;
      const text = `${report.title} ${report.description}`.toLowerCase();
      const matchesSearch = text.includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [reports, filter, searchTerm]);

  const reportTypes = ["all", "summary", "state", "sector"];

  const handleDownload = async (report, format) => {
    const key = `${report.id}-${format}`;
    setDownloading(key);
    try {
      if (format === "csv") {
        const csv = buildCsv(report.rows);
        saveBlob(csv, `${report.id}-report.csv`, "text/csv;charset=utf-8;");
      } else {
        const json = JSON.stringify(
          {
            title: report.title,
            description: report.description,
            generatedAt: report.generatedAt,
            rows: report.rows,
          },
          null,
          2
        );
        saveBlob(json, `${report.id}-report.json`, "application/json;charset=utf-8;");
      }
    } finally {
      setDownloading("");
    }
  };

  return (
    <motion.div className="flex-1 overflow-auto relative z-10">
      <Header title="Reports Center" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.section
          className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 mb-6 shadow-[0_30px_80px_rgba(2,6,23,0.4)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Publishing desk</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Operational Reports</h2>
              <p className="mt-3 text-sm text-slate-300 max-w-2xl">
                Download executive-ready snapshots generated from live analytics endpoints. Export as CSV for analysts or JSON for integrations.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Live
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1.7fr_1fr]">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search report title or description"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-slate-100 outline-none transition focus:border-emerald-400/40"
              />
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-transparent py-3 text-slate-100 outline-none"
              >
                {reportTypes.map((type) => (
                  <option key={type} value={type} className="bg-slate-900">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.section>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-emerald-300" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <motion.article
                key={report.id}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white leading-tight">{report.title}</h3>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                    {report.type}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-400 min-h-[54px]">{report.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Generated: {new Date(report.generatedAt).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-500">Rows: {report.rows.length}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDownload(report, "csv")}
                    disabled={downloading === `${report.id}-csv`}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-60"
                  >
                    {downloading === `${report.id}-csv` ? <Loader className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                    CSV
                  </button>

                  <button
                    onClick={() => handleDownload(report, "json")}
                    disabled={downloading === `${report.id}-json`}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-60"
                  >
                    {downloading === `${report.id}-json` ? <Loader className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
                    JSON
                  </button>

                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                    <Download className="h-4 w-4" />
                    Ready
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!loading && filteredReports.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/55 p-6 text-center text-slate-400">
            No report matched your filters. Try changing the search keyword or report type.
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default ReportsPage;
