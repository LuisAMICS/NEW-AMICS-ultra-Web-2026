import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 shadow-[inset_0_1px_2px_rgb(15_14_12/0.03)] transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-400/20 disabled:bg-ink-50";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-28 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(control, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23736d63%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9", className)} {...props}>
      {children}
    </select>
  );
}

export function Label({ children, htmlFor, className, hint }: { children: ReactNode; htmlFor?: string; className?: string; hint?: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-1.5 block text-sm font-semibold text-ink-800", className)}>
      {children}
      {hint ? <span className="ml-1.5 font-normal text-ink-500">{hint}</span> : null}
    </label>
  );
}

export function Field({ label, htmlFor, hint, error, children, className }: { label: ReactNode; htmlFor?: string; hint?: ReactNode; error?: string | null; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} hint={hint}>
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-rec" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Checkbox({ className, label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-sm text-ink-800", className)}>
      <input type="checkbox" className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded border-ink-300 accent-ink-950" {...props} />
      <span>{label}</span>
    </label>
  );
}

export function Switch({ checked, onChange, label, name }: { checked: boolean; onChange: (v: boolean) => void; label?: ReactNode; name?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={cn("relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition", checked ? "bg-ink-950" : "bg-ink-200")}
      >
        <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition", checked ? "translate-x-6" : "translate-x-1")} />
      </span>
      {name ? <input type="hidden" name={name} value={checked ? "1" : ""} /> : null}
      {label ? <span className="text-sm text-ink-800">{label}</span> : null}
    </label>
  );
}
