import React from "react";

import { LuHouse, LuSlash } from "react-icons/lu";

import Link from "@/components/Link";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
    href: string;
    label: string;
    current?: boolean;
};

type PageHeadingProps = {
    className?: string;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
    rightContent?: React.ReactNode;
};

const PageHeading = ({
    className = "",
    title,
    breadcrumbs = [],
    rightContent,
}: PageHeadingProps) => {
    return (
        <div
            className={cn(
                "w-full flex flex-col gap-3 shadow-md p-4 border-b rounded-b-xl",
                className,
            )}
        >
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground">
                <Link href="/" className="flex items-center gap-1 hover:text-foreground transition">
                    <LuHouse className="w-4 h-4" />
                </Link>
                {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                        <span className="mx-2">
                            <LuSlash className="w-3 h-3" />
                        </span>
                        {item.current ? (
                            <span className="font-medium text-foreground">{item.label}</span>
                        ) : (
                            <Link href={item.href} className="hover:text-foreground transition">
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </nav>

            {/* Title + Right content */}
            {(title || rightContent) && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
                    {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
                    {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
                </div>
            )}
        </div>
    );
};

export default PageHeading;
