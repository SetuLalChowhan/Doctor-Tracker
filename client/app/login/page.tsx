"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Activity, Mail, Lock, KeyRound, Loader2, ArrowRight } from "lucide-react";
import useAuth, { LoginPayload } from "@/api/hooks/useAuth";
import { selectIsAuthenticated } from "@/redux/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: LoginPayload) => {
    login(data);
  };

  const fillDemoCredentials = () => {
    setValue("email", "admin@doctortracker.com", { shouldValidate: true });
    setValue("password", "Admin123!", { shouldValidate: true });
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-900 text-slate-100">
      {/* Left side branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-r border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-96 w-96 rounded-full bg-[#038AF9]/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#038AF9] text-white shadow-lg">
            <Activity className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Doctor Tracker</span>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Administrative Management System
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Manage doctors, monitor patient records, filter data, and view real-time aggregation analytics.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Doctor Tracker. All rights reserved.
        </div>
      </div>

      {/* Right side login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex lg:hidden justify-center mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#038AF9] text-white shadow-lg">
                <Activity className="h-6 w-6 stroke-[2.5]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to Portal</h2>
            <p className="text-sm text-slate-400">
              Enter your credentials to access the portal.
            </p>
          </div>

          {/* Quick Fill Demo Credentials Card */}
          <div className="rounded-xl border border-[#038AF9]/30 bg-[#038AF9]/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#038AF9] flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5" /> Demo Admin Account
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs font-semibold text-[#038AF9] hover:underline cursor-pointer"
              >
                Auto-fill credentials
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-1 font-mono bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <div><span className="text-slate-500">Email:</span> admin@doctortracker.com</div>
              <div><span className="text-slate-500">Password:</span> Admin123!</div>
            </div>
          </div>

          {/* React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-3">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  placeholder="admin@doctortracker.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#038AF9] focus:outline-none focus:ring-1 focus:ring-[#038AF9] transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-400 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-3">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#038AF9] focus:outline-none focus:ring-1 focus:ring-[#038AF9] transition-colors"
                />
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-400 mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#038AF9] hover:bg-[#0277dc] text-white py-2.5 text-sm font-semibold shadow-md transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
