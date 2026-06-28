"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError("");
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
    } catch (error: any) {
      setServerError(error.message || "Invalid credentials");
      toast.error(error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text-main mb-2">Welcome back</h1>
        <p className="text-sidebar-muted text-sm">We're so excited to see you again!</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-sidebar-muted uppercase tracking-wider">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("email")}
            type="email"
            icon={<Mail size={16} />}
            error={errors.email?.message}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-sidebar-muted uppercase tracking-wider">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              icon={<Lock size={16} />}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sidebar-muted hover:text-text-main"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {serverError && (
          <div className="text-red-500 text-sm bg-red-500/10 p-2.5 rounded border border-red-500/20">
            {serverError}
          </div>
        )}

        <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
          Log In
        </Button>
      </form>
    </div>
  );
}
