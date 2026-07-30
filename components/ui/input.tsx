import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-[#d8e5de] bg-white/90 px-3 py-2 text-sm text-[#12201c] shadow-sm transition-[background,border-color,box-shadow] duration-200 placeholder:text-muted-foreground hover:bg-white focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
