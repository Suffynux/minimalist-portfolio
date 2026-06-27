import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-bone disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        ink: "bg-ink text-bone hover:bg-olive",
        olive: "bg-olive text-surface hover:-translate-y-0.5",
        outline: "border border-ink/20 bg-transparent text-ink hover:border-olive hover:text-olive",
        whatsapp: "bg-[#25D366] text-[#0B2E17] hover:-translate-y-0.5"
      },
      size: {
        sm: "h-10 px-5 text-[13.5px]",
        md: "h-[54px] px-[26px] text-[14.5px]",
        lg: "h-14 px-[30px] text-[15px]"
      }
    },
    defaultVariants: {
      variant: "ink",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
