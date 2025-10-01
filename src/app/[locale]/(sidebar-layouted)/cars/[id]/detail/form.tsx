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
import { CarVisible, ValidationError } from "@/openapi/client";

import { carUpdateAction } from "./actions";

const Content = ({ data }: { data: CarVisible }) => {
    const t = useTranslations();
    const [errors, setErrors] = useState<Array<ValidationError> | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (values: {
        carNumber: string;
        ownerName: string;
        isStaff: boolean;
    }) => {
        setLoading(true);
        const toastId = toastLoading(t("please-wait"));
        const response = await carUpdateAction(data.id, {
            carNumber: values.carNumber.toUpperCase(),
            isStaff: values.isStaff || false,
            ownerName: values.ownerName,
        });

        if (response.status == 200 && response.data) {
            toastUpdate(
                toastId,
                response.message ?? t("cars-page.car-updated-successfully"),
                "success",
            );
            setErrors(null);
            if (response.data) {
                router.prefetch(`/users/${response.data.id}/detail`);
                router.refresh();
            }
        } else {
            toastUpdate(toastId, response.message ?? t("errors.something-went-wrong"), "warning");
            if (response.errors !== null) setErrors(response.errors);
        }
        setLoading(false);
    };

    const schema = z.object({
        carNumber: z.string({ required_error: t("validation.default.required") }),
    });

    const formik = useFormik({
        initialValues: {
            carNumber: data.carNumber ?? "",
            ownerName: data.ownerName ?? "",
            isStaff: data.isStaff,
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    return (
        <Card className="w-full mx-auto p-6">
            <CardHeader>
                <CardTitle>{t("cars-page.update-car-details")}</CardTitle>
                <CardDescription>{t("cars-page.update-car-instruction")}</CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4">
                <Form onSubmit={formik.handleSubmit} noValidate={true} className="w-full space-y-4">
                    <Input
                        autoFocus={true}
                        required={true}
                        id="carNumber"
                        name="carNumber"
                        error={getError(formik, errors, "carNumber")}
                        value={formik.values.carNumber}
                        onChange={formik.handleChange}
                        placeholder={t("cars-page.fill-car-number")}
                        label={t("cars-page.car-number")}
                    />
                    <Input
                        id="ownerName"
                        name="ownerName"
                        error={getError(formik, errors, "ownerName")}
                        value={formik.values.ownerName}
                        onChange={formik.handleChange}
                        placeholder={t("cars-page.fill-owner-name")}
                        label={t("cars-page.owner-name")}
                    />
                    {/* Is staff */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            name="isStaff"
                            id="isStaff"
                            checked={formik.values.isStaff}
                            onCheckedChange={checked => {
                                formik.setFieldValue("isStaff", checked);
                            }}
                        />
                        <Label htmlFor="isStaff" className="text-sm font-medium">
                            {t("cars-page.is-staff")}
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
