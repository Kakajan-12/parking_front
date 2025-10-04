import React from "react";

import { useLocale, useTranslations } from "next-intl";

import Link from "@/components/Link";
import { Badge } from "@/components/ui/badge";
import { formatDatetime } from "@/lib/helper";
import { CarSubscriptionVisible } from "@/openapi/client";

const Content = ({ data }: { data: CarSubscriptionVisible }) => {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <div className="overflow-x-auto rounded-md border">
            <table className="w-full border-collapse text-sm">
                <caption className="sr-only">{t("users-page.user-detail-information")}</caption>
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
                            className="w-40 px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            Car
                        </th>
                        <td className="px-4 py-2">
                            <Link withoutStyling={false} href={`/cars/${data.carId}/detail`}>
                                {data.car ? data.car.carNumber : data.carId}
                            </Link>
                        </td>
                    </tr>

                    <tr className="border-b">
                        <th
                            scope="row"
                            className="px-4 py-2 text-left font-medium text-muted-foreground"
                        >
                            {t("is-active")}
                        </th>
                        <td className="px-4 py-2">
                            <Badge variant={data.isActive ? "secondary" : "destructive"}>
                                {data.isActive ? (
                                    <Badge variant="secondary">{t("active")}</Badge>
                                ) : (
                                    <Badge variant="destructive">{t("inactive")}</Badge>
                                )}
                            </Badge>
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
                </tbody>
            </table>
        </div>
    );
};

export default Content;
