interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <span
      role="status"
      className={[
        "inline-block rounded-full border-silver border-t-charcoal animate-spin",
        sizeClasses[size],
        className,
      ].join(" ")}
    />
  );
}
