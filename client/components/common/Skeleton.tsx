import React from "react";

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-slate-200"></div>
        <div className="h-9 w-9 rounded-lg bg-slate-200"></div>
      </div>
      <div className="h-8 w-20 rounded bg-slate-200"></div>
      <div className="h-3 w-36 rounded bg-slate-100"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="h-5 w-36 rounded bg-slate-200"></div>
        <div className="h-8 w-24 rounded bg-slate-200"></div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2">
            <div className="h-4 w-1/4 rounded bg-slate-200"></div>
            <div className="h-4 w-1/5 rounded bg-slate-200"></div>
            <div className="h-4 w-1/6 rounded bg-slate-200"></div>
            <div className="h-4 w-1/6 rounded bg-slate-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse space-y-4">
      <div className="h-5 w-48 rounded bg-slate-200"></div>
      <div className="h-64 w-full rounded-lg bg-slate-100 flex items-end justify-between p-4 gap-2">
        <div className="h-1/3 w-full bg-slate-200 rounded-t"></div>
        <div className="h-2/3 w-full bg-slate-200 rounded-t"></div>
        <div className="h-1/2 w-full bg-slate-200 rounded-t"></div>
        <div className="h-5/6 w-full bg-slate-200 rounded-t"></div>
        <div className="h-2/5 w-full bg-slate-200 rounded-t"></div>
      </div>
    </div>
  );
}
