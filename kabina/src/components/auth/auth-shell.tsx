import { LogoMark } from "@/components/logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-float md:p-8">
          <LogoMark className="h-10 w-10" />
          <h1 className="mt-5 text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-ink-600">{subtitle}</p>
          <div className="mt-6 space-y-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
