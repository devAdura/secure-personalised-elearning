"use client";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

export function SubmitButton({ loading, children, ...props }: ButtonProps & { loading?: boolean }) {
  return (
    <Button aria-busy={loading} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      <span>{children}</span>
    </Button>
  );
}
