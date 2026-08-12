import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import EmptyState from "@/components/common/EmptyState";

interface ConditionChartProps {
  data: Array<{
    condition: string;
    count: number;
  }>;
}

const DONUT_COLORS = ["#038AF9", "#3b82f6", "#60a5fa", "#93c5fd", "#cbd5e1"];

export default function ConditionChart({ data }: ConditionChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-1">Patient Condition Distribution</h2>
      <p className="text-xs text-slate-500 mb-4">Categorical breakdown of registered medical conditions</p>

      {data.length === 0 ? (
        <EmptyState title="No condition distribution data" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="condition"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {data.map((item, idx) => (
              <div
                key={item.condition}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                  />
                  <span className="text-xs font-semibold text-slate-700">{item.condition}</span>
                </div>
                <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                  {item.count} patients
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
