import React from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "@/components/common/EmptyState";

interface TrendChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" /> Patient Registration Trend
          </h2>
          <p className="text-xs text-slate-500">Date-based patient registration statistics</p>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No trend data"
          description="Date-wise patient registration records will appear here."
        />
      ) : (
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#038AF9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#038AF9" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "10px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#038AF9"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#trendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
