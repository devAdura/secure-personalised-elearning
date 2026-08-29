import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, spellCheck = true, autoCorrect = "on", autoCapitalize = "sentences", ...props }, ref) => (
    <textarea
      ref={ref}
      spellCheck={spellCheck}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      className={cn(
        "min-h-28 w-full rounded-md border border-[#d8e5de] bg-white/90 px-3 py-2 text-sm text-[#12201c] shadow-sm transition-[background,border-color,box-shadow] duration-200 placeholder:text-muted-foreground hover:bg-white focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
