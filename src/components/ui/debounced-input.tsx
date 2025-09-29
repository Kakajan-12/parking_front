"use client";

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";
import { cn } from "@/lib/utils";

interface DebouncedInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string;
    onChange: (value: string) => void; // your debounced callback
    debounce?: number; // default 300ms
    fullWidth?: boolean;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
    value,
    onChange,
    debounce = 300,
    className,
    fullWidth,
    ...props
}) => {
    const [internalValue, setInternalValue] = useState(value);

    // Create a debounced callback
    const debouncedOnChange = useDebounceCallback((val: string) => {
        onChange(val);
    }, debounce);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInternalValue(val); // update UI immediately
        debouncedOnChange(val); // call onChange after debounce
    };
    return (
        <Input
            fullWidth={fullWidth}
            {...props}
            value={internalValue}
            onChange={handleChange}
            className={cn(className)}
        />
    );
};

DebouncedInput.displayName = "DebouncedInput";
