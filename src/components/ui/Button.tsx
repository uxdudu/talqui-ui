import type { ButtonHTMLAttributes, ReactNode } from "react";

const sizeClasses = {
  small:
    "min-h-[32px] rounded-(--talqui-radius-sm) px-2.5 py-1.5 text-sm font-semibold leading-5",
  medium:
    "min-h-[36px] rounded-(--talqui-radius-sm) px-3 py-2 text-sm font-semibold leading-5",
  large:
    "min-h-[40px] rounded-(--talqui-radius-sm) px-4 py-2.5 text-sm font-semibold leading-5",
} as const;

const variantClasses = {
  primary:
    "border-transparent bg-(--talqui-text-primary) text-white hover:opacity-90 focus-visible:ring-(--talqui-text-primary)",
  primaryOutline:
    "border border-(--talqui-text-primary) bg-transparent text-(--talqui-text-primary) hover:bg-(--talqui-text-primary)/10 focus-visible:ring-(--talqui-text-primary)",
  secondary:
    "border border-(--talqui-border-weak) bg-(--talqui-bg-base) text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker) focus-visible:ring-(--talqui-text-primary)",
  secondaryOutline:
    "border border-(--talqui-text-primary) bg-(--talqui-bg-base) text-(--talqui-text-primary) hover:bg-(--talqui-bg-weaker) focus-visible:ring-(--talqui-text-primary)",
  danger:
    "border border-(--talqui-border-weak) bg-(--talqui-bg-base) text-(--talqui-text-medium) hover:bg-red-50 hover:text-red-700 hover:border-red-200 focus-visible:ring-red-500",
  ghost:
    "border-transparent bg-transparent text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker) focus-visible:ring-(--talqui-text-primary)",
  disabled:
    "border border-(--talqui-border-weak) bg-(--talqui-bg-base) text-(--talqui-text-weak) cursor-not-allowed",
} as const;

const focusRing =
  "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export type ButtonSize = keyof typeof sizeClasses;
export type ButtonVariant = keyof typeof variantClasses;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

export function Button({
  size = "medium",
  variant = "secondary",
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const variantKey = disabled && variant !== "ghost" ? "disabled" : variant;
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex shrink-0 items-center justify-center transition-colors duration-200 ${sizeClasses[size]} ${variantClasses[variantKey]} ${focusRing} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
