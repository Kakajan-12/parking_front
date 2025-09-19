import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    cn(
        "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs",
        "font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
    ),
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
                destructive:
                    "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
                success:
                    "border-transparent bg-green-500 text-foreground [a&]:hover:bg-green-600 focus-visible:ring-green-300 dark:bg-green-600 dark:text-green-100",
                warning:
                    "border-transparent bg-yellow-500 text-foreground [a&]:hover:bg-yellow-600 focus-visible:ring-yellow-300 dark:bg-yellow-600 dark:text-yellow-100",
                info: "border-transparent bg-blue-500 text-foreground [a&]:hover:bg-blue-600 focus-visible:ring-blue-300 dark:bg-blue-600 dark:text-blue-100",
                accent: "border-transparent bg-accent text-accent-foreground [a&]:hover:bg-accent/90 focus-visible:ring-accent/50",
                ghost: "border-transparent bg-transparent text-foreground [a&]:hover:bg-accent/10 focus-visible:ring-ring/50",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
    asChild?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "span";
        return (
            <Comp
                ref={ref}
                data-slot="badge"
                className={cn(badgeVariants({ variant }), className)}
                {...props}
            />
        );
    },
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
