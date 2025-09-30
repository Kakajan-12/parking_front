"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Textarea } from "@/components/ui/textarea";
import { canSubmit, getError, toastLoading, toastUpdate } from "@/lib/helper";
import { ValidationError, CarSubscriptionVisible } from "@/openapi/client";

import { updateAction } from "./actions";

const Content = ({ data }: { data: CarSubscriptionVisible }) => {
    const t = useTranslations();
    const [errors, setErrors] = useState<Array<ValidationError> | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (values: {
        totalAmount: string;
        isPaid: boolean;
        isActive: boolean;
    }) => {
        setLoading(true);
        const toastId = toastLoading(t("please-wait"));
        const response = await updateAction(data.id, {
            totalAmount: values.totalAmount,
            isPaid: values.isPaid,
            isActive: values.isActive,
        });

        if (response.status == 200 && response.data) {
            toastUpdate(
                toastId,
                response.message ?? t("subscription-page.subscription-updated-successfully"),
                "success",
            );
            setErrors(null);
            if (response.data) {
                router.prefetch(`/subscriptions/${response.data.id}/detail`);
                router.refresh();
            }
        } else {
            toastUpdate(toastId, response.message ?? t("errors.something-went-wrong"), "warning");
            if (response.errors !== null) setErrors(response.errors);
        }
        setLoading(false);
    };

    const schema = z.object({
        totalAmount: z.string({ required_error: t("validation.default.required") }),
        startTime: z.string({ required_error: t("validation.default.required") }),
        endTime: z.string({ required_error: t("validation.default.required") }),
    });

    const formik = useFormik({
        initialValues: {
            totalAmount: data.totalAmount ?? "",
            isPaid: data.isPaid,
            isActive: data.isActive,
            startTime: data.startTime,
            endTime: data.endTime,
            note: data.note,
        },
        validationSchema: toFormikValidationSchema(schema),

        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    return (
        <Card className="w-full mx-auto p-6">
            <CardHeader>
                <CardTitle>{t("subscriptions-page.update-subscription-details")}</CardTitle>
                <CardDescription>
                    {t("subscriptions-page.update-subscription-instruction")}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4">
                <Form onSubmit={formik.handleSubmit} noValidate={true} className="w-full space-y-4">
                    <NumberInput
                        required={true}
                        id="totalAmount"
                        name="totalAmount"
                        error={getError(formik, errors, "totalAmount")}
                        value={formik.values.totalAmount}
                        onChange={formik.handleChange}
                        placeholder={t("subscriptions-page.fill-total-amount")}
                        label={t("total-amount")}
                    />
                    <DatetimePicker
                        value={formik.values.startTime}
                        required={true}
                        label={t("start-time")}
                        onChange={value => {
                            if (value) {
                                formik.setFieldValue("startTime", value.toISOString());
                            } else {
                                formik.setFieldValue("startTime", undefined);
                            }
                        }}
                    />
                    <DatetimePicker
                        value={formik.values.endTime}
                        required={true}
                        label={t("end-time")}
                        onChange={value => {
                            if (value) {
                                formik.setFieldValue("endTime", value.toISOString());
                            } else {
                                formik.setFieldValue("endTime", undefined);
                            }
                        }}
                    />

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            name="isPaid"
                            id="isPaid"
                            checked={formik.values.isPaid}
                            onCheckedChange={checked => {
                                formik.setFieldValue("isPaid", checked);
                            }}
                        />
                        <Label htmlFor="isPaid" className="text-sm font-medium">
                            {t("is-paid")}
                        </Label>
                    </div>
                    {/* Is Active */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            name="isActive"
                            id="isActive"
                            checked={formik.values.isActive}
                            onCheckedChange={checked => {
                                formik.setFieldValue("isActive", checked);
                            }}
                        />
                        <Label htmlFor="isActive" className="text-sm font-medium">
                            {t("is-active")}
                        </Label>
                    </div>
                    <div>
                        <Label htmlFor="note" className="text-sm font-medium">
                            {t("note")}
                        </Label>
                        <Textarea
                            value={formik.values.note}
                            onChange={formik.handleChange}
                            id="note"
                            name="note"
                        />
                    </div>
                    <CardFooter className="gap-x-4 justify-end  px-0 py-4">
                        <Button onClick={() => formik.resetForm()} type="button" variant="outline">
                            {t("action-buttons.reset")}
                        </Button>
                        <Button disabled={canSubmit(formik) || loading} type="submit">
                            {t("action-buttons.submit")}
                        </Button>
                    </CardFooter>
                </Form>
            </CardContent>
        </Card>
    );
};

export default Content;
