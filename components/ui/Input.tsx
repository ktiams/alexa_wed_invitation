"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const baseInput = [
  "w-full bg-card border px-4 py-3.5 text-sm font-sans text-charcoal",
  "placeholder:text-taupe outline-none",
  "transition-all duration-200",
].join(" ");

const borderNormal = "border-silver-light focus:border-gold-dark focus:ring-2 focus:ring-gold/15";
const borderError  = "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200/40";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm uppercase tracking-wider text-silver-dark font-sans font-medium"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={[baseInput, error ? borderError : borderNormal, className].join(" ")}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 font-sans">{error}</p>
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
          <label
            htmlFor={id}
            className="text-sm uppercase tracking-wider text-silver-dark font-sans font-medium"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={[
            "w-full bg-card border px-4 py-3.5 text-sm font-sans text-charcoal resize-none",
            "placeholder:text-taupe outline-none",
            "transition-all duration-200",
            error ? borderError : borderNormal,
            className,
          ].join(" ")}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 font-sans">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
