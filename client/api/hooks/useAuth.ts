import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useAxiosPublic from "./useAxiosPublic";
import useAxiosSecure from "./useAxiosSecure";
import { setToken, clearAuth, selectCurrentToken, selectIsAuthenticated } from "@/redux/slices/authSlice";
import { setUser, clearUiState } from "@/redux/slices/userSlice";

export interface LoginPayload {
  email: string;
  password?: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const response = await axiosPublic.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      const authToken = data.token;
      const user = data.data?.user;

      if (authToken) {
        dispatch(setToken({ token: authToken }));
        if (user) {
          dispatch(setUser({ user }));
        }
        toast.success("Successfully logged in! Welcome back.");
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errorMessage);
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await axiosSecure.post("/auth/logout");
      } catch (err) {
        // Ignore logout network errors
      }
    },
    onSettled: () => {
      dispatch(clearAuth());
      dispatch(clearUiState());
      queryClient.clear();
      toast.info("Logged out successfully");
      router.push("/login");
    },
  });

  // Current User Query
  const currentUserQuery = useQuery({
    queryKey: ["currentUser", token],
    queryFn: async () => {
      const response = await axiosSecure.get("/auth/me");
      return response.data?.data?.user;
    },
    enabled: !!token && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  return {
    token,
    isAuthenticated,
    user: currentUserQuery.data,
    isLoadingUser: currentUserQuery.isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};

export default useAuth;
