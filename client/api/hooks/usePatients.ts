import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export interface PatientDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone?: string;
  email?: string;
}

export interface GlobalPatientItem {
  _id: string;
  doctorId: PatientDoctor;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  doctorId?: string;
  gender?: string;
}

export interface PatientsApiResponse {
  status: string;
  results: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: {
    patients: GlobalPatientItem[];
  };
}

export interface UpdatePatientData {
  name?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  phone?: string;
  email?: string;
  condition?: string;
  doctorId?: string;
}

export function usePatients(params: PatientsQueryParams = {}) {
  const axiosSecure = useAxiosSecure();
  const { page = 1, limit = 10, search, condition, doctorId, gender } = params;

  const queryKey = ["patients", { page, limit, search, condition, doctorId, gender }];

  const { data, isLoading, isError, refetch } = useQuery<PatientsApiResponse>({
    queryKey,
    queryFn: async () => {
      const response = await axiosSecure.get<PatientsApiResponse>("/patients", {
        params: { page, limit, search, condition, doctorId, gender },
      });
      return response.data;
    },
  });

  return {
    patients: data?.data?.patients || [],
    pagination: data?.pagination,
    isLoading,
    isError,
    refetch,
  };
}

export function usePatientConditions() {
  const axiosSecure = useAxiosSecure();
  return useQuery<string[]>({
    queryKey: ["patient-conditions"],
    queryFn: async () => {
      const response = await axiosSecure.get<PatientsApiResponse>("/patients", {
        params: { limit: 100 },
      });
      const list = response.data.data.patients || [];
      const distinct = Array.from(new Set(list.map((p: GlobalPatientItem) => p.condition))).sort();
      return distinct;
    },
  });
}

export function useUpdatePatient() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePatientData }) => {
      const response = await axiosSecure.patch<{ status: string; data: { patient: GlobalPatientItem } }>(
        `/patients/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeleteGlobalPatient() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosSecure.delete<{ status: string; message: string }>(
        `/patients/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
