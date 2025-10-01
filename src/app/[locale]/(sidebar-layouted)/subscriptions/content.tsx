"use client";

import React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    PaginationState,
    Updater,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal, PlusIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LuRefreshCcw } from "react-icons/lu";

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
import { formatDatetime, getPrice, toast } from "@/lib/helper";
import { CarSubscriptionVisible } from "@/openapi/client";

interface Props {
    rows: Array<CarSubscriptionVisible>;
    page: number;
    limit: number;
}

const OperatorSessionsTable = ({ rows, page, limit }: Props) => {
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

    const handleRefresh = () => {
        router.refresh();
        toast(t("page-refreshed"));
    };

    const columns: ColumnDef<CarSubscriptionVisible>[] = [
        {
            accessorKey: "id",
            header: "Id",
        },
        {
            accessorKey: "carId",
            header: t("car-number"),

            cell: ({ row }) => {
                const car = row.original.car;
                if (!car) return "-";
                return (
                    <Link className="text-blue-400 font-semibold" href={`/cars/${car.id}/detail`}>
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
                        {isPaid ? t("action-buttons.yes") : t("action-buttons.no")}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "isActive",
            header: t("is-active"),
            cell: ({ row }) => {
                const isActive = row.original.isActive;
                return (
                    <Badge variant={isActive ? "secondary" : "destructive"}>
                        {isActive ? t("action-buttons.yes") : t("action-buttons.no")}
                    </Badge>
                );
            },
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
            accessorKey: "note",
            header: t("note"),
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
                                <Link href={`/subscriptions/${objData.id}/detail`}>
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

    const renderRows = () => {
        const rows = table.getRowModel().rows;
        if (Array.isArray(rows) && rows.length > 0) {
            return rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        return (
            <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
            </TableRow>
        );
    };
    return (
        <div className="w-full">
            <div className="font-bold text-xl">{t("nav.subscriptions")}</div>
            <div className="w-full flex items-center py-4">
                <div className="flex flex-row ml-auto space-x-2">
                    <Button variant="ghost" size="icon" onClick={handleRefresh}>
                        <LuRefreshCcw className="size-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
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
                                            onCheckedChange={value =>
                                                column.toggleVisibility(Boolean(value))
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="ml-2 sm:ml-4" size="icon" variant="default" asChild={true}>
                        <Link href="/subscriptions/create">
                            <PlusIcon className="size-6" />
                        </Link>
                    </Button>
                </div>
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
                    <TableBody>{renderRows()}</TableBody>
                </Table>
            </div>
            <TableActions
                pageSize={limit}
                onPageSizeChange={value => {
                    table.setPageSize(value);
                }}
                previousPage={() => table.previousPage()}
                canPreviousPage={true}
                nextPage={() => table.nextPage()}
                canNextPage={true}
                selectedCount={table.getFilteredSelectedRowModel().rows.length}
                rowsCount={table.getFilteredRowModel().rows.length}
                totalPage={table.getPageCount()}
                pageIndex={page}
            />
        </div>
    );
};

export default OperatorSessionsTable;
