"use client";

import React from "react";
import useDashboard from "@/api/hooks/useDashboard";
import { CardSkeleton, ChartSkeleton } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";
import MetricCards from "@/components/dashboard/analytics/MetricCards";
import WorkloadChart from "@/components/dashboard/analytics/WorkloadChart";
import TrendChart from "@/components/dashboard/analytics/TrendChart";
import ConditionChart from "@/components/dashboard/analytics/ConditionChart";

export default function DashboardPage() {
  const { stats, isLoading, isError, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load dashboard statistics"
        message="Could not connect to the analytics endpoint. Please ensure the backend server is running."
        onRetry={refetch}
      />
    );
  }

  const totalDoctors = stats?.totalDoctors || 0;
  const totalPatients = stats?.totalPatients || 0;
  const avgPatientsPerDoctor =
    totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : "0";

  const patientsPerDoctorChartData =
    stats?.patientsPerDoctor?.map((item) => ({
      name: item.doctorName,
      patients: item.patientCount,
      specialization: item.specialization,
    })) || [];

  return (
    <div className="space-y-6">
      {/* Clinical Dashboard Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Clinical Overview & Metrics
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1.5">
            Real-time physician workload, patient enrollments, and condition statistics
          </p>
        </div>
      </div>

      {/* Metric Cards Row */}
      <MetricCards
        totalDoctors={totalDoctors}
        totalPatients={totalPatients}
        avgPatientsPerDoctor={avgPatientsPerDoctor}
        conditionCount={stats?.conditionStats?.length || 0}
      />

      {/* Visual Analytics Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WorkloadChart data={patientsPerDoctorChartData} />
        <TrendChart data={stats?.dateBasedStats || []} />
      </div>

      {/* Condition Distribution Section */}
      <ConditionChart data={stats?.conditionStats || []} />
    </div>
  );
}