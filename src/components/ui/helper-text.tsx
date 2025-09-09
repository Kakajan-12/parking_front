import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function HelperText({
    children,
    className = "",
    error,
}: {
    children: ReactNode;
    className?: string;
    error?: boolean | null;
}) {
    return (
        <div
            className={cn(
                "text-xs font-bold m-0 mt-2 p-0",
                error ? "text-destructive" : "text-secondary-foreground",
                className,
            )}
        >
            {children}
        </div>
    );
}
