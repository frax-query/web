"use client";

import { useAuthStore } from "@/hooks/store/authStore";
import { Formik } from "formik";
import type { Dispatch, SetStateAction } from "react";
import { z, ZodError } from "zod";
import { PulseLoading } from "../pulse-loading";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { useAuth } from "@/hooks/useAuth";

export const LoginSection: React.FC<{
    setSection: Dispatch<SetStateAction<string>>;
}> = ({ setSection }) => {
    const { toast } = useToast();
    const setUser = useAuthStore((state) => state.setUser);
    const ValidationSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password is too short"),
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

    const { loading, handleLogin: login } = useAuth();

    const handleLogin = async (values: FormValues) => {
        const { data, isError, message } = await login(
            values.email,
            values.password
        );
        if (isError) {
            toast({
                variant: "destructive",
                description: message,
            });
            return;
        }
        setUser(data.user);
    };
    return (
        <div className="mt-4 space-y-4">
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validate={validateForm}
                onSubmit={(values) => {
                    handleLogin(values);
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-base">
                            Sign in and create your analytic dashboard
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    disabled={loading}
                                />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    disabled={loading}
                                />
                            </div>
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full gap-2"
                                disabled={loading}
                            >
                                {loading && <PulseLoading />}
                                Login
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
            <div className="flex flex-col space-y-2 text-center">
                <button
                    className="text-xs underline underline-offset-4"
                    onClick={() => setSection("forgot-password")}
                >
                    Forgot your password?
                </button>
                <button
                    className="text-xs underline underline-offset-4"
                    onClick={() => setSection("signup")}
                >
                    Don't have an account? Sign up
                </button>
            </div>
        </div>
    );
};
