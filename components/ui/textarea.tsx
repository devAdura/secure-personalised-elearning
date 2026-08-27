import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  // Browser spell-checking is on by default so misspelled words are underlined
  // in red and the OS/browser can offer autocorrect suggestions. Pass
  // `spellCheck={false}` on a specific field to opt out.
  ({ className, spellCheck = true, autoCapitalize = "sentences", ...props }, ref) => (
    <textarea
      ref={ref}
      spellCheck={spellCheck}
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
