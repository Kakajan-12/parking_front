import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SizeOption =
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
type SpacingOption =
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16"
    | "20"
    | "24"
    | "28"
    | "32"
    | "36"
    | "40"
    | "44"
    | "48"
    | "52"
    | "56"
    | "60"
    | "64"
    | "72"
    | "80"
    | "96";
type ColorOption =
    | "transparent"
    | "white"
    | "black"
    | "slate"
    | "gray"
    | "zinc"
    | "neutral"
    | "stone"
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "rose";
type ColorIntensity =
    | "50"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | "950";

type ResponsiveProp<T> = {
    base?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    "2xl"?: T;
};

type ContainerProps = {
    children?: ReactNode;
    className?: string;

    /**
     * Sets the max-width of the container responsively
     * @default { base: 'full', md: 'xl', xl: '7xl' }
     */
    size?: ResponsiveProp<SizeOption> | SizeOption;

    /**
     * Sets the padding on x-axis (left and right) responsively
     * @default { base: '4', md: '6' }
     */
    paddingX?: ResponsiveProp<SpacingOption> | SpacingOption;

    /**
     * Sets the padding on y-axis (top and bottom) responsively
     * @default { base: '4', md: '6' }
     */
    paddingY?: ResponsiveProp<SpacingOption> | SpacingOption;

    /**
     * Sets the margin on x-axis (left and right) responsively
     * @default '0'
     */
    marginX?: ResponsiveProp<SpacingOption> | SpacingOption;

    /**
     * Sets the margin on y-axis (top and bottom) responsively
     * @default '0'
     */
    marginY?: ResponsiveProp<SpacingOption> | SpacingOption;

    /**
     * Centers the container horizontally responsively
     * @default { base: true, sm: false } // example
     */
    center?: ResponsiveProp<boolean> | boolean;

    /**
     * Adds a border around the container responsively
     * @default false
     */
    border?: ResponsiveProp<boolean> | boolean;

    /**
     * Border color with intensity
     * @default { color: 'gray', intensity: '200' }
     */
    borderColor?: {
        color?: ColorOption;
        intensity?: ColorIntensity;
    };

    /**
     * Border width
     * @default '1'
     */
    borderWidth?: "0" | "1" | "2" | "4" | "8";

    /**
     * Sets the border radius responsively
     * @default 'none'
     */
    rounded?:
        | ResponsiveProp<"none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full">
        | "none"
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "2xl"
        | "3xl"
        | "full";

    /**
     * Sets the background color with intensity
     * @default { color: 'transparent', intensity: '100' }
     */
    bg?: {
        color?: ColorOption;
        intensity?: ColorIntensity;
    };

    /**
     * Sets the background opacity (0-100) responsively
     * @default '100'
     */
    bgOpacity?:
        | ResponsiveProp<"0" | "10" | "20" | "30" | "40" | "50" | "60" | "70" | "80" | "90" | "100">
        | "0"
        | "10"
        | "20"
        | "30"
        | "40"
        | "50"
        | "60"
        | "70"
        | "80"
        | "90"
        | "100";

    /**
     * HTML element to render as
     * @default 'div'
     */
    as?: "div" | "section" | "article" | "main" | "header" | "footer" | "aside" | "nav";

    /**
     * Shadow size
     * @default 'none'
     */
    shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner" | "outline";

    /**
     * Overflow behavior
     * @default 'visible'
     */
    overflow?: "auto" | "hidden" | "clip" | "visible" | "scroll";

    /**
     * Position type
     * @default 'static'
     */
    position?: "static" | "fixed" | "absolute" | "relative" | "sticky";

    /**
     * Custom styles for the container
     */
    style?: React.CSSProperties;
};

