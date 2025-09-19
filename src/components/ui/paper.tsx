import React from "react";

import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type PaddingSize = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
    elevation?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 9;
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
    asChild?: boolean;
    /** Padding props */
    p?: PaddingSize;
    px?: PaddingSize;
    py?: PaddingSize;
    pt?: PaddingSize;
    pb?: PaddingSize;
    pl?: PaddingSize;
    pr?: PaddingSize;
}

const paddingMap: Record<PaddingSize, string> = {
    none: "p-0",
    xs: "p-1",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
    "2xl": "p-10",
    "3xl": "p-12",
    "4xl": "p-16",
};

const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
    (
        {
            elevation = 0,
            rounded = "2xl",
            asChild = false,
            className,
            children,
            p = "md",
            px,
            py,
            pt,
            pb,
            pl,
            pr,
            ...props
        },
        ref,
    ) => {
        // Softer shadows (closer to MUI)
        const shadows = {
            0: "shadow-none",
            1: "shadow-2xs",
            2: "shadow-xs",
            3: "shadow-sm",
            4: "shadow-md",
            6: "shadow-lg",
            8: "shadow-xl",
            9: "shadow-2xl",
        };

        const roundness = {
            none: "rounded-none",
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            xl: "rounded-xl",
            "2xl": "rounded-2xl",
            "3xl": "rounded-3xl",
            full: "rounded-full",
        };

        const Comp = asChild ? Slot : "div";

        return (
            <Comp
                ref={ref}
                className={cn(
                    "bg-background",
                    shadows[elevation],
                    roundness[rounded],
                    p && paddingMap[p],
                    px && paddingMap[px].replace("p-", "px-"),
                    py && paddingMap[py].replace("p-", "py-"),
                    pt && paddingMap[pt].replace("p-", "pt-"),
                    pb && paddingMap[pb].replace("p-", "pb-"),
                    pl && paddingMap[pl].replace("p-", "pl-"),
                    pr && paddingMap[pr].replace("p-", "pr-"),
                    className,
                )}
                {...props}
            >
                {children}
            </Comp>
        );
    },
);

Paper.displayName = "Paper";
export { Paper };
