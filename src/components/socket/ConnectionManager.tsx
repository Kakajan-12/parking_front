"use client";

import  { Fragment, useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { HiOutlineSignal, HiOutlineSignalSlash } from "react-icons/hi2";
import { Socket } from "socket.io-client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function ConnectionManager({ socket }: { socket: Socket | null }) {
    const t = useTranslations();
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        if (!socket) return;

        // Update state when socket connects/disconnects
        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        // Set initial state
        setConnected(!socket.disconnected);

        // Cleanup listeners on unmount
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, [socket]);

    function handleConnect() {
        if (!socket) return;
        socket.connect();
    }

    function handleDisconnect() {
        if (!socket) return;
        socket.disconnect();
    }

    if (!socket) return (
        <div className="rounded-md bg-destructive text-foreground size-10 flex justify-center items-center">
            <HiOutlineSignalSlash className="size-4" />
        </div>
    );

    return (
        <Fragment>
            {!connected ? (
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <Button
                            className="text-red-600"
                            aria-label="Connect"
                            variant="ghost"
                            size="icon"
                            onClick={handleConnect}
                        >
                            <HiOutlineSignalSlash className="size-4" />
                            <span className="sr-only">Connect</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent color="destructive">
                        <div>{t("disconnected")}</div>
                    </TooltipContent>
                </Tooltip>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <Button aria-label="Disconnect" variant="default" onClick={handleDisconnect}>
                            <HiOutlineSignal className="size-4" />
                            <span className="sr-only">Disconnect</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>{t("connected")}</div>
                    </TooltipContent>
                </Tooltip>
            )}
        </Fragment>
    );
}
