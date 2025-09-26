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
import { canSubmit, getError, toastLoading, toastUpdate } from "@/lib/helper";
import type { ValidationError } from "@/openapi/client";

import { createAction } from "./actions";

const Content = () => {
    const t = useTranslations();
    const [errors, setErrors] = useState<Array<ValidationError> | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (values: {
        name: string;
        duration: number;
        isActive: boolean;
        priceAmount: string;
    }) => {
        setLoading(true);
        const toastId = toastLoading(t("please-wait"));
        try {
            const response = await createAction({
                name: values.name,
                duration: values.duration,
                isActive: values.isActive || false,
                priceAmount: values.priceAmount,
            });

            if (response.status == 201 && response.data) {
                toastUpdate(
                    toastId,
                    response.message ?? t("cars-page.car-created-successfully"),
                    "success",
                );
                setErrors(null);
                if (response.data) {
                    router.push("/tariffs");
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
        name: z.string({ required_error: t("validation.default.required") }),
        duration: z
            .number({ required_error: t("validation.default.required") })
            .max(24, t("validation.number.max", { value: 24 }))
            .min(1, t("validation.number.min", { value: 1 })),
        priceAmount: z.string({ required_error: t("validation.default.required") }),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            duration: 0,
            isActive: false,
            priceAmount: "",
        },

        validationSchema: toFormikValidationSchema(schema),
        onSubmit: handleSubmit,
    });

    return (
        <Card className="w-full mx-auto p-6">
            <CardHeader>
                <CardTitle>{t("tariffs-page.add-new-tariff")}</CardTitle>
                <CardDescription>{t("tariffs-page.add-tariff-instruction")}</CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4">
                <Form onSubmit={formik.handleSubmit} noValidate={true} className="w-full space-y-4">
                    <Input
                        autoFocus={true}
                        required={true}
                        id="name"
                        name="name"
                        error={getError(formik, errors, "name")}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        placeholder={t("tariffs-page.fill-name")}
                        label={t("tariffs-page.name")}
                    />
                    <Input
                        id="duration"
                        name="duration"
                        type="number"
                        error={getError(formik, errors, "duration")}
                        value={formik.values.duration}
                        onChange={formik.handleChange}
                        placeholder={t("tariffs-page.fill-tariff-duration")}
                        label={t("tariffs-page.duration")}
                    />
                    <Input
                        id="priceAmount"
                        name="priceAmount"
                        error={getError(formik, errors, "priceAmount")}
                        value={formik.values.priceAmount}
                        onChange={formik.handleChange}
                        placeholder={t("tariffs-page.fill-tariff-price-amount")}
                        label={t("tariffs-page.price-amount")}
                    />
                    {/* Is staff */}
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
