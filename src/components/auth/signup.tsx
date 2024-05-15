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

export const SignUpSection: React.FC<{
    setSection: Dispatch<SetStateAction<string>>;
    setEmail: Dispatch<SetStateAction<string>>;
}> = ({ setSection, setEmail }) => {
    const { toast } = useToast();
    const ValidationSchema = z
        .object({
            fullname: z
                .string()
                .min(3, "Fullname is too short")
                .max(20, "Fullname is too long"),
            username: z
                .string()
                .regex(/^[a-z0-9]+$/, "Must be alphanumeric and lowercase")
                .min(3, "Username is too short")
                .max(20, "Username is too long"),
            email: z.string().email("Invalid email address"),
            password: z.string().min(8, "Password is too short"),
            confirm_password: z.string(),
        })
        .refine(
            (values) => {
                return values.password === values.confirm_password;
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

    const { loading, handleSignup: signupclient } = useAuth();

    const signup = async (values: FormValues) => {
        return await signupclient(
            values.email,
            values.password,
            values.username,
            values.fullname
        );
    };

    const handleSignUp = async (values: FormValues) => {
        const { isError, message } = await signup(values);
        if (isError) {
            toast({
                variant: "destructive",
                description: message,
            });
            return;
        }
        toast({
            variant: "default",
            title: "OTP Sent!",
            description: "We have sent OTP to your email",
        });
        setEmail(values.email);
        setSection("verify");
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="text-center">
                <div className="tracking-light text-xl font-semibold">
                    Create Account
                </div>
                <div className="text-sm text-muted-foreground">
                    Enter your email below to create your account
                </div>
            </div>
            <Formik
                initialValues={{
                    fullname: "",
                    username: "",
                    email: "",
                    password: "",
                    confirm_password: "",
                }}
                validate={validateForm}
                onSubmit={(values) => {
                    handleSignUp(values);
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="fullname">Fullname</Label>
                            <Input
                                type="text"
                                id="fullname"
                                name="fullname"
                                placeholder="Your fullname"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.fullname}
                                disabled={loading}
                            />
                            <ErrorMessage
                                name="fullname"
                                component="div"
                                className="text-sm text-red-600"
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Your username"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.username}
                                disabled={loading}
                            />
                            <ErrorMessage
                                name="username"
                                component="div"
                                className="text-sm text-red-600"
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                disabled={loading}
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-sm text-red-600"
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
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
