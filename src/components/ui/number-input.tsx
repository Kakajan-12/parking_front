import React, { ChangeEvent, ReactNode } from "react";

import { NumericFormat as BaseNumericFormat } from "react-number-format";

import { HelperText } from "@/components/ui/helper-text";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const errorClasses =
    "border text-red-500 placeholder-gray-400 focus:border-indigo-400 border-red-500";

interface BaseInputProps {
    id?: string;
    name?: string;
    className?: string;
    error?: ReactNode;
    helperText?: ReactNode;
    ariaLabel?: string;
    fullWidth?: boolean;
    wrapperClass?: string;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    loading?: boolean;
    label?: ReactNode;
    withoutStyling?: boolean;
    inputClassName?: string;
    disabled?: boolean;
    required?: boolean;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const NumberInput = ({
    className = "",
    inputClassName = "",
    error,
    helperText,
    fullWidth = false,
    wrapperClass = "",
    loading,
    startAdornment,
    endAdornment,
    disabled = false,
    label,
    id,
    name,
    withoutStyling = false,
    required,
    value,
    onChange,
    ...rest
}: BaseInputProps) => {
    const hasStartAdornment = !!startAdornment;
    const hasEndAdornment = !!endAdornment;

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
            {label && (
                <Label htmlFor={id}>
                    {label} {required && "*"}
                </Label>
            )}
            <div className="relative flex items-center">
                {hasStartAdornment && (
                    <span className="absolute left-3 text-gray-500 pointer-events-none">
                        {startAdornment}
                    </span>
                )}
                <BaseNumericFormat
                    value={value}
                    disabled={loading || disabled}
                    className={cn(
                        defaultStyle,
                        hasStartAdornment && "pl-10",
                        hasEndAdornment && "pr-10",
                        inputClassName,
                    )}
                    aria-label={rest.ariaLabel}
                    name={name}
                    id={id}
                    required={required}
                    onChange={onChange}
                    {...rest}
                />
                {hasEndAdornment && (
                    <span className="absolute right-3 text-gray-500">{endAdornment}</span>
                )}
            </div>
            {helperText && !error && <HelperText>{helperText}</HelperText>}
            {error && <HelperText error>{error}</HelperText>}
        </div>
    );
};

export { NumberInput };
