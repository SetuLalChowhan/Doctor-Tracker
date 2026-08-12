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

const CustomTrendTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-md text-xs space-y-1">
        <p className="font-semibold text-slate-600">{item.date}</p>
        <div className="pt-0.5 text-emerald-700 font-bold flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <span>{item.count} Registrations</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" /> Patient Registration History
          </h2>
          <p className="text-xs text-slate-600">Chronological enrollment volume</p>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No trend data"
          description="Date-wise patient registration records will appear here."
        />
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTrendTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#trendGradient)"
                activeDot={{ r: 5, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

