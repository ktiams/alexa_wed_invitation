import React from "react";

// Botón perla (componente "Pearl Button" de 21st.dev). El estilo vive en app/globals.css
// (.pearl-button) para no repetir un <style> por cada botón. Cacao para acciones
// principales y champán para secundarias. Con `href` se dibuja como enlace.

type Tone = "cacao" | "champan";

type CommonProps = {
  label: string;
  tone?: Tone;
  className?: string;
};

type PearlButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

type PearlButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & { href: string };

export type PearlButtonProps = PearlButtonAsButton | PearlButtonAsLink;

function Inner({ label }: { label: string }) {
  return (
    <span className="wrap">
      <span className="pearl-label">
        <span aria-hidden="true">✧</span>
        <span aria-hidden="true">✦</span>
        {label}
      </span>
    </span>
  );
}

export function PearlButton({ label, tone = "cacao", className = "", ...rest }: PearlButtonProps) {
  const classes = `pearl-button${tone === "champan" ? " pearl-champan" : ""} ${className}`;

  if (rest.href !== undefined) {
    return (
      <a {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
        <Inner label={label} />
      </a>
    );
  }

  const { type = "button", ...buttonProps } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonProps} type={type} className={classes}>
      <Inner label={label} />
    </button>
  );
}
