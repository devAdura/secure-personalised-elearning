import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn("flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:opacity-50", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";
