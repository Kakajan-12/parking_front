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
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import Image from "@/components/Image";
import Link from "@/components/Link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { formatDatetime, getPrice } from "@/lib/helper";
import { CarSessionResponse } from "@/openapi/client";

interface Props {
    rows: Array<CarSessionResponse>;
    page: number;
    limit: number;
}

function Content({ rows, page, limit }: Props) {
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

    const columns: ColumnDef<CarSessionResponse>[] = [
        {
            accessorKey: "imageUrl",
            header: "Image",
            cell: ({ row }) => {
                const imageUrl = row.original.imageUrl;
                if (!imageUrl) return "-";
                return (
                    <Image
                        src={imageUrl}
                        alt="Car session"
                        width={150}
                        height={150}
                        className="w-full aspect-square object-contain"
                    />
                );
            },
        },
        {
            accessorKey: "id",
            header: "Id",
        },
        {
            accessorKey: "car",
            header: t("car"),

            cell: ({ row }) => {
                const car = row.original.car;
                if (!car) return "-";
                return (
                    <Link
                        className="text-blue-400 font-semibold"
                        href={`/cars/${row.original.carId}/detail`}
                    >
                        {car.carNumber}
                    </Link>
                );
            },
        },
        {
            accessorKey: "totalAmount",
            header: t("total-amount"),
            cell: ({ row }) => {
                const totalAmount = row.original.totalAmount;
                if (!totalAmount) return "-";
                return getPrice({ amount: totalAmount, currency: row.original.currency });
            },
        },
        {
            accessorKey: "isPaid",
            header: t("is-paid"),
            cell: ({ row }) => {
                const isPaid = row.original.isPaid;
                return (
                    <Badge variant={isPaid ? "secondary" : "destructive"}>
                        {isPaid ? t("yes") : t("no")}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "status",
            header: t("status"),
        },
        {
            accessorKey: "duration",
            header: t("duration"),
        },
        {
            accessorKey: "startTime",
            header: t("start-time"),
            cell: ({ row }) => {
                return formatDatetime({ date: row.original.startTime, locale: locale });
            },
        },
        {
            accessorKey: "endTime",
            header: t("end-time"),
            cell: ({ row }) => {
                return formatDatetime({ date: row.original.endTime, locale: locale });
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
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const objData = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild={true}>
                                <Link href={`/cars/sessions/${objData.id}/detail`}>
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
    });
    return (
        <div className="w-full">
            <div className="w-full flex items-center py-4">
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
