import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-black transition-[background,border-color,box-shadow,color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-primary/10 bg-primary text-primary-foreground shadow-[0_16px_32px_rgba(23,107,88,0.22)] hover:-translate-y-0.5 hover:bg-[#12201c]",
        secondary: "border border-secondary/60 bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-white",
        outline: "border border-[#d8e5de] bg-white text-[#12201c] shadow-sm hover:-translate-y-0.5 hover:border-primary/30 hover:bg-[#eef8f1]",
        ghost: "text-[#12201c] hover:bg-[#eef8f1]",
        destructive: "border border-destructive/10 bg-destructive text-destructive-foreground shadow-[0_16px_32px_rgba(226,82,98,0.2)] hover:-translate-y-0.5 hover:bg-destructive/90",
        success: "border border-accent/10 bg-accent text-accent-foreground shadow-[0_16px_32px_rgba(224,161,64,0.18)] hover:-translate-y-0.5 hover:bg-[#c88626]"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };
