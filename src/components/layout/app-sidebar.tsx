"use client";

import * as React from "react";

import {
    UsersIcon,
    LayoutDashboard,
    // Command,
    CameraIcon,
    CarIcon,
    DollarSignIcon,
    VideoIcon,
    ChartBar,
} from "lucide-react";
import { useTranslations } from "next-intl";

import Link from "@/components/Link";
import Logo from "@/components/Logo";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/lib/auth/provider";
// import { COMPANY_NAME, SITE_NAME } from "@/lib/constants";
import { RoleType } from "@/openapi/client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const t = useTranslations();
    const { payload } = useAuthContext();
    const routes = {
        [RoleType.AdminRole]: [
            {
                title: t("nav.dashboard"),
                url: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: t("nav.users"),
                url: "/users",
                icon: UsersIcon,
                isActive: true,
                items: [
                    {
                        title: t("nav.user-add"),
                        url: "/users/create",
                    },
                    {
                        title: t("nav.users-sessions"),
                        url: "/users/sessions",
                    },
                ],
            },
            {
                title: t("nav.cameras"),
                url: "/cameras",
                icon: CameraIcon,
                items: [
                    {
                        title: t("nav.camera-add"),
                        url: "/cameras/create",
                    },
                ],
            },
            {
                title: t("nav.cars"),
                url: "/cars",
                icon: CarIcon,
                items: [
                    {
                        title: t("nav.car-add"),
                        url: "/cars/create",
                    },
                    {
                        title: t("nav.cars-sessions"),
                        url: "/cars/sessions",
                    },
                ],
            },
            {
                title: t("nav.tariffs"),
                url: "/tariffs",
                icon: DollarSignIcon,
            },
            {
                title: t("nav.video"),
                url: "/video",
                icon: VideoIcon,
            },
            {
                title: t("nav.report"),
                url: "/reports",
                icon: ChartBar,
            },
        ],
        [RoleType.AccountantRole]: [
            {
                title: t("nav.report"),
                url: "/reports",
                icon: ChartBar,
            },
        ],

        [RoleType.OperatorRole]: [
            {
                title: t("nav.video"),
                url: "/video",
                icon: VideoIcon,
            },
        ],
    };
    const activeRoutes = payload?.role && payload?.role in routes ? routes[payload.role] : [];

    return (
        <Sidebar variant="inset" {...props} className="bg-transparent">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="bg-background hover:bg-background/95"
                            asChild
                        >
                            <Link href="/">
                                <div className="w-full  rounded-lg p-2">
                                    <Logo className="w-full " />
                                </div>
                                {/*<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">*/}
                                {/*    <Command className="size-4" />*/}
                                {/*</div>*/}
                                {/*<div className="grid flex-1 text-left text-sm leading-tight">*/}
                                {/*    <span className="truncate font-medium">{SITE_NAME}</span>*/}
                                {/*    <span className="truncate text-xs">{COMPANY_NAME}</span>*/}
                                {/*</div>*/}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={activeRoutes} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
