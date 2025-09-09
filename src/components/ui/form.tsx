import { FormEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FormProps {
    children?: ReactNode;
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
    noValidate?: boolean;
    className?: string;
    loading?: boolean;
    overlayFullScreen?: boolean; // New prop
}

const Form = ({
    children,
    loading = false,
    overlayFullScreen = true, // default to full-screen
    ...props
}: FormProps) => {
    return (
        <div
            className={cn("w-full flex justify-center items-center", {
                relative: !overlayFullScreen,
            })}
        >
            <form
                className={cn(props.className)}
                onSubmit={props.onSubmit}
                noValidate={props.noValidate}
                role="form"
                aria-busy={loading}
            >
                {children}
            </form>

            {loading && (
                <div
                    className={cn(
                        "absolute inset-0 z-9998 flex items-center justify-center",
                        "bg-white/70 dark:bg-black/60 backdrop-blur-sm",
                        {
                            "h-screen w-screen": overlayFullScreen,
                        },
                    )}
                >
                    <div className="animate-spin rounded-full border-4 border-gray-300 border-t-transparent h-12 w-12" />
                </div>
            )}
        </div>
    );
};

export { Form };
