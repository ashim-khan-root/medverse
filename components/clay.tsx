import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { Info, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ClayCardProps = HTMLAttributes<HTMLDivElement>;

export function ClayCard({ className, children, ...props }: ClayCardProps) {
  return (
    <div className={cn("clay-card p-5 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}

type ClayButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "soft" | "mint";
  block?: boolean;
};

export function ClayButton({
  className,
  variant = "primary",
  block,
  children,
  ...props
}: ClayButtonProps) {
  return (
    <button
      className={cn(
        "btn",
        variant === "primary" && "btn-primary",
        variant === "soft" && "btn-soft",
        variant === "mint" && "btn-mint",
        block && "btn-block",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Chip({
  children,
  tone = "soft",
  className,
}: {
  children: ReactNode;
  tone?: "soft" | "mint" | "sky" | "peach" | "lavender" | "sun" | "coral" | "grape";
  className?: string;
}) {
  const tones: Record<string, string> = {
    soft: "bg-white text-ink",
    mint: "bg-mint-soft text-[#1c5f49]",
    sky: "bg-sky-soft text-[#1d5878]",
    peach: "bg-peach-soft text-[#8a4419]",
    lavender: "bg-lavender-soft text-[#4b3a86]",
    sun: "bg-sun-soft text-[#7a5a00]",
    coral: "bg-coral-soft text-[#8c2f2f]",
    grape: "bg-grape-soft text-[#4b3a86]",
  };
  return <span className={cn("clay-chip", tones[tone], className)}>{children}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  accent = "grape",
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: "grape" | "mint" | "sky" | "peach" | "lavender";
  icon?: ReactNode;
}) {
  const accents: Record<string, string> = {
    grape: "bg-grape-soft text-[#4b3a86]",
    mint: "bg-mint-soft text-[#1c5f49]",
    sky: "bg-sky-soft text-[#1d5878]",
    peach: "bg-peach-soft text-[#8a4419]",
    lavender: "bg-lavender-soft text-[#4b3a86]",
  };
  return (
    <header className="mb-6 sm:mb-8">
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider",
          accents[accent],
        )}
      >
        {icon}
        {eyebrow}
      </span>
      <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-muted sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

export function Disclaimer({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "emergency";
  children?: ReactNode;
}) {
  const emergency = tone === "emergency";
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-2xl px-4 py-3 text-xs font-bold leading-relaxed sm:text-sm",
        emergency
          ? "bg-coral-soft text-[#8c2f2f]"
          : "bg-sky-soft text-[#1d5878]",
      )}
    >
      {emergency ? (
        <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      ) : (
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      )}
      <p>
        {children ??
          "Educational use only. MedVerse does not diagnose, prescribe, or replace a doctor or pharmacist."}
      </p>
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  icon,
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-line/80 bg-white/50 px-6 py-12 text-center">
      {icon ? <div className="text-muted">{icon}</div> : null}
      <p className="text-base font-extrabold">{title}</p>
      {hint ? <p className="max-w-sm text-sm font-semibold text-muted">{hint}</p> : null}
    </div>
  );
}
