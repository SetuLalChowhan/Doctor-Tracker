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

export default function WorkloadChart({ data }: WorkloadChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#038AF9]" /> Workload per Doctor
          </h2>
          <p className="text-xs text-slate-500">Patient count distribution across active doctors</p>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No workload data"
          description="Doctor patient statistics will appear here automatically."
        />
      ) : (
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "rgba(3, 138, 249, 0.05)" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "10px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
              />
              <Bar dataKey="patients" fill="#038AF9" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
