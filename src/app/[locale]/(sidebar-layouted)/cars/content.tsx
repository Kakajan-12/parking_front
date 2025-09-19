"use client";

import React from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    PaginationState,
    Updater,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal, PlusIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import Link from "@/components/Link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DebouncedInput } from "@/components/ui/debounced-input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableActions,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDatetime } from "@/lib/helper";
import { CarResponse } from "@/openapi/client";

interface Props {
    rows: Array<CarResponse>;
    page: number;
    limit: number;
    search?: string;
    totalCount: number;
}

function Content({ rows, page, limit, totalCount, search }: Props) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations();

    const handlePageChange = (updaterOrValue: Updater<PaginationState>) => {
        const newState =
            typeof updaterOrValue === "function"
                ? updaterOrValue({ pageIndex: page - 1, pageSize: limit }) // current state
                : updaterOrValue;

        const params = new URLSearchParams(searchParams);
        params.set("page", (newState.pageIndex + 1).toString()); // URL 1-based
        params.set("limit", newState.pageSize.toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: true });
    };

    const handleSearch = (search?: string) => {
        console.log(search);
        const params = new URLSearchParams(searchParams);

        // Reset to first page when searching
        params.set("page", "1");

        // Keep the current page size
        params.set("limit", table.getState().pagination.pageSize.toString());

        // Add search param if provided
        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: true });
    };

    const columns: ColumnDef<CarResponse>[] = [
        {
            accessorKey: "id",
            header: "Id",
        },
        {
            accessorKey: "carNumber",
            header: t("cars-page.car-number"),
        },
        {
            accessorKey: "ownerName",
            header: t("cars-page.owner-name"),
        },
        {
            accessorKey: "isStaff",
            header: t("cars-page.is-staff"),
            cell: ({ row }) => {
                const isStaff = row.original.isStaff;
                return (
                    <Badge variant={isStaff ? "secondary" : "destructive"}>
                        {isStaff ? t("cars-page.staff") : t("cars-page.non-staff")}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: t("created-at"),
            cell: ({ row }) => {
                const createdAt = row.original.createdAt;
                return formatDatetime({ date: createdAt, locale: locale });
            },
        },
        {
            accessorKey: "updatedAt",
            header: t("updated-at"),
            cell: ({ row }) => {
                const updatedAt = row.original.updatedAt;
                if (!updatedAt) return "-";
                return formatDatetime({ date: updatedAt, locale: locale });
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const objData = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild={true}>
                                <Link href={`/cars/${objData.id}/detail`}>
                                    {t("action-buttons.view-details")}
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        onPaginationChange: handlePageChange, //update the pagination state when internal APIs mutate the pagination state
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: limit,
            },
        },
        rowCount: totalCount,
    });
    return (
        <div className="w-full">
            <div className="w-full flex items-center py-4">
                <DebouncedInput
                    placeholder="Filter ..."
                    value={search ?? ""}
                    onChange={value => {
                        handleSearch(value);
                    }}
                    fullWidth={true}
                    className="max-w-md w-full"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-2 sm:ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(column => column.getCanHide())
                            .map(column => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={value => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button className="ml-2 sm:ml-4" size="icon" variant="default" asChild={true}>
                    <Link href="/cars/create">
                        <PlusIcon className="size-6" />
                    </Link>
                </Button>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <TableActions
                totalCount={totalCount}
                pageSize={limit}
                onPageSizeChange={value => {
                    table.setPageSize(value);
                }}
                previousPage={() => table.previousPage()}
                canPreviousPage={table.getCanPreviousPage()}
                nextPage={() => table.nextPage()}
                canNextPage={table.getCanNextPage()}
                selectedCount={table.getFilteredSelectedRowModel().rows.length}
                rowsCount={table.getFilteredRowModel().rows.length}
                totalPage={table.getPageCount()}
                pageIndex={page}
            />
        </div>
    );
}

export default Content;
