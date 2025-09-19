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
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { canSubmit, getError, toastLoading, toastUpdate } from "@/lib/helper";
import { CameraType, CameraUpdateInput, CameraResponse } from "@/openapi/client";

import { cameraUpdateAction } from "./actions";

const Content = ({ data }: { data: CameraResponse }) => {
    const t = useTranslations();
    const [errors, setErrors] = useState<Record<string, string> | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (values: { name: string; type?: string }) => {
        if (values.type === undefined) return;
        setLoading(true);
        const toastId = toastLoading(t("please-wait"));
        const response = await cameraUpdateAction(data.id, {
            name: values.name,
            type: values.type as CameraUpdateInput["type"],
        });

        if (response.status == 200 && response.data) {
            toastUpdate(
                toastId,
                response.message ?? t("cameras-page.camera-updated-successfully"),
                "success",
            );
            setErrors(null);
            if (response.data) {
                router.push(`/cameras/${response.data.id}/detail`);
            }
        } else {
            toastUpdate(toastId, response.message ?? t("errors.something-went-wrong"), "warning");
            if (response.errors !== null) setErrors(response.errors);
        }
        setLoading(false);
    };

    const schema = z.object({
        name: z.string({ required_error: t("validation.default.required") }),
        type: z.nativeEnum(CameraType, {
            required_error: t("validation.default.required"),
            message: t("validation.select.invalid"),
        }),
    });

    const formik = useFormik({
        initialValues: {
            name: data.name ?? "",
            type: data.type ? data.type.value : undefined,
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: handleSubmit,
    });

    return (
        <Card className="w-full mx-auto p-6">
            <CardHeader>
                <CardTitle>{t("cameras-page.update-camera-details")}</CardTitle>
                <CardDescription>{t("cameras-page.update-camera-instruction")}</CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4">
                <Form onSubmit={formik.handleSubmit} noValidate={true} className="w-full space-y-4">
                    <Input
                        autoFocus={true}
                        required={true}
                        id="fullName"
                        name="fullName"
                        error={getError(formik, errors, "name")}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        placeholder={t("cameras-page.fill-name")}
                        label={t("cameras-page.name")}
                    />

                    <Select
                        value={formik.values.type}
                        onValueChange={(value: string) => {
                            formik.setFieldValue("type", value);
                        }}
                    >
                        <SelectTrigger
                            required={true}
                            error={getError(formik, errors, "type")}
                            label={t("type")}
                            id="type"
                            fullWidth={true}
                        >
                            <SelectValue placeholder={t("cameras-page.select-camera-type")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={CameraType.InsideCamera}>
                                {t("camera-type.inside")}
                            </SelectItem>
                            <SelectItem value={CameraType.OutsideCamera}>
                                {t("camera-type.outside")}
                            </SelectItem>
                        </SelectContent>
                    </Select>

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
