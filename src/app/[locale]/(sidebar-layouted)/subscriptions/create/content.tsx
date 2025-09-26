"use client";

import { useState } from "react";

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
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { canSubmit, getError, toastLoading, toastUpdate } from "@/lib/helper";
import { ValidationError } from "@/openapi/client";

import { createAction } from "./actions";

const Content = () => {
    const t = useTranslations();
    const [errors, setErrors] = useState<ValidationError[] | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (values: {
        carId: string;
        totalAmount: string;
        startTime: string;
        endTime: string;
        isPaid: boolean;
        isActive: boolean;
        note: string;
    }) => {
        if (values.carId === "") return;
        setLoading(true);
        const toastId = toastLoading(t("plea    se-wait"));
        try {
            const response = await createAction({
                carId: parseInt(values.carId),
                totalAmount: values.totalAmount,
                startTime: values.startTime,
                endTime: values.endTime,
                isPaid: values.isPaid || false,
                isActive: values.isActive || false,
                note: values.note,
            });

            if (response.status == 201 && response.data) {
                toastUpdate(
                    toastId,
                    response.message ?? t("subscriptions-page.subscription-add-successfully"),
                    "success",
                );
                setErrors(null);
                if (response.data) {
                    router.push(`/subscriptions/${response.data.id}/detail`);
                }
            } else {
                toastUpdate(
                    toastId,
                    response.message ?? t("errors.something-went-wrong"),
                    "warning",
                );
                if (response.errors !== null) setErrors(response.errors);
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
        setLoading(false);
    };

    const schema = z.object({
        carId: z.string({ required_error: t("validation.default.required") }),
    });

    const formik = useFormik({
        initialValues: {
            carId: "",
            totalAmount: "",
            startTime: "",
            endTime: "",
            isPaid: false,
            isActive: false,
            note: "",
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: handleSubmit,
    });

    return (
        <Card className="w-full mx-auto p-6">
            <CardHeader>
                <CardTitle>{t("subscriptions-page.add-new-car-subscription")}</CardTitle>
                <CardDescription>
                    {t("subscriptions-page.add-car-subscription-instruction")}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4">
                <Form onSubmit={formik.handleSubmit} noValidate={true} className="w-full space-y-4">
                    <Input
                        autoFocus={true}
                        required={true}
                        id="carId"
                        name="carId"
                        error={getError(formik, errors, "carId")}
                        value={formik.values.carId}
                        onChange={formik.handleChange}
                        placeholder={t("subscriptions-page.select-car")}
                        label={t("car")}
                    />
                    <Input
                        required={true}
                        id="totalAmount"
                        name="totalAmount"
                        error={getError(formik, errors, "totalAmount")}
                        value={formik.values.totalAmount}
                        onChange={formik.handleChange}
                        placeholder={t("subscriptions-page.fill-total-amount")}
                        label={t("total-amount")}
                    />
                    <Input
                        required={true}
                        id="startTime"
                        name="startTime"
                        error={getError(formik, errors, "startTime")}
                        value={formik.values.startTime}
                        onChange={formik.handleChange}
                        placeholder={t("subscriptions-page.select-start-time")}
                        label={t("start-time")}
                    />
                    <Input
                        required={true}
                        id="endTime"
                        name="endTime"
                        error={getError(formik, errors, "endTime")}
                        value={formik.values.endTime}
                        onChange={formik.handleChange}
                        placeholder={t("subscriptions-page.select-end-time")}
                        label={t("end-time")}
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
