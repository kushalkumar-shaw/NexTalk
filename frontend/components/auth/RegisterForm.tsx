"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password") || "";

  // Simple password strength indicator
  const getPasswordStrength = () => {
    if (passwordValue.length === 0) return 0;
    if (passwordValue.length < 6) return 1;
    if (passwordValue.length >= 8 && /[A-Z]/.test(passwordValue) && /[0-9]/.test(passwordValue)) return 3;
    return 2;
  };

  const strength = getPasswordStrength();

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setServerError("");
    try {
      await registerUser(data.username, data.email, data.password);
      toast.success("Account created! Welcome to NexTalk.");
    } catch (error: any) {
      if (Array.isArray(error.message)) {
        setServerError(error.message[0]?.message || "Validation failed");
      } else {
        setServerError(error.message || "Registration failed");
      }
      toast.error("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text-main mb-2">Create an account</h1>
        <p className="text-sidebar-muted text-sm">Join the NexTalk community today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-sidebar-muted uppercase tracking-wider">
            Username <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("username")}
            type="text"
            icon={<User size={16} />}
            error={errors.username?.message}
          />
        </div>

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
          <div className="relative mb-2">
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
          
          {/* Strength Indicator */}
          <div className="flex gap-1 h-1 mt-2">
            <div className={`flex-1 rounded-full ${strength >= 1 ? (strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-amber-500' : 'bg-green-500') : 'bg-sidebar-border'}`}></div>
            <div className={`flex-1 rounded-full ${strength >= 2 ? (strength === 2 ? 'bg-amber-500' : 'bg-green-500') : 'bg-sidebar-border'}`}></div>
            <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-green-500' : 'bg-sidebar-border'}`}></div>
          </div>
        </div>

        {serverError && (
          <div className="text-red-500 text-sm bg-red-500/10 p-2.5 rounded border border-red-500/20">
            {serverError}
          </div>
        )}

        <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
          Continue
        </Button>
      </form>
    </div>
  );
}
