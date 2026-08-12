import React from "react";
import { Activity } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import EmptyState from "@/components/common/EmptyState";

interface ConditionChartProps {
  data: Array<{
    condition: string;
    count: number;
  }>;
}

const DONUT_COLORS = ["#038AF9", "#10b981", "#8b5cf6", "#f59e0b", "#64748b"];

export default function ConditionChart({ data }: ConditionChartProps) {
  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-600" /> Patient Diagnosis Distribution
          </h2>
          <p className="text-xs text-slate-600">Categorical breakdown of active medical conditions</p>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No condition distribution data" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="condition"
                  cornerRadius={4}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label inside Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Patients
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {data.map((item, idx) => {
              const percentage = totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(0) : "0";
              return (
                <div
                  key={item.condition}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                    />
                    <span className="text-xs font-bold text-slate-900">{item.condition}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-slate-600">{percentage}%</span>
                    <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-300">
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

