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

import Link from "@/components/Link";
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
import { formatDatetime, toastLoading, toastUpdate } from "@/lib/helper";
import { UserSessionExtendedVisible } from "@/openapi/client";

import { userSessionRevokeAction } from "./actions";
import OperatorSessionsTable from "./operator-sessions-table";

interface Props {
    rows: Array<UserSessionExtendedVisible>;
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

    const handleRevoke = async (value: string) => {
        const toastId = toastLoading(t("please-wait"));
        try {
            const response = await userSessionRevokeAction(value);
            if (response.status == 200) {
                toastUpdate(
                    toastId,
                    response.message ?? t("users-page.user-session-revoked"),
                    "success",
                );
                router.prefetch("/user/sessions");
                router.refresh();
            } else {
                toastUpdate(
                    toastId,
                    response.message ?? t("errors.something-went-wrong"),
                    "warning",
                );
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error("Error corrupted:", e.message);
                console.error(e.stack);
            } else {
                console.error("Unknown error:", e);
            }
            toastUpdate(toastId, t("errors.something-went-wrong"), "warning");
        }
    };

    const columns: ColumnDef<UserSessionExtendedVisible>[] = [
        {
            accessorKey: "id",
            header: "Id",
        },
        {
            accessorKey: "user",
            header: "User",

            cell: ({ row }) => {
                const user = row.original.user;
                const text = user
                    ? `${user.username} - ${user.fullName}`
                    : t("action-buttons.view");
                return (
                    <Link
                        className="text-blue-400 font-semibold"
                        href={`/users/${row.original.userId}/detail`}
                    >
                        {text}
                    </Link>
                );
            },
        },
        {
            accessorKey: "ipAddress",
            header: "Ip address",
        },
        {
            accessorKey: "userAgent",
            header: "User agent",
        },
        {
            accessorKey: "revokedAt",
            header: t("revoked-at"),
            cell: ({ row }) => {
                const revokedAt = row.original.revokedAt;
                if (!revokedAt) return "-";
                return formatDatetime({ date: revokedAt, locale: locale });
            },
        },
        {
            accessorKey: "expireAt",
            header: t("expire-at"),
            cell: ({ row }) => {
                return formatDatetime({ date: row.original.expireAt, locale: locale });
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
                            <DropdownMenuItem
                                disabled={!!objData.revokedAt}
                                onClick={() => handleRevoke(objData.id)}
                            >
                                {t("users-page.revoke-session")}
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
        <div className="space-y-8">
            <div className="w-full">
                <div className="font-bold text-xl">{t("users-page.users-sessions")}</div>
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
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
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
            <OperatorSessionsTable />
        </div>
    );
}

export default Content;
