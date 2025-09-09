"use client";

import React from "react";

import { useTranslations } from "next-intl";
import { CgFileDocument } from "react-icons/cg";
import { CiMenuKebab } from "react-icons/ci";

import {
    Card,
    CardContent,
    CardTitle,
    CardAction,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";

import { DashboardAPIDatatype, DashboardAPIReportDataType } from "./dashboard";

function parseMoney(money: number | string): number {
    if (typeof money === "number") return money;
    const parsed = parseFloat(money);
    return isNaN(parsed) ? 0 : parsed;
}

const Content = ({
    data,
    reportData,
}: {
    data: DashboardAPIDatatype;
    reportData: DashboardAPIReportDataType;
}) => {
    const t = useTranslations();

    const moneyP3Total = reportData.data
        .filter(item => item.park === "P3")
        .reduce((sum, item) => sum + parseMoney(item.money), 0);

    const moneyP4Total = reportData.data
        .filter(item => item.park === "P4")
        .reduce((sum, item) => sum + parseMoney(item.money), 0);
    return (
        <div className="flex flex-col">
            {/* Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("users")}</CardTitle>
                        <CardDescription>{t("dashboard.users-count")}</CardDescription>
                        <CardAction>{}</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-black">{data?.totalUsers || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("operators")}</CardTitle>
                        <CardDescription>{t("dashboard.operators-count")}</CardDescription>
                        <CardAction>{}</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-black">{data?.operator || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("cameras")}</CardTitle>
                        <CardDescription>{t("dashboard.cameras-count")}</CardDescription>
                        <CardAction>{}</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-black">{data?.camera || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("dashboard.total-cars")}</CardTitle>
                        <CardDescription>{t("dashboard.total-cars-count")}</CardDescription>
                        <CardAction>{}</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-black">{data?.totalCars || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("dashboard.income-park-3")}</CardTitle>
                        <CardDescription>{t("dashboard.income-park-summary")}</CardDescription>
                        <CardAction>{}</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-black">{moneyP3Total} TMT</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("dashboard.income-park-4")}</CardTitle>
                        <CardDescription>{t("dashboard.income-park-summary")}</CardDescription>
                        <CardAction>{}</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-black">{moneyP4Total} TMT</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Content;
