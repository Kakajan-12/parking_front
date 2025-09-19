"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { canSubmit, getError, toastLoading, toastUpdate } from "@/lib/helper";
import { CarParkType, RoleType } from "@/openapi/client";

import { authenticate } from "./actions";

const ROUTES_BY_ROLE = {
    [RoleType.AdminRole]: "/dashboard",
    [RoleType.OperatorRole]: "/video",
    [RoleType.AccountantRole]: "/report",
};

const SignInForm = () => {
    const [errors, setErrors] = useState<Record<string, string> | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const t = useTranslations();

    const schema = z.object({
        username: z.string({ required_error: t("validation.default.required") }),
        password: z.string({ required_error: t("validation.default.required") }),
        carPark: z.string().optional(),
    });

    const handleSubmit = async (values: {
        username: string;
        password: string;
        remember: boolean;
        carPark?: CarParkType;
    }) => {
        setErrors(null);
        setLoading(true);
        const toastId = toastLoading(t("please-wait"));
        const response = await authenticate({
            username: values.username,
            password: values.password,
            carPark: values.carPark || undefined,
            remember: values.remember,
        });

        if (response.status == 200 && response.data) {
            toastUpdate(toastId, response.message ?? t("auth-successfully"), "success");
            router.refresh();
            router.push(ROUTES_BY_ROLE[response.data.role]);
        } else {
            toastUpdate(toastId, response.message ?? t("errors.something-went-wrong"), "warning");
            if (response.errors !== null) setErrors(response.errors);
        }
        setLoading(false);
    };

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            carPark: undefined,
            remember: true,
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: handleSubmit,
    });
    return (
        <div
            className="h-full w-full flex justify-center items-center"
            style={{
                backgroundImage: "url(/background-image.svg)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "bottom",
            }}
        >
            <Card className="w-full max-w-md p-8 rounded-2xl">
                <CardContent>
                    <div className="w-full flex justify-center">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={200}
                            height={40}
                            className="mb-6"
                        />
                    </div>
                    <Form
                        className="w-full"
                        noValidate={true}
                        loading={loading}
                        onSubmit={formik.handleSubmit}
                    >
                        <h2 className="py-10 text-left text-2xl font-semibold  leading-6">
                            {t("login")}
                        </h2>

                        <div className="mb-8 space-y-4">
                            <Input
                                label={t("username")}
                                type="text"
                                name="username"
                                placeholder={t("input-username")}
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                disabled={loading}
                                error={getError(formik, errors, "username")}
                            />
                            <PasswordInput
                                label={t("password")}
                                id="password"
                                name="password"
                                placeholder={t("input-password")}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                disabled={loading}
                                error={getError(formik, errors, "password")}
                            />
                            <div className="flex flex-col">
                                <Select
                                    value={formik.values.carPark}
                                    onValueChange={(value: string) => {
                                        if (value === "clear") {
                                            formik.setFieldValue("carPark", "");
                                        } else {
                                            formik.setFieldValue("carPark", value);
                                        }
                                    }}
                                >
                                    <SelectTrigger
                                        error={getError(formik, errors, "carPark")}
                                        label={t("park-number")}
                                        id="carPark"
                                        fullWidth={true}
                                    >
                                        <SelectValue placeholder={t("park-number-empty-value")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="clear" className="text-muted-foreground">
                                            {t("select-park-number")}
                                        </SelectItem>
                                        <SelectItem value={CarParkType.Park3}>
                                            {t("car-park-type.park-3")}
                                        </SelectItem>
                                        <SelectItem value={CarParkType.Park4}>
                                            {t("car-park-type.park-4")}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={canSubmit(formik) || loading}
                        >
                            {t("action-buttons.submit")}
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
export default SignInForm;
