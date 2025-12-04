import { cva, type VariantProps } from "class-variance-authority";
import type { ClassValue } from "clsx";
import type * as React from "react";
import { cn } from "@/lib/utils";

const TASK_PRIORITY = ["low", "medium", "high"] as const;

const priorityStyles: Record<(typeof TASK_PRIORITY)[number], ClassValue> = {
  high: "bg-red-500/20 text-white hover:bg-red-500",
  medium: "bg-yellow-500/20 text-white hover:bg-yellow-500",
  low: "bg-gray-500/20 text-white hover:bg-gray-500",
};

const statusButtonVariants = cva(
  "bg-primary text-foreground hover:bg-primary/90 inline-flex w-fit shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      priority: priorityStyles,
      size: {
        default: "h-6 px-3.5",
        sm: "h-5 px-3",
      },
    },
    defaultVariants: {
      priority: "low",
      size: "default",
    },
  },
);

function StatusButton({
  className,
  priority,
  size,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof statusButtonVariants> & {
    asChild?: boolean;
  }) {
  return (
    <button
      data-slot="button"
      className={cn(statusButtonVariants({ priority, size, className }))}
      {...props}
    />
  );
}

export { StatusButton, statusButtonVariants, TASK_PRIORITY };