const Container = ({
    children,
    className,
    size = { base: "7xl", md: "xl", xl: "7xl" },
    paddingX = { base: "4", md: "6" },
    paddingY = { base: "4", md: "6" },
    marginX = "0",
    marginY = "0",
    center = true,
    border = false,
    borderColor = { color: "gray", intensity: "200" },
    borderWidth = "1",
    rounded = "none",
    bg = { color: "transparent", intensity: "100" },
    bgOpacity = "100",
    as: Component = "div",
    shadow = "none",
    overflow = "visible",
    position = "static",
    style,
}: ContainerProps) => {
    // Helper function to generate responsive classes
    const getResponsiveClasses = <T,>(
        value: ResponsiveProp<T> | T,
        classMap: Record<string, string>,
        prefix = "",
    ): string => {
        if (typeof value === "object" && value !== null) {
            return Object.entries(value)
                .map(([breakpoint, val]) => {
                    const className = classMap[val as string];
                    return breakpoint === "base"
                        ? `${prefix}${className}`
                        : `${breakpoint}:${prefix}${className}`;
                })
                .join(" ");
        }
        return `${prefix}${classMap[value as string]}`;
    };

    // Helper function for boolean responsive props
    const getResponsiveBooleanClasses = (
        value: ResponsiveProp<boolean> | boolean,
        className: string,
    ): string => {
        if (typeof value === "object" && value !== null) {
            return Object.entries(value)
                .map(([breakpoint, val]) => {
                    return breakpoint === "base"
                        ? val
                            ? className
                            : ""
                        : val
                          ? `${breakpoint}:${className}`
                          : "";
                })
                .join(" ");
        }
        return value ? className : "";
    };

    // Size classes
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "max-w-full",
    };

    // Spacing classes
    const spacingClasses = {
        "0": "0",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "11": "11",
        "12": "12",
        "14": "14",
        "16": "16",
        "20": "20",
        "24": "24",
        "28": "28",
        "32": "32",
        "36": "36",
        "40": "40",
        "44": "44",
        "48": "48",
        "52": "52",
        "56": "56",
        "60": "60",
        "64": "64",
        "72": "72",
        "80": "80",
        "96": "96",
    };

    // Rounded classes
    const roundedClasses = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
        full: "rounded-full",
    };

    // Shadow classes
    const shadowClasses = {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        "2xl": "shadow-2xl",
        inner: "shadow-inner",
        outline: "shadow-outline",
    };

    // Overflow classes
    const overflowClasses = {
        auto: "overflow-auto",
        hidden: "overflow-hidden",
        clip: "overflow-clip",
        visible: "overflow-visible",
        scroll: "overflow-scroll",
    };

    // Position classes
    const positionClasses = {
        static: "static",
        fixed: "fixed",
        absolute: "absolute",
        relative: "relative",
        sticky: "sticky",
    };

    // Generate background class
    const bgClass =
        bg.color === "transparent"
            ? "bg-transparent"
            : bg.color === "white"
              ? "bg-white"
              : bg.color === "black"
                ? "bg-black"
                : `bg-${bg.color}-${bg.intensity}`;

    // Generate border color class
    const borderColorClass = border
        ? borderColor.color === "white"
            ? "border-white"
            : borderColor.color === "black"
              ? "border-black"
              : `border-${borderColor.color}-${borderColor.intensity}`
        : "";

    return (
        <Component
            className={cn(
                "w-full",
                getResponsiveClasses(size, sizeClasses),
                getResponsiveClasses(paddingX, spacingClasses, "px-"),
                getResponsiveClasses(paddingY, spacingClasses, "py-"),
                getResponsiveClasses(marginX, spacingClasses, "mx-"),
                getResponsiveClasses(marginY, spacingClasses, "my-"),
                getResponsiveBooleanClasses(center, "mx-auto"),
                getResponsiveBooleanClasses(border, "border"),
                border && borderColorClass,
                border && `border-${borderWidth}`,
                getResponsiveClasses(rounded, roundedClasses),
                bgClass,
                getResponsiveClasses(bgOpacity, {
                    "0": "bg-opacity-0",
                    "10": "bg-opacity-10",
                    "20": "bg-opacity-20",
                    "30": "bg-opacity-30",
                    "40": "bg-opacity-40",
                    "50": "bg-opacity-50",
                    "60": "bg-opacity-60",
                    "70": "bg-opacity-70",
                    "80": "bg-opacity-80",
                    "90": "bg-opacity-90",
                    "100": "bg-opacity-100",
                }),
                shadowClasses[shadow],
                overflowClasses[overflow],
                positionClasses[position],
                className,
            )}
            style={style}
        >
            {children}
        </Component>
    );
};

export { Container };
