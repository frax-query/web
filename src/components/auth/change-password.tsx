"use client";

import { Formik, ErrorMessage } from "formik";
import type { Dispatch, SetStateAction } from "react";
import { z, ZodError } from "zod";
import { PulseLoading } from "../pulse-loading";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { Label } from "../ui/label";
import { useAuth } from "@/hooks/useAuth";

export const ChangePassword: React.FC<{
    setSection: Dispatch<SetStateAction<string>>;
}> = ({ setSection }) => {
    const { toast } = useToast();
    const ValidationSchema = z
        .object({
            new_password: z.string().min(8, "Password is too short"),
            confirm_password: z.string(),
        })
        .refine(
            (values) => {
                return values.new_password === values.confirm_password;
            },
            {
                message: "Passwords must match!",
                path: ["confirm_password"],
            }
        );

    type FormValues = z.infer<typeof ValidationSchema>;
    const validateForm = (values: FormValues) => {
        try {
            ValidationSchema.parse(values);
        } catch (error) {
            if (error instanceof ZodError) {
                return error.formErrors.fieldErrors;
            }
        }
    };
    const { loading, changePassword } = useAuth();

    const handleChangePassword = async (values: FormValues) => {
        const { isError, message } = await changePassword(values.new_password);
        if (isError) {
            toast({
                variant: "destructive",
                description: message,
            });
            return;
        }
        toast({
            variant: "default",
            title: "Password Reset Successful",
            description: "You can now log in with your new password.",
        });
        setSection("login");
        window.location.reload();
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="text-xl font-bold tracking-tight">
                Reset Password
            </div>
            <div className="text-muted-foreground">
                We understand you might have forgotten your password. No
                worries, resetting it is easy!
            </div>
            <Formik
                initialValues={{
                    new_password: "",
                    confirm_password: "",
                }}
                validate={validateForm}
                onSubmit={(values) => {
                    handleChangePassword(values);
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="new_password"
                                name="new_password"
                                placeholder="Password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.new_password}
                                disabled={loading}
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="text-sm text-red-600"
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="confirm_password">
                                Confirm Password
                            </Label>
                            <Input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                placeholder="Confirm password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirm_password}
                                disabled={loading}
                            />
                            <ErrorMessage
                                name="confirm_password"
                                component="div"
                                className="text-sm text-red-600"
                            />
                        </div>
                        <Button
                            variant="default"
                            size="sm"
                            className="w-full gap-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading && <PulseLoading />}
                            Sign Up
                        </Button>
                    </form>
                )}
            </Formik>
        </div>
    );
};
