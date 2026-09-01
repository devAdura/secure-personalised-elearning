"use client";

import * as React from "react";
import { CheckCircle2, SpellCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpellingIssue = { word: string; suggestions: string[] };

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, spellCheck = true, autoCorrect = "on", autoCapitalize = "sentences", onChange, onBlur, "aria-describedby": describedBy, ...props }, ref) => {
    const [issues, setIssues] = React.useState<SpellingIssue[]>([]);
    const [status, setStatus] = React.useState<"idle" | "checking" | "clear">("idle");
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestRef = React.useRef(0);
    const helpId = React.useId();

    const checkText = React.useCallback(async (text: string) => {
      if (!spellCheck || text.trim().length < 3) {
        setIssues([]);
        setStatus("idle");
        return;
      }
      const requestId = ++requestRef.current;
      setStatus("checking");
      try {
        const response = await fetch("/api/spellcheck", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });
        const result = await response.json();
        if (requestId !== requestRef.current) return;
        if (!response.ok) throw new Error(result.error || "Spelling check failed");
        setIssues(result.issues || []);
        setStatus(result.issues?.length ? "idle" : "clear");
      } catch {
        if (requestId === requestRef.current) setStatus("idle");
      }
    }, [spellCheck]);

    React.useEffect(() => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      requestRef.current += 1;
    }, []);

    function scheduleCheck(text: string) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStatus(text.trim().length >= 3 ? "checking" : "idle");
      timeoutRef.current = setTimeout(() => void checkText(text), 650);
    }

    const showStatus = spellCheck && (issues.length > 0 || status !== "idle");

    return <div className="space-y-2"><textarea
      ref={ref}
      spellCheck={spellCheck}
      lang="en-GB"
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      aria-describedby={[describedBy, showStatus ? helpId : null].filter(Boolean).join(" ") || undefined}
      className={cn(
        "min-h-28 w-full rounded-md border border-[#d8e5de] bg-white/90 px-3 py-2 text-sm text-[#12201c] shadow-sm transition-[background,border-color,box-shadow] duration-200 placeholder:text-muted-foreground hover:bg-white focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onChange={(event) => { onChange?.(event); scheduleCheck(event.currentTarget.value); }}
      onBlur={(event) => { onBlur?.(event); if (timeoutRef.current) clearTimeout(timeoutRef.current); void checkText(event.currentTarget.value); }}
      {...props}
    />{showStatus?<div id={helpId} role="status" aria-live="polite" className={cn("flex items-start gap-2 text-xs leading-5", issues.length ? "text-amber-800" : "text-emerald-700")}>{issues.length?<><SpellCheck2 className="mt-0.5 h-4 w-4 shrink-0"/><p><span className="font-black">Review spelling:</span> {issues.map((issue)=><span key={issue.word} className="mr-2 inline-block"><span className="font-black">{issue.word}</span>{issue.suggestions[0]?` → ${issue.suggestions[0]}`:""}</span>)}</p></>:status === "checking"?<><SpellCheck2 className="mt-0.5 h-4 w-4 shrink-0"/><span>Checking spelling...</span></>:<><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0"/><span>Spelling checked</span></>}</div>:null}</div>;
  }
);
Textarea.displayName = "Textarea";
