import React from "react";

import { useLocale, useTranslations } from "next-intl";

import Image from "@/components/Image";
import Link from "@/components/Link";
import { Badge } from "@/components/ui/badge";
import { formatDatetime, formatVideoDuration, formatDuration, getPrice } from "@/lib/helper";
import { CarSessionVisible } from "@/openapi/client";

const Content = ({ data }: { data: CarSessionVisible }) => {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <div className="overflow-x-auto rounded-md border">
            <div className="flex justify-center">
                <Image
                    withBackground={true}
                    isServerImage={true}
                    src={data.imageUrl}
                    alt="Car session image"
                    width={1000}
                    height={1000}
                    className="max-w-5xl aspect-video w-full object-contain"
                />
            </div>
            <table className="w-full border-collapse text-sm">
                <caption className="sr-only">{t("cars-page.user-detail-information")}</caption>
                <tbody>
                    <tr className="border-b">
                        <th
                            scope="row"
                            className="w-40 px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            ID
                        </th>
                        <td className="px-4 py-2">{data.id}</td>
                    </tr>
                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("cars-page.car-number")}
                        </th>
                        <td className="px-4 py-2">
                            <Link
                                withoutStyling={false}
                                className="text-blue-500"
                                href={`/car/${data.carId}/detail`}
                            >
                                {data.carNumber}
                            </Link>
                        </td>
                    </tr>
                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("car-park")}
                        </th>
                        <td className="px-4 py-2">{data.carPark.label}</td>
                    </tr>
                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("total-amount")}
                        </th>
                        <td className="px-4 py-2">
                            {getPrice({ amount: data.totalAmount, currency: data.currency })}
                        </td>
                    </tr>

                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("is-subscription")}
                        </th>
                        <td className="px-4 py-2">
                            <Badge variant={data.isSubscription ? "secondary" : "destructive"}>
                                {data.isSubscription ? (
                                    <Badge variant="secondary">{t("action-buttons.yes")}</Badge>
                                ) : (
                                    <Badge variant="destructive">{t("action-buttons.no")}</Badge>
                                )}
                            </Badge>
                        </td>
                    </tr>
                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("is-paid")}
                        </th>
                        <td className="px-4 py-2">
                            <Badge variant={data.isPaid ? "secondary" : "destructive"}>
                                {data.isPaid ? (
                                    <Badge variant="secondary">{t("action-buttons.yes")}</Badge>
                                ) : (
                                    <Badge variant="destructive">{t("action-buttons.no")}</Badge>
                                )}
                            </Badge>
                        </td>
                    </tr>
                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("duration")}
                        </th>
                        <td className="px-4 py-2">
                            {data.duration
                                ? formatVideoDuration(data.duration)
                                : formatDuration({
                                      start: data.startTime,
                                      end: data.endTime,
                                      locale: locale,
                                  })}
                        </td>
                    </tr>
                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("start-time")}
                        </th>
                        <td className="px-4 py-2">
                            {data.startTime &&
                                formatDatetime({
                                    date: data.startTime,
                                    locale: locale,
                                })}
                        </td>
                    </tr>
                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("end-time")}
                        </th>
                        <td className="px-4 py-2">
                            {data.endTime &&
                                formatDatetime({
                                    date: data.endTime,
                                    locale: locale,
                                })}
                        </td>
                    </tr>
                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("invalidated-at")}
                        </th>
                        <td className="px-4 py-2">
                            {data.invalidatedAt &&
                                formatDatetime({
                                    date: data.invalidatedAt,
                                    locale: locale,
                                })}
                        </td>
                    </tr>
                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("created-at")}
                        </th>
                        <td className="px-4 py-2">
                            {formatDatetime({
                                date: data.createdAt,
                                locale: locale,
                            })}
                        </td>
                    </tr>
                    <tr>
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("updated-at")}
                        </th>
                        <td className="px-4 py-2">
                            {data.updatedAt
                                ? formatDatetime({
                                      date: data.updatedAt,
                                      locale: locale,
                                  })
                                : "-"}
                        </td>
                    </tr>
                    <tr>
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("reason")}
                        </th>
                        <td className="px-4 py-2">{data.reason}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Content;
