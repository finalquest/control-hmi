import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "primary" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
  active?: boolean;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  default: "",
  primary: "btn--primary",
  danger: "btn--danger",
};

export function Button({
  variant = "default",
  full,
  active,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    "btn",
    variantClass[variant],
    full ? "btn--full" : "",
    active ? "btn--active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
