"use client";

import React from "react";

import Link from "@/components/Link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthContext } from "@/lib/auth/provider";
import { RoleTypeChoices } from "@/openapi/client";

const ROUTES_BY_ROLE = {
    [RoleTypeChoices.ADMIN]: "/dashboard",
    [RoleTypeChoices.OPERATOR]: "/video",
    [RoleTypeChoices.ACCOUNTANT]: "/report",
};

const Content = () => {
    const { payload } = useAuthContext();
    if (payload === null) {
        return null;
    }

    const route = ROUTES_BY_ROLE[payload.role];

    return (
        <div className="h-full w-full p-6 flex flex-col gap-6">
            {/* User Info Card */}
            <Card className="">
                <CardHeader>
                    <CardTitle>
                        {payload.username} ({payload.role})
                    </CardTitle>
                    {/*<CardDescription>{payload.fullName}</CardDescription>*/}
                </CardHeader>
            </Card>

            {/* Role-specific Routes */}
            <Card className="">
                <CardHeader>
                    <CardTitle>Accessible Routes</CardTitle>
                    <CardDescription>
                        Click to navigate to pages accessible for your role.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {Array.isArray(route) ? (
                        route.map(r => (
                            <Button key={r} asChild={true} className="w-full">
                                <Link href={r}>{r}</Link>
                            </Button>
                        ))
                    ) : (
                        <Button asChild={true} className="w-full">
                            <Link href={route ?? "#"}>{route}</Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Content;
