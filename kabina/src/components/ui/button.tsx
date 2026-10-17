import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "ghost" | "danger" | "light";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-brand-400 text-ink-950 hover:bg-brand-300 shadow-[0_1px_0_rgb(15_14_12/0.08)]",
  dark: "bg-ink-950 text-white hover:bg-ink-800",
  outline: "border border-ink-200 bg-white text-ink-900 hover:bg-ink-50 hover:border-ink-300",
  ghost: "text-ink-800 hover:bg-ink-100",
  danger: "bg-rec text-white hover:bg-[#c93a3f]",
  light: "bg-white/10 text-white hover:bg-white/20 border border-white/15",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
  icon: "h-10 w-10 p-0",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: ReactNode;
};

export function Button({ variant = "primary", size = "md", loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} disabled={disabled || loading} {...props}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  prefetch?: boolean;
  target?: string;
  rel?: string;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
