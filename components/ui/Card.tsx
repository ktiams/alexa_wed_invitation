interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={[
        "bg-white border border-silver-light p-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: CardProps) {
  return (
    <h3
      className={[
        "text-xs uppercase tracking-widest text-muted font-sans font-medium mb-4",
        className,
      ].join(" ")}
    >
      {children}
    </h3>
  );
}
