import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Activity, BadgeCheck } from "lucide-react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getQualityLabel = (confidence) => {
  if (confidence >= 85) return "Production fit";
  if (confidence >= 70) return "Strong fit";
  if (confidence >= 55) return "Usable fit";
  return "Needs tuning";
};

const getQualityTone = (confidence) => {
  if (confidence >= 85) return "text-emerald-300 border-emerald-400/20 bg-emerald-400/10";
  if (confidence >= 70) return "text-cyan-300 border-cyan-400/20 bg-cyan-400/10";
  if (confidence >= 55) return "text-amber-300 border-amber-400/20 bg-amber-400/10";
  return "text-rose-300 border-rose-400/20 bg-rose-400/10";
};

const MetricChip = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</p>
    <p className="mt-1 text-lg font-semibold text-white">{value}</p>
  </div>
);

const PredictionsResult = ({ result, metrics }) => {
  const confidence = useMemo(
    () => clamp(Math.round((metrics?.r2 ?? 0) * 100), 0, 100),
    [metrics]
  );

  const chartData = [
    { name: "fit", value: confidence },
    { name: "remainder", value: 100 - confidence },
  ];

  const qualityLabel = getQualityLabel(confidence);
  const qualityTone = getQualityTone(confidence);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-400/75">
            Prediction result
          </p>
          <h3 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {result}
            <span className="ml-3 text-base font-medium text-slate-400">
              mg/Nm<sup>3</sup>
            </span>
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Estimated 2024-25 average SO2 for the selected plant profile. The quality snapshot
            below shows how stable the model is on recent validation data.
          </p>
        </div>

        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${qualityTone}`}>
          <BadgeCheck className="h-4 w-4" />
          {qualityLabel}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[180px_1fr]">
        <div className="relative h-[180px] rounded-[1.5rem] border border-white/10 bg-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                innerRadius={58}
                outerRadius={78}
                stroke="none"
                cornerRadius={10}
              >
                <Cell fill="#10b981" />
                <Cell fill="rgba(148,163,184,0.16)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <Activity className="h-5 w-5 text-emerald-300" />
            <p className="mt-2 text-3xl font-semibold text-white">{confidence}%</p>
            <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">fit score</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <MetricChip label="Validation MAE" value={metrics?.mae != null ? metrics.mae : "--"} />
          <MetricChip label="Validation RMSE" value={metrics?.rmse != null ? metrics.rmse : "--"} />
          <MetricChip label="Validation MAPE" value={metrics?.mape != null ? `${metrics.mape}%` : "--"} />
          <MetricChip label="Validation R²" value={metrics?.r2 != null ? metrics.r2 : "--"} />
        </div>
      </div>
    </div>
  );
};

export default PredictionsResult;
