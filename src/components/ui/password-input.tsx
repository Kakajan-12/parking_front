"use client";

import React, { ChangeEvent, ReactNode, useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HelperText } from "@/components/ui/helper-text";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const errorClasses =
    "border text-red-500 placeholder-gray-400 focus:border-indigo-400 border-red-500";

export interface PasswordProps {
    className?: string;
    inputClassName?: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    ariaLabel?: string;
    placeholder?: string;
    error?: ReactNode;
    helperText?: ReactNode;
    required?: boolean;
    autoComplete?: string;
    wrapperClass?: string;
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    label?: string;
    withoutStyling?: boolean;
}

const PasswordInput = ({
    id,
    name,
    className = "",
    inputClassName = "",
    value,
    onChange,
    ariaLabel,
    placeholder,
    error,
    required,
    autoComplete,
    helperText,
    wrapperClass = "",
    fullWidth = true,
    loading,
    disabled,
    label,
    withoutStyling = false,
}: PasswordProps) => {
    const [showPass, setShowPass] = useState(false);

    const defaultStyle = withoutStyling
        ? ""
        : cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary",
              "selection:text-primary-foreground dark:bg-input/30 border-input flex",
              "h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base",
              "shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              // "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              // "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              error && errorClasses,
              loading && "opacity-70 cursor-wait",
              className,
          );

    return (
        <div
            className={cn(
                "input-wrapper",
                label && "space-y-2",
                wrapperClass,
                fullWidth && "w-full",
            )}
        >
            {label && <Label htmlFor={id}>{label} {required && "*"}</Label>}
            <div className="relative flex items-center">
                <input
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    aria-label={ariaLabel}
                    placeholder={placeholder}
                    type={showPass ? "text" : "password"}
                    required={required}
                    disabled={loading || disabled} // disable input while loading
                    autoComplete={autoComplete}
                    className={cn(defaultStyle, inputClassName)}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <Button
                        asChild={true}
                        size="icon"
                        variant="ghost"
                        className="select-none size-6"
                        onClick={() => setShowPass(!showPass)}
                        aria-label={showPass ? "Hide password" : "Show password"}
                        tabIndex={-1} // This makes it non-focusable
                        onMouseDown={e => e.preventDefault()} // Prevents focus on click
                        style={{ userSelect: "none" }} // Additional non-selectable guarantee
                    >
                        <div>
                            {showPass ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                        </div>
                    </Button>
                </div>
            </div>
            {helperText && <HelperText>{helperText}</HelperText>}
            {error && <HelperText error={true}>{error}</HelperText>}
        </div>
    );
};

export { PasswordInput };
