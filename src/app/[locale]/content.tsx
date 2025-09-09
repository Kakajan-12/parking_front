"use client";

import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthContext } from "@/lib/auth/provider";
import { ROUTES_BY_ROLE } from "@/lib/constants";


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
                            <Link key={r} href={r} passHref>
                                <Button className="w-full">{r}</Button>
                            </Link>
                        ))
                    ) : (
                        <Link href={route} passHref>
                            <Button className="w-full">{route}</Button>
                        </Link>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Content;
