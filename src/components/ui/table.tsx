"use client";

import * as React from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
    return (
        <div data-slot="table-container" className="relative w-full overflow-x-auto px-4">
            <table
                data-slot="table"
                className={cn("w-full caption-bottom text-sm px-6", className)}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
    return (
        <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />
    );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
    return (
        <tbody
            data-slot="table-body"
            className={cn("[&_tr:last-child]:border-0", className)}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
                className,
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className,
            )}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
    return (
        <caption
            data-slot="table-caption"
            className={cn("text-muted-foreground mt-4 text-sm", className)}
            {...props}
        />
    );
}

interface TableRowsPerPageProps {
    className?: string;
    pageSize: number;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TableRowsPerPage = ({ className, pageSize, onChange }: TableRowsPerPageProps) => {
    const pageSizes = [5, 10, 25, 50, 100];
    if (!pageSizes.includes(pageSize)) {
        pageSizes.unshift(pageSize);
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <p className="text-sm font-medium">Rows per page</p>
            <select
                value={pageSize}
                onChange={onChange}
                className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
            >
                {pageSizes.map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                        {pageSize}
                    </option>
                ))}
            </select>
        </div>
    );
};

interface TableActionsProps {
    totalCount?: number;
    pageSize: number;
    onPageSizeChange?: (value: number) => void;
    previousPage?: () => void;
    canPreviousPage?: boolean;
    nextPage?: () => void;
    canNextPage?: boolean;
    selectedCount?: number;
    rowsCount?: number;
    totalPage?: number;
    pageIndex: number;
}

const TableActions = ({
    totalCount,
    pageSize,
    onPageSizeChange,
    previousPage,
    canPreviousPage,
    nextPage,
    canNextPage,
    selectedCount,
    rowsCount,
    totalPage,
    pageIndex,
}: TableActionsProps) => {
    const t = useTranslations();
    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <TableRowsPerPage
                pageSize={pageSize}
                onChange={e => {
                    e.preventDefault();
                    if (onPageSizeChange) {
                        onPageSizeChange(Number(e.target.value));
                    }
                }}
            />
            <div className="text-muted-foreground flex-1 text-sm">
                {selectedCount} of {rowsCount} row(s) selected.
            </div>
            <div className="flex-1 text-sm text-muted-foreground">
                Total: <span className="font-medium">{totalCount}</span> {t("rows")}
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {pageIndex} of {totalPage}
            </div>
            <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={previousPage}
                    disabled={!canPreviousPage}
                >
                    {t("action-buttons.previous")}
                </Button>
                <Button variant="outline" size="sm" onClick={nextPage} disabled={!canNextPage}>
                    {t("action-buttons.next")}
                </Button>
            </div>
        </div>
    );
};

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    TableRowsPerPage,
    TableActions,
};
