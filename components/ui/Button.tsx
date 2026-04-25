"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses = {
  primary:
    "bg-espresso text-[#fff8ee] hover:bg-[#3a312a] border border-espresso",
  outline:
    "bg-transparent text-charcoal border border-silver-light hover:border-charcoal hover:text-espresso",
  ghost:
    "bg-transparent text-muted hover:text-charcoal border border-transparent",
  danger:
    "bg-red-700 text-white hover:bg-red-800 border border-red-700",
};

const sizeClasses = {
  sm: "px-4 py-2 text-xs tracking-widest",
  md: "px-6 py-3 text-xs tracking-widest",
  lg: "px-8 py-4 text-xs tracking-[0.15em]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center gap-2 uppercase font-sans font-medium",
          "transition-all duration-200 cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
