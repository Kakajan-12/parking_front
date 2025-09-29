"use client";

import React, { useState, useCallback, useEffect } from "react";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    PaginationState,
    Updater,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LuRefreshCcw } from "react-icons/lu";

import Link from "@/components/Link";
import Loader from "@/components/Loader";
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
import { formatDatetime, getPrice, toastLoading, toastUpdate } from "@/lib/helper";
import { OperatorSessionVisible } from "@/openapi/client";

import {
    fetchOperatorSessions,
    operatorSessionCalculate,
    userSessionRevokeAction,
} from "./actions";

const OperatorSessionsTable = () => {
    const [search, setSearch] = useState("");
    const locale = useLocale();
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Array<OperatorSessionVisible>>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 25,
    });

    const callback = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchOperatorSessions({
                page: pagination.page,
                limit: pagination.pageSize,
            });
            if (response.status === 200 && response.data) {
                const rows = response.data.rows;
                setData(rows);
            } else {
                setData([]);
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error("Error corrupted:", e.message);
                console.error(e.stack);
            } else {
                console.error("Unknown error:", e);
            }
            setData([]);
        }
        setLoading(false);
    }, [pagination, search]);

    useEffect(() => {
        callback();
    }, [callback]);

    const handleRefresh = async () => {
        await callback();
    };

    const handlePageChange = (updaterOrValue: Updater<PaginationState>) => {
        const newState =
            typeof updaterOrValue === "function"
                ? updaterOrValue({ pageIndex: pagination.page - 1, pageSize: pagination.pageSize }) // current state
                : updaterOrValue;
        setPagination({
            page: newState.pageIndex + 1,
            pageSize: newState.pageSize,
        });
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

    const handleCalculate = async (value: number) => {
        const toastId = toastLoading(t("please-wait"));
        try {
            const response = await operatorSessionCalculate(value);
            if (response.status == 200) {
                toastUpdate(
                    toastId,
                    response.message ?? t("users-page.operator-session-calculated"),
                    "success",
                );
                await callback();
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

    const columns: ColumnDef<OperatorSessionVisible>[] = [
        {
            accessorKey: "id",
            header: "Id",
        },
        {
            accessorKey: "sessionId",
            header: t("session"),
        },
        {
            accessorKey: "user",
            header: t("operator"),

            cell: ({ row }) => {
                const user = row.original.user;
                if (!user) return "-";
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
            accessorKey: "totalAmount",
            header: t("total-amount"),
            cell: ({ row }) => {
                return getPrice({
                    amount: row.original.totalAmount,
                    currency: row.original.currency,
                });
            },
        },
        {
            accessorKey: "capturedAmount",
            header: t("captured-amount"),
            cell: ({ row }) => {
                return getPrice({
                    amount: row.original.totalAmount,
                    currency: row.original.currency,
                });
            },
        },
        {
            accessorKey: "carPark",
            header: t("car-park"),
            cell: ({ row }) => {
                const carPark = row.original.carPark;
                if (!carPark) return "-";
                return carPark.label;
            },
        },
        {
            accessorKey: "totalCars",
            header: t("total-cars"),
        },
        {
            accessorKey: "paidCars",
            header: t("paid-cars"),
        },
        {
            accessorKey: "loginAt",
            header: t("login-at"),
            cell: ({ row }) => {
                const loginAt = row.original.loginAt;
                return formatDatetime({ date: loginAt, locale: locale });
            },
        },
        {
            accessorKey: "logoutAt",
            header: t("logout-at"),
            cell: ({ row }) => {
                const logoutAt = row.original.logoutAt;
                return formatDatetime({ date: logoutAt, locale: locale });
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
                            <DropdownMenuItem>{t("action-buttons.view-details")}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCalculate(objData.id)}>
                                {t("action-buttons.calculate")}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                disabled={!!objData.logoutAt}
                                onClick={() => handleRevoke(objData.sessionId)}
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
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        onPaginationChange: handlePageChange, //update the pagination state when internal APIs mutate the pagination state
        state: {
            pagination: {
                pageIndex: pagination.page - 1,
                pageSize: pagination.pageSize,
            },
        },
    });

    const renderRows = () => {
        if (loading) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        <div className="flex items-center justify-center">
                            <Loader />
                        </div>
                    </TableCell>
                </TableRow>
            );
        }
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
            <div className="font-bold text-xl">{t("users-page.operator-sessions")}</div>
            <div className="w-full flex items-center py-4">
                <DebouncedInput
                    placeholder="Filter..."
                    value={search ?? ""}
                    onChange={value => {
                        setSearch(value);
                    }}
                    fullWidth={true}
                    className="max-w-md w-full"
                />
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
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                pageSize={pagination.pageSize}
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
                pageIndex={pagination.page}
            />
        </div>
    );
};

export default OperatorSessionsTable;
