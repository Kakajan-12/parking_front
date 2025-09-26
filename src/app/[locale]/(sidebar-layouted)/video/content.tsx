"use client";

import React, { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
import { Socket } from "socket.io-client";

import Image from "@/components/Image";
import Link from "@/components/Link";
import { ConnectionManager } from "@/components/socket/ConnectionManager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DebouncedInput } from "@/components/ui/debounced-input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Paper } from "@/components/ui/paper";
import {
    Table,
    TableActions,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAuthContext } from "@/lib/auth/provider";
import { formatDatetime, formatDuration, getPrice, toast } from "@/lib/helper";
import { CarSessionVisible, RoleTypeChoices } from "@/openapi/client";
import { getSocketIO } from "@/socket";

import EventsTable from "./events-table";

interface Props {
    rows: Array<CarSessionVisible>;
    page: number;
    limit: number;
    search?: string;
}

interface SocketEvent {
    message: string;
    data: {
        event_type: string;
        event_id: number;
        session_id: number;
        car_number: string;
        image_url: string;
        channel_token: string;
        channel_name: string;
        car_park: string;
        currency?: string;
        total_amount?: string;
    };
}

function Content({ rows, page, limit, search }: Props) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [fullName, setFullName] = React.useState("");
    const [socketEvent, setSocketEvent] = useState<SocketEvent | null>(null);
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const { token, userSession, payload } = useAuthContext();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations();

    useEffect(() => {
        const s = getSocketIO({ token: token || undefined, namespace: "/car-session/" });
        s.connect();
        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, [token]);

    useEffect(() => {
        if (userSession === null) {
            setFullName("");
        } else {
            setFullName(userSession.user.fullName);
        }
    }, [userSession]);

    useEffect(() => {
        if (!socket) return;

        function onServerSessionEvent(event: SocketEvent) {
            if (payload === null) {
                return;
            } else if (payload.role === RoleTypeChoices.OPERATOR) {
                if (event.data.car_park === payload.car_park){
                    router.refresh();
                    setSocketEvent(event);
                    setModalOpen(true); // open modal on event
                }
            } else {
                router.refresh();
                setSocketEvent(event);
                setModalOpen(true); // open modal on event
            }
        }

        socket.on("server_session_event", onServerSessionEvent);

        return () => {
            socket.off("server_session_event", onServerSessionEvent);
        };
    }, [socket]);

    const handleRefresh = () => {
        router.refresh();
        toast(t("page-refreshed"));
    };

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

    const columns: ColumnDef<CarSessionVisible>[] = [
        {
            accessorKey: "id",
            header: "Id",
        },
        {
            accessorKey: "carId",
            header: t("car-number"),

            cell: ({ row }) => {
                const carId = row.original.carId;
                const carNumber = row.original.carNumber;
                if (!carId) return carNumber;
                return (
                    <Link className="text-blue-400 font-semibold" href={`/cars/${carId}/detail`}>
                        {carNumber}
                    </Link>
                );
            },
        },
        {
            accessorKey: "carPark",
            header: t("car-park"),
            cell: ({ row }) => {
                return row.original.carPark.label;
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
            accessorKey: "duration",
            header: t("duration"),
            cell: ({ row }) => {
                return formatDuration({
                    start: row.original.startTime,
                    end: row.original.endTime,
                    locale: locale,
                });
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
            accessorKey: "invalidatedAt",
            header: t("invalidated-at"),
            cell: ({ row }) => {
                return formatDatetime({ date: row.original.invalidatedAt, locale: locale });
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
        <div className="space-y-8">
            <Paper elevation={4} className="flex flex-row items-center ">
                <div className="text-lg">
                    <div>
                        <span className="font-bold">{t("car-park")}: </span>{" "}
                        {payload?.car_park && t(`car-park-type.${payload.car_park}`)}
                    </div>
                    <div>
                        <span className="font-bold">{t("user")}:</span> {payload?.username}
                    </div>
                    <div>
                        <span className="font-bold">{t("full-name")}:</span> {fullName}
                    </div>
                </div>
                <div></div>
            </Paper>

            <div className="w-full">
                <div className="w-full flex items-center py-4">
                    <DebouncedInput
                        placeholder="Filter..."
                        value={search ?? ""}
                        onChange={value => {
                            handleSearch(value);
                        }}
                        fullWidth={true}
                        className="max-w-md w-full"
                    />
                    <div className="flex flex-row ml-auto space-x-2">
                        <Button variant="ghost" size="icon" onClick={handleRefresh}>
                            <LuRefreshCcw className="size-4" />
                        </Button>
                        <ConnectionManager socket={socket} />
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
            <EventsTable />

            {/* --- Socket Event Modal --- */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-lg p-4">
                    <DialogHeader>
                        <DialogTitle>Event: {socketEvent?.data.event_type}</DialogTitle>
                        <DialogDescription>
                            <div>{t("car")}: {socketEvent?.data.car_number}</div>
                            <div>{t("channel")}: {socketEvent?.data.channel_name}</div>
                            {socketEvent?.data.event_type === "exit" && (
                                <div>{t("total-amount")}: {getPrice({amount: socketEvent?.data?.total_amount, currency: socketEvent?.data?.currency ?? ""})}</div>
                            )}

                        </DialogDescription>
                    </DialogHeader>
                    {socketEvent?.data.image_url && (
                        <Image
                            isServerImage={true}
                            withBackground={true}
                            width={800}
                            height={800}
                            src={socketEvent.data.image_url}
                            alt="Event"
                            className="w-full aspect-square rounded-md mt-2"
                        />
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Content;
