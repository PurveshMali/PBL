import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader, Zap } from "lucide-react";
import axios from "axios";

import Header from "../components/common/Header";
import PredictionsResult from "../components/predictions/PredictionsResult";
import AIPoweredInsights from "../components/predictions/AIPoweredInsights";

const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Gujarat",
  "Haryana",
  "Jharkhand",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

const CATEGORIES = ["A", "B", "C"];

const PredictionsPage = () => {
  const [formData, setFormData] = useState({
    state: "",
    category: "",
    total_capacity: "",
    commissioning_date: "",
    so2_norms: "",
    prior_avg_so2: "",
    unit_no: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        validationErrors[key] = "This field is required";
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setResult(null);
    setModelMetrics(null);

    try {
      const response = await axios.post("http://127.0.0.1:8080/predict", {
        state: formData.state,
        category: formData.category,
        total_capacity: Number(formData.total_capacity),
        commissioning_date: formData.commissioning_date,
        so2_norms: Number(formData.so2_norms),
        prior_avg_so2: Number(formData.prior_avg_so2),
        unit_no: Number(formData.unit_no),
      });

      setResult(response.data.predicted_so2_emissions);
      setModelMetrics(response.data.model_metrics || null);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Failed to fetch prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="flex-1 overflow-auto relative z-10">
      <Header title="Prediction" />

      <main className="relative mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="absolute inset-x-4 top-8 -z-10 h-72 rounded-[3rem] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_45%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_38%)] blur-3xl" />

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <motion.section
              className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.4)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-slate-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                  <Zap className="h-3.5 w-3.5" />
                  Plant-level forecast
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
                  Real CSV features from the repository
                </span>
              </div>

              <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Predict 2024-25 SO2 using real plant-level inputs.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                The model is trained on the repository's plant registry and uses state, category,
                capacity, commissioning date, norms, prior-year emission, and unit count to forecast
                the 2024-25 average SO2 level.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Inputs</p>
                  <p className="mt-2 text-lg font-semibold text-white">7 plant signals</p>
                  <p className="mt-1 text-sm text-slate-400">State, category, capacity, date, norms, prior reading, unit count</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Output</p>
                  <p className="mt-2 text-lg font-semibold text-white">2024-25 average SO2</p>
                  <p className="mt-1 text-sm text-slate-400">Measured in mg/Nm<sup>3</sup></p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Quality</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {modelMetrics?.r2 != null ? `${Math.round(modelMetrics.r2 * 100)}% fit` : "Live on submit"}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">Validation metrics are visible on every prediction</p>
                </div>
              </div>
            </motion.section>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {result !== null ? (
                <PredictionsResult result={result} metrics={modelMetrics} />
              ) : (
                <div className="rounded-[2rem] border border-dashed border-white/15 bg-slate-950/55 p-6 text-sm text-slate-400 shadow-[0_20px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl">
                  The prediction panel will appear here after you run the form.
                  <span className="mt-2 block text-slate-500">
                    The card also exposes the latest validation metrics so the model quality is
                    visible at a glance.
                  </span>
                </div>
              )}
            </motion.div>

            <AIPoweredInsights />
          </div>

          <motion.section
            className="sticky top-6 h-fit rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Prediction studio</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Run a forecast</h3>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Live
              </div>
            </div>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    State
                  </label>
                  <select
                    name="state"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:bg-white/10"
                    onChange={handleChange}
                    value={formData.state}
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {STATES.map((state) => (
                      <option key={state} value={state} className="bg-slate-900">
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-rose-400">{errors.state}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:bg-white/10"
                    onChange={handleChange}
                    value={formData.category}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category} className="bg-slate-900">
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-rose-400">{errors.category}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Total capacity (MW)
                  </label>
                  <input
                    name="total_capacity"
                    type="number"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/40 focus:bg-white/10"
                    placeholder="800"
                    onChange={handleChange}
                    value={formData.total_capacity}
                  />
                  {errors.total_capacity && <p className="mt-1 text-sm text-rose-400">{errors.total_capacity}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Commissioning date
                  </label>
                  <input
                    name="commissioning_date"
                    type="date"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:bg-white/10"
                    onChange={handleChange}
                    value={formData.commissioning_date}
                  />
                  {errors.commissioning_date && <p className="mt-1 text-sm text-rose-400">{errors.commissioning_date}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    SO2 norms (mg/Nm3)
                  </label>
                  <input
                    name="so2_norms"
                    type="number"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/40 focus:bg-white/10"
                    placeholder="200"
                    onChange={handleChange}
                    value={formData.so2_norms}
                  />
                  {errors.so2_norms && <p className="mt-1 text-sm text-rose-400">{errors.so2_norms}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Previous year average SO2
                  </label>
                  <input
                    name="prior_avg_so2"
                    type="number"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/40 focus:bg-white/10"
                    placeholder="623"
                    onChange={handleChange}
                    value={formData.prior_avg_so2}
                  />
                  {errors.prior_avg_so2 && <p className="mt-1 text-sm text-rose-400">{errors.prior_avg_so2}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Unit number
                </label>
                <input
                  name="unit_no"
                  type="number"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/40 focus:bg-white/10"
                  placeholder="1"
                  onChange={handleChange}
                  value={formData.unit_no}
                />
                {errors.unit_no && <p className="mt-1 text-sm text-rose-400">{errors.unit_no}</p>}
              </div>

              <button
                className="group mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin" size={20} color="#0f172a" />
                ) : (
                  <>
                    Generate plant forecast
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </motion.section>
        </div>
      </main>
    </motion.div>
  );
};

export default PredictionsPage;
