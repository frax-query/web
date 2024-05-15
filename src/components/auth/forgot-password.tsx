"use client";

import { useAuth } from "@/hooks/useAuth";
import { Formik } from "formik";
import type { Dispatch, SetStateAction } from "react";
import { z, ZodError } from "zod";
import { PulseLoading } from "../pulse-loading";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { Label } from "../ui/label";

export const ForgotPasswordSection: React.FC<{
    setSection: Dispatch<SetStateAction<string>>;
    setEmail: Dispatch<SetStateAction<string>>;
}> = ({ setSection, setEmail }) => {
    const { toast } = useToast();
    const ValidationSchema = z.object({
        email: z.string().email("Invalid email address"),
    });

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

    const { resetPassword, loading } = useAuth();
    const handleResetPassword = async (values: FormValues) => {
        const { isError, message } = await resetPassword(values.email);
        if (isError) {
            toast({
                variant: "destructive",
                description: message,
            });
            return;
        }
        setEmail(values.email);
        setSection("verify-password");
    };
    return (
        <div className="mt-4 space-y-4">
            <div>
                <div className="tracking-light text-xl font-semibold">
                    Reset Password
                </div>
                <div className="text-xs text-muted-foreground">
                    Having trouble remembering your password? No problem! Enter
                    your email address and we'll help you get back in.
                </div>
            </div>
            <Formik
                initialValues={{
                    email: "",
                }}
                validate={validateForm}
                onSubmit={(values) => {
                    handleResetPassword(values);
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Email"
                                disabled={loading}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                            />
                        </div>
                        <Button
                            variant="default"
                            size="sm"
                            className="w-full gap-2"
                            disabled={loading}
                            type="submit"
                        >
                            {loading && <PulseLoading />}
                            Reset Password
                        </Button>
                    </form>
                )}
            </Formik>
        </div>
    );
};
