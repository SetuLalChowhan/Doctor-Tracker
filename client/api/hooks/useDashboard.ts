import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export interface DashboardStatsData {
  totalDoctors: number;
  totalPatients: number;
  patientsPerDoctor: Array<{
    _id: string;
    doctorId: string;
    doctorName: string;
    specialization: string;
    hospital: string;
    patientCount: number;
  }>;
  dateBasedStats: Array<{
    date: string;
    count: number;
  }>;
  conditionStats: Array<{
    condition: string;
    count: number;
  }>;
}

export const useDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const query = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await axiosSecure.get("/dashboard/stats");
      return response.data?.data as DashboardStatsData;
    },
    staleTime: 60 * 1000,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useDashboard;
