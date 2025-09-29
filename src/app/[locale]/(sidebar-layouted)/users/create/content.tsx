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
import { PasswordInput } from "@/components/ui/password-input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { canSubmit, getError, toastLoading, toastUpdate } from "@/lib/helper";
import { CarParkChoices, RoleTypeChoices, ValidationError } from "@/openapi/client";

import { userCreateAction } from "./actions";

const Content = () => {
    const t = useTranslations();
    const [errors, setErrors] = useState<ValidationError[] | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (values: {
        username: string;
        fullName: string;
        password: string;
        role?: RoleTypeChoices;
        carPark?: CarParkChoices;
        isActive: boolean;
    }) => {
        if (values.role === undefined) return;
        setLoading(true);
        const toastId = toastLoading(t("please-wait"));
        try {
            const response = await userCreateAction({
                username: values.username,
                password: values.password,
                fullName: values.fullName,
                role: values.role,
                carPark: values.carPark || undefined,
                isActive: values.isActive || false,
            });

            if (response.status == 201 && response.data) {
                toastUpdate(
                    toastId,
                    response.message ?? t("users-page.user-created-successfully"),
                    "success",
                );
                setErrors(null);
                if (response.data) {
                    router.push(`/users/${response.data.id}/detail`);
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
        username: z.string({ required_error: t("validation.default.required") }),
        fullName: z.string({ required_error: t("validation.default.required") }),
        password: z.string({ required_error: t("validation.default.required") }),
        role: z.nativeEnum(RoleTypeChoices, {
            required_error: t("validation.default.required"),
            message: t("validation.select.invalid"),
        }),
        carPark: z
            .nativeEnum(CarParkChoices, { message: t("validation.select.invalid") })
            .optional(),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            fullName: "",
            password: "",
            carPark: undefined,
            role: undefined,
            isActive: false,
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: handleSubmit,
    });

    return (
        <Card className="w-full mx-auto p-6">
            <CardHeader>
                <CardTitle>{t("users-page.add-new-user")}</CardTitle>
                <CardDescription>{t("users-page.add-user-instruction")}</CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4">
                <Form onSubmit={formik.handleSubmit} noValidate={true} className="w-full space-y-4">
                    <Input
                        required={true}
                        id="fullName"
                        name="fullName"
                        error={getError(formik, errors, "fullName")}
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        placeholder={t("users-page.fill-full-name")}
                        label={t("full-name")}
                    />

                    <Input
                        required={true}
                        id="username"
                        name="username"
                        error={getError(formik, errors, "username")}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        label={t("username")}
                        placeholder={t("users-page.fill-username")}
                    />

                    <PasswordInput
                        id="password"
                        name="password"
                        required={true}
                        error={getError(formik, errors, "password")}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        label={t("password")}
                        placeholder="••••••••"
                    />

                    <Select
                        value={formik.values.role}
                        onValueChange={(value: string) => {
                            formik.setFieldValue("role", value);
                        }}
                    >
                        <SelectTrigger
                            required={true}
                            error={getError(formik, errors, "role")}
                            label={t("role")}
                            id="role"
                            fullWidth={true}
                        >
                            <SelectValue placeholder={t("users-page.select-role")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={RoleTypeChoices.OPERATOR}>
                                {t("role-type.operator")}
                            </SelectItem>
                            <SelectItem value={RoleTypeChoices.ACCOUNTANT}>
                                {t("role-type.accountant")}
                            </SelectItem>
                            <SelectItem value={RoleTypeChoices.ADMIN}>
                                {t("role-type.admin")}
                            </SelectItem>
                        </SelectContent>
                    </Select>

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
                            <SelectValue placeholder={t("users-page.select-car-park")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="clear" className="text-muted-foreground">
                                {t("select-park-number")}
                            </SelectItem>
                            <SelectItem value={CarParkChoices.P3}>
                                {t("car-park-type.park-3")}
                            </SelectItem>
                            <SelectItem value={CarParkChoices.P4}>
                                {t("car-park-type.park-4")}
                            </SelectItem>
                        </SelectContent>
                    </Select>

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
