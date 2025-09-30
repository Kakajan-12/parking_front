"use client";

import * as React from "react";
import { ReactNode, useEffect } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { HelperText } from "@/components/ui/helper-text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
    label?: string;
    value: Date | string | undefined;
    onChange?: (value: Date | undefined) => void;
    wrapperClass?: string;
    error?: ReactNode;
    helperText?: ReactNode;
    required?: boolean;
    fullWidth?: boolean;
}

export function DatetimePicker({
    value,
    onChange,
    label,
    wrapperClass,
    fullWidth = true,
    error,
    helperText,
    required,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const [time, setTime] = React.useState("");

    const parsedDate = React.useMemo(() => {
        if (!value) return undefined;
        if (value instanceof Date) return value;
        const d = new Date(value);
        return isNaN(d.getTime()) ? undefined : d;
    }, [value]);

    useEffect(() => {
        if (parsedDate) {
            setTime(parsedDate.toTimeString().slice(0, 8));
        }
    }, [parsedDate]);


    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setTime(newTime);
        if (onChange && parsedDate) {
            const [h, m, s] = newTime.split(":").map(Number);
            const newDate = new Date(parsedDate);
            newDate.setHours(h);
            newDate.setMinutes(m);
            newDate.setSeconds(s || 0);
            onChange(newDate);
        }
    };

    return (
        <div
            className={cn(
                "combobox-wrapper",
                label && "space-y-2",
                wrapperClass,
                fullWidth && "w-full",
            )}
        >
            <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                    <Label htmlFor="date-picker" className="px-1">
                        {label ? (
                            <span>
                                {label} {required && "*"}
                            </span>
                        ) : (
                            <span>Date {required && "*"}</span>
                        )}
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date-picker"
                                className="w-32 justify-between font-normal"
                            >
                                {parsedDate ? parsedDate.toLocaleDateString() : "Select date"}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={parsedDate}
                                captionLayout="dropdown"
                                onSelect={date => {
                                    if (onChange) {
                                        onChange(date);
                                    }
                                    setOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="time-picker" className="px-1">
                        Time
                    </Label>
                    <Input
                        type="time"
                        id="time-picker"
                        step="1"
                        value={time}
                        onChange={handleTimeChange}
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                </div>
            </div>
            {helperText && !error && <HelperText>{helperText}</HelperText>}
            {error && <HelperText error>{error}</HelperText>}
        </div>
    );
}
