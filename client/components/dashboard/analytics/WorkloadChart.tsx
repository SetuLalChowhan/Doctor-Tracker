import React from "react";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "@/components/common/EmptyState";

interface WorkloadChartProps {
  data: Array<{
    name: string;
    patients: number;
    specialization?: string;
  }>;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-md text-xs space-y-1">
        <p className="font-bold text-slate-900 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-600" />
          {item.name}
        </p>
        {item.specialization && (
          <p className="text-slate-600 font-medium">{item.specialization}</p>
        )}
        <div className="pt-1 text-sky-700 font-bold flex items-center gap-1">
          <span>{item.patients} Active Patients</span>
        </div>
      </div>
    );
  }
  return null;
};

const formatXAxisName = (fullName: string) => {
  if (!fullName) return "";
  const parts = fullName.replace(/^Dr\.\s*/i, "").trim().split(" ");
  if (parts.length >= 2) {
    return `Dr. ${parts[parts.length - 1]}`;
  }
  return fullName.length > 10 ? `${fullName.slice(0, 9)}…` : fullName;
};

export default function WorkloadChart({ data }: WorkloadChartProps) {
  const minWidth = Math.max(500, data.length * 50);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-sky-600" /> Workload Distribution per Doctor
          </h2>
          <p className="text-xs text-slate-600">Patient allocation across active clinical staff</p>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No workload data"
          description="Doctor patient statistics will appear here automatically."
        />
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="h-72 pt-2" style={{ minWidth: data.length > 6 ? `${minWidth}px` : "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tick={{ fontSize: 10, fill: "#475569", fontWeight: 600 }}
                  tickFormatter={formatXAxisName}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  allowDecimals={false}
                />
                <Tooltip cursor={{ fill: "rgba(241, 245, 249, 0.7)" }} content={<CustomTooltip />} />
                <Bar
                  dataKey="patients"
                  fill="#0284c7"
                  radius={[4, 4, 0, 0]}
                  barSize={Math.min(32, Math.max(16, 400 / (data.length || 1)))}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

