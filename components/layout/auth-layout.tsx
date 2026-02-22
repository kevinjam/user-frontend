import { cn } from "@/lib/utils";

export function AuthLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-surface bg-pattern px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10",
        className
      )}
    >
      <div className="w-full max-w-md sm:max-w-lg drop-shadow-lg">{children}</div>
    </div>
  );
}
