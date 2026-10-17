"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// 16px como mínimo: Safari en iPhone hace zoom al enfocar campos con letra más pequeña.
const baseInput = [
  "w-full rounded-xl bg-card border px-4 py-3.5 text-base font-body text-charcoal",
  "placeholder:text-taupe outline-none",
  "transition-all duration-200",
].join(" ");

const borderNormal = "border-silver-light focus:border-gold-dark focus:ring-2 focus:ring-gold/20";
const borderError  = "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200/40";

const labelClass = "text-sm font-body font-medium text-silver-dark";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          className={[baseInput, error ? borderError : borderNormal, className].join(" ")}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-700 font-body">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          className={[
            "w-full rounded-xl bg-card border px-4 py-3.5 text-base font-body text-charcoal resize-none",
            "placeholder:text-taupe outline-none",
            "transition-all duration-200",
            error ? borderError : borderNormal,
            className,
          ].join(" ")}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-700 font-body">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
