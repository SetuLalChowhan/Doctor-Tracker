import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { toast } from "react-toastify";

export interface DoctorItem {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PatientItem {
  _id: string;
  doctorId: string | DoctorItem;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
}

export interface DoctorPatientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
}

export const useDoctors = (queryParams?: DoctorsQueryParams) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Doctors Listing Query
  const doctorsQuery = useQuery({
    queryKey: ["doctors", queryParams],
    queryFn: async () => {
      const response = await axiosSecure.get("/doctors", { params: queryParams });
      return response.data;
    },
  });

  // Create Doctor Mutation
  const createDoctorMutation = useMutation({
    mutationFn: async (payload: Partial<DoctorItem>) => {
      const response = await axiosSecure.post("/doctors", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Doctor created successfully!");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create doctor.");
    },
  });

  // Update Doctor Mutation
  const updateDoctorMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<DoctorItem> }) => {
      const response = await axiosSecure.patch(`/doctors/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Doctor updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update doctor.");
    },
  });

  // Delete Doctor Mutation
  const deleteDoctorMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosSecure.delete(`/doctors/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Doctor deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete doctor.");
    },
  });

  return {
    doctors: doctorsQuery.data?.data?.doctors as DoctorItem[] | undefined,
    pagination: doctorsQuery.data?.pagination,
    isLoading: doctorsQuery.isLoading,
    isError: doctorsQuery.isError,
    error: doctorsQuery.error,
    refetch: doctorsQuery.refetch,
    createDoctor: createDoctorMutation.mutate,
    isCreatingDoctor: createDoctorMutation.isPending,
    updateDoctor: updateDoctorMutation.mutate,
    isUpdatingDoctor: updateDoctorMutation.isPending,
    deleteDoctor: deleteDoctorMutation.mutate,
    isDeletingDoctor: deleteDoctorMutation.isPending,
  };
};

export const useDoctorDetails = (doctorId: string, params?: DoctorPatientsQueryParams) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Get Doctor Details
  const doctorQuery = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/doctors/${doctorId}`);
      return response.data?.data?.doctor as DoctorItem;
    },
    enabled: !!doctorId,
  });

  // Get Patients for Doctor
  const doctorPatientsQuery = useQuery({
    queryKey: ["doctorPatients", doctorId, params],
    queryFn: async () => {
      const response = await axiosSecure.get(`/doctors/${doctorId}/patients`, { params });
      return response.data;
    },
    enabled: !!doctorId,
  });

  // Create Patient under Doctor
  const createPatientMutation = useMutation({
    mutationFn: async (payload: Partial<PatientItem>) => {
      const response = await axiosSecure.post(`/doctors/${doctorId}/patients`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Patient added successfully!");
      queryClient.invalidateQueries({ queryKey: ["doctorPatients", doctorId] });
      queryClient.invalidateQueries({ queryKey: ["doctor", doctorId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add patient.");
    },
  });

  // Delete Patient under Doctor
  const deletePatientMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const response = await axiosSecure.delete(`/doctors/${doctorId}/patients/${patientId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Patient removed successfully.");
      queryClient.invalidateQueries({ queryKey: ["doctorPatients", doctorId] });
      queryClient.invalidateQueries({ queryKey: ["doctor", doctorId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove patient.");
    },
  });

  return {
    doctor: doctorQuery.data,
    isLoadingDoctor: doctorQuery.isLoading,
    isDoctorError: doctorQuery.isError,
    patients: doctorPatientsQuery.data?.data?.patients as PatientItem[] | undefined,
    pagination: doctorPatientsQuery.data?.pagination,
    isLoadingPatients: doctorPatientsQuery.isLoading,
    isPatientsError: doctorPatientsQuery.isError,
    refetchPatients: doctorPatientsQuery.refetch,
    addPatient: createPatientMutation.mutate,
    isAddingPatient: createPatientMutation.isPending,
    deletePatient: deletePatientMutation.mutate,
    isDeletingPatient: deletePatientMutation.isPending,
  };
};

export default useDoctors;
