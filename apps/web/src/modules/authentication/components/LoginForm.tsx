"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import { loginSchema, type LoginSchema } from "@repo/shared";
import { useLogin } from "../hooks/useLogin";
import SweetAlert from "@/lib/alerts/alert";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchema) {
    try {
      await login(data);

      SweetAlert.successAlert(
        "Success",
        "Login successful"
      );
    } catch {
      SweetAlert.errorAlert(
        "Error",
        "Invalid credentials"
      );
    }
  }

  const inputClassName = `
    h-12
    w-full
    rounded-xl
    border
    border-slate-200
    bg-white
    pl-11
    pr-4
    text-sm
    text-slate-900
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    hover:border-slate-300
    focus:border-indigo-500
    focus:ring-4
    focus:ring-indigo-500/10
    disabled:cursor-not-allowed
    disabled:bg-slate-50
    disabled:opacity-60
  `;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
    >
      {/* USERNAME */}
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-slate-700"
        >
          Username
        </label>

        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            disabled={isPending}
            aria-invalid={!!errors.username}
            aria-describedby={
              errors.username ? "username-error" : undefined
            }
            {...register("username")}
            className={`${inputClassName} ${
              errors.username
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                : ""
            }`}
          />
        </div>

        {errors.username && (
          <p
            id="username-error"
            role="alert"
            className="text-xs font-medium text-red-500"
          >
            {errors.username.message}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-slate-700"
        >
          Password
        </label>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isPending}
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "password-error" : undefined
            }
            {...register("password")}
            className={`${inputClassName} pr-12 ${
              errors.password
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                : ""
            }`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isPending}
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
            aria-pressed={showPassword}
            className="
              absolute
              right-3.5
              top-1/2
              -translate-y-1/2
              rounded-md
              p-1
              text-slate-400
              transition
              hover:text-slate-700
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              disabled:cursor-not-allowed
            "
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-xs font-medium text-red-500"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* SUBMIT */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="
            group
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-indigo-600
            px-4
            text-sm
            font-semibold
            text-white
            shadow-lg
            shadow-indigo-600/15
            transition-all
            duration-200
            hover:bg-indigo-700
            hover:shadow-indigo-600/25
            active:scale-[0.99]
            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-indigo-500/30
            disabled:cursor-not-allowed
            disabled:opacity-60
            disabled:active:scale-100
          "
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}