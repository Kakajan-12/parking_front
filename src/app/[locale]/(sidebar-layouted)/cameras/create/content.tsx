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
import { CameraTypeChoices, ValidationError } from "@/openapi/client";

import { cameraCreateAction } from "./actions";

const Content = () => {
    const t = useTranslations();
    const [errors, setErrors] = useState<Array<ValidationError> | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (values: {
        name: string;
        cameraType?: CameraTypeChoices;
        channelName: string;
        channelToken: string;
    }) => {
        if (values.cameraType === undefined) return;
        setLoading(true);
        const toastId = toastLoading(t("please-wait"));
        try {
            const response = await cameraCreateAction({
                name: values.name,
                cameraType: values.cameraType,
                channelName: values.channelName,
                channelToken: values.channelToken,
            });

            if (response.status == 201 && response.data) {
                toastUpdate(
                    toastId,
                    response.message ?? t("cameras-page.camera-created-successfully"),
                    "success",
                );
                setErrors(null);
                if (response.data) {
                    router.push(`/cameras/${response.data.id}/detail`);
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
        cameraType: z.nativeEnum(CameraTypeChoices, {
            required_error: t("validation.default.required"),
            message: t("validation.select.invalid"),
        }),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            cameraType: undefined,
            channelName: "",
            channelToken: "",
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: handleSubmit,
    });

    return (
        <Card className="w-full mx-auto p-6">
            <CardHeader>
                <CardTitle>{t("cameras-page.add-new-camera")}</CardTitle>
                <CardDescription>{t("cameras-page.add-camera-instruction")}</CardDescription>
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
                        placeholder={t("cameras-page.fill-name")}
                        label={t("cameras-page.name")}
                    />

                    <Select
                        value={formik.values.cameraType}
                        onValueChange={(value: string) => {
                            formik.setFieldValue("cameraType", value);
                        }}
                    >
                        <SelectTrigger
                            required={true}
                            error={getError(formik, errors, "cameraType")}
                            label={t("type")}
                            id="cameraType"
                            fullWidth={true}
                        >
                            <SelectValue placeholder={t("cameras-page.select-camera-type")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={CameraTypeChoices.INSIDE}>
                                {t("camera-type.inside")}
                            </SelectItem>
                            <SelectItem value={CameraTypeChoices.OUTSIDE}>
                                {t("camera-type.outside")}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        id="channelName"
                        name="channelName"
                        error={getError(formik, errors, "channelName")}
                        value={formik.values.channelName}
                        onChange={formik.handleChange}
                        placeholder={t("cameras-page.fill-channel-name")}
                        label={t("cameras-page.channel-name")}
                    />
                    <Input
                        id="channelToken"
                        name="channelToken"
                        error={getError(formik, errors, "channelToken")}
                        value={formik.values.channelToken}
                        onChange={formik.handleChange}
                        placeholder={t("cameras-page.fill-channel-token")}
                        label={t("cameras-page.channel-token")}
                    />

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
