"use client";

import React, { useCallback, useState } from "react";

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
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Textarea } from "@/components/ui/textarea";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";
import { canSubmit, getError, toastLoading, toastUpdate } from "@/lib/helper";
import { ValidationError } from "@/openapi/client";

import { createAction, fetchCars } from "./actions";

const Content = () => {
    const [cars, setCars] = useState<Array<ComboboxOption>>([]);
    const [carLoading, setCarLoading] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const t = useTranslations();
    const [errors, setErrors] = useState<ValidationError[] | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const callback = useCallback(async () => {
        setCarLoading(true);
        try {
            const response = await fetchCars({
                page: 1,
                limit: 25,
                isStaff: true,
                search: searchValue,
            });
            if (response.status === 200 && response.data) {
                const options: ComboboxOption[] = response.data.map(item => ({
                    value: item.id.toString(),
                    label: item.carNumber,
                    disabled: false,
                }));
                setCars(options);
            } else {
                setCars([]);
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error("Error corrupted:", e.message);
                console.error(e.stack);
            } else {
                console.error("Unknown error:", e);
            }
            setCars([]);
        }
        setCarLoading(false);
    }, [searchValue]);

    const debouncedOnChange = useDebounceCallback(async () => {
        await callback();
    }, 300);

    const handleChange = (value: string) => {
        setSearchValue(value); // update UI immediately
        debouncedOnChange(); // call onChange after debounce
    };

    const handleSubmit = async (values: {
        carId: ComboboxOption | null;
        totalAmount: string;
        startTime: string | undefined;
        endTime: string | undefined;
        isPaid: boolean;
        isActive: boolean;
        note: string;
    }) => {
        if (values.carId === null) return;
        setLoading(true);
        const toastId = toastLoading(t("please-wait"));
        try {
            const response = await createAction({
                carId: parseInt(values.carId.value),
                totalAmount: values.totalAmount,
                startTime: values.startTime ?? "",
                endTime: values.endTime ?? "",
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
        totalAmount: z.string({ required_error: t("validation.default.required") }),
        startTime: z.string({ required_error: t("validation.default.required") }),
        endTime: z.string({ required_error: t("validation.default.required") }),
    });

    const formik = useFormik({
        initialValues: {
            carId: null,
            totalAmount: "",
            startTime: undefined,
            endTime: undefined,
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
                    <Combobox
                        required={true}
                        id="carId"
                        label={t("car")}
                        loading={carLoading}
                        onValueChange={value => {
                            console.log(value);
                            formik.setFieldValue("carId", value);
                        }}
                        value={formik.values.carId}
                        options={cars}
                        searchValue={searchValue}
                        setSearchValue={handleChange}
                        error={getError(formik, errors, "carId")}
                    />
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
