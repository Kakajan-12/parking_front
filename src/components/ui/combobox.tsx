"use client";

import * as React from "react";
import { ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { Command as CommandPrimitive } from "cmdk";
import { FaSpinner } from "react-icons/fa6";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { HelperText } from "@/components/ui/helper-text";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const comboboxVariants = cva(
    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    {
        variants: {
            variant: {
                default: "border-input",
                outline: "border-input",
                ghost: "border-transparent hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                default: "h-10 px-3 py-2",
                sm: "h-9 px-3 py-2 text-xs",
                lg: "h-11 px-4 py-2",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ComboboxOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface ComboboxProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange">,
        VariantProps<typeof comboboxVariants> {
    options: ComboboxOption[];
    value?: ComboboxOption | null;
    onValueChange?: (value: ComboboxOption | null) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    searchValue: string;
    setSearchValue: (value: string) => void;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
    popoverClassName?: string;
    commandClassName?: string;
    shouldFilter?: boolean;
    loading?: boolean;
    id?: string;
    fullWidth?: boolean;
    label?: ReactNode;
    wrapperClass?: string;
    error?: ReactNode;
    helperText?: ReactNode;
    required?: boolean;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
    (
        {
            options,
            value,
            onValueChange,
            placeholder = "Select option...",
            searchPlaceholder = "Search...",
            emptyMessage = "No option found.",
            disabled = false,
            variant,
            size,
            className,
            popoverClassName,
            commandClassName,
            shouldFilter = false,
            searchValue,
            setSearchValue,
            loading,

            wrapperClass,
            fullWidth = true,
            label,
            error,
            helperText,
            required,

            id,
            ...props
        },
        ref,
    ) => {
        const [open, setOpen] = React.useState(false);

        const selectedOption = React.useMemo(
            () =>
                options.find(option => {
                    if (value === null || typeof value === "undefined") {
                        return false;
                    }
                    return option.value === value.value;
                }),
            [options, value],
        );

        const filteredOptions = React.useMemo(() => {
            if (!searchValue) return options;
            return options.filter(option =>
                option.label.toLowerCase().includes(searchValue.toLowerCase()),
            );
        }, [options, searchValue]);

        const handleSelect = React.useCallback(
            (selectedValue: ComboboxOption) => {
                if (selectedValue === value) {
                    onValueChange?.(null);
                } else {
                    onValueChange?.(selectedValue);
                }
                setOpen(false);
                setSearchValue("");
            },
            [value, onValueChange, setSearchValue],
        );

        const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
                setSearchValue("");
            }
        }, []);

        return (
            <div
                className={cn(
                    "combobox-wrapper",
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
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id={id}
                            ref={ref}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            aria-haspopup="listbox"
                            disabled={disabled}
                            className={cn(comboboxVariants({ variant, size }), className)}
                            {...props}
                        >
                            <span className="truncate">
                                {selectedOption ? selectedOption.label : placeholder}
                            </span>
                            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className={cn("w-(--radix-popover-trigger-width) p-0", popoverClassName)}
                        align="start"
                    >
                        <CommandPrimitive
                            shouldFilter={shouldFilter}
                            className={cn(
                                "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
                                commandClassName,
                            )}
                            onKeyDown={handleKeyDown}
                        >
                            <div className="flex items-center border-b px-3">
                                <CommandPrimitive.Input
                                    placeholder={searchPlaceholder}
                                    value={searchValue}
                                    onValueChange={setSearchValue}
                                    className={cn(
                                        "flex h-11 w-full rounded-md bg-transparent",
                                        "py-3 text-sm outline-none placeholder:text-muted-foreground",
                                        "disabled:cursor-not-allowed disabled:opacity-50",
                                    )}
                                />
                            </div>
                            <CommandPrimitive.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                                {loading && (
                                    <div className="py-8 flex justify-center items-center">
                                        <FaSpinner className="animate-spin size-5" />
                                    </div>
                                )}
                                {!loading && (
                                    <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground">
                                        {emptyMessage}
                                    </CommandPrimitive.Empty>
                                )}
                                {!loading && (
                                    <CommandPrimitive.Group>
                                        {filteredOptions.map(option => (
                                            <CommandPrimitive.Item
                                                key={option.value}
                                                value={option.value}
                                                disabled={false}
                                                onSelect={() => {
                                                    handleSelect(option);
                                                }}
                                                className={cn(
                                                    "relative flex cursor-default select-none",
                                                    "items-center rounded-sm px-2 py-1.5 text-sm",
                                                    "outline-none aria-selected:bg-accent",
                                                    "aria-selected:text-accent-foreground",
                                                )}
                                            >
                                                <LuCheck
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value && value.value === option.value
                                                            ? "opacity-100"
                                                            : "opacity-0",
                                                    )}
                                                />
                                                <span className="truncate">{option.label}</span>
                                            </CommandPrimitive.Item>
                                        ))}
                                    </CommandPrimitive.Group>
                                )}
                            </CommandPrimitive.List>
                        </CommandPrimitive>
                    </PopoverContent>
                </Popover>

                {helperText && !error && <HelperText>{helperText}</HelperText>}
                {error && <HelperText error>{error}</HelperText>}
            </div>
        );
    },
);

Combobox.displayName = "Combobox";

export { Combobox, comboboxVariants };
