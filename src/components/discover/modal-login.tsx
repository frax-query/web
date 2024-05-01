"use client";

import { Logo } from "../logo";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useCountdown, useMediaQuery } from "usehooks-ts";
import { ZodError, z } from "zod";
import { ErrorMessage, Formik } from "formik";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "../ui/input-otp";
import { checkUsername, createClient } from "@/lib/supabase/client";
import { useToast } from "../ui/use-toast";
import { PulseLoading } from "../pulse-loading";
import { useAuthStore } from "@/hooks/store/authStore";

export const ModalLogin = () => {
    const [section, setSection] = useState<string>("verify");
    const [email, setEmail] = useState<string>("");
    const matches = useMediaQuery("(min-width: 768px)");
    if (matches) {
        return (
            <Dialog onOpenChange={() => setSection("verify")}>
                <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="max-h-7">
                        Login
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            <Logo />
                        </DialogTitle>
                        <DialogDescription className="text-foreground">
                            {section === "login" && (
                                <LoginSection setSection={setSection} />
                            )}
                            {section === "signup" && (
                                <SignUpSection
                                    setSection={setSection}
                                    setEmail={setEmail}
                                />
                            )}
                            {section === "forgot-password" && (
                                <ForgotPasswordSection />
                            )}
                            {section === "verify" && (
                                <VerifySignUp email={email} />
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    } else {
        return (
            <Drawer onOpenChange={() => setSection("login")}>
                <DrawerTrigger asChild>
                    <Button variant="default" size="sm" className="max-h-7">
                        Login
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="w-full p-4">
                    <DrawerHeader>
                        <DrawerTitle>
                            <Logo />
                        </DrawerTitle>
                        <DrawerDescription className="text-foreground">
                            {section === "login" && (
                                <LoginSection setSection={setSection} />
                            )}
                            {section === "signup" && (
                                <SignUpSection
                                    setSection={setSection}
                                    setEmail={setEmail}
                                />
                            )}
                            {section === "forgot-password" && (
                                <ForgotPasswordSection />
                            )}
                            {section === "verify" && (
                                <VerifySignUp email={email} />
                            )}
                        </DrawerDescription>
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>
        );
    }
};

const ForgotPasswordSection = () => {
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
            <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="Email" />
                </div>
                <Button variant="default" size="sm" className="w-full">
                    Reset Password
                </Button>
            </div>
        </div>
    );
};

const SignUpSection: React.FC<{
    setSection: Dispatch<SetStateAction<string>>;
    setEmail: Dispatch<SetStateAction<string>>;
}> = ({ setSection, setEmail }) => {
    const [loading, setLoading] = useState(false);
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

    const signup = async (values: FormValues) => {
        const client = createClient();
        return await client.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: {
                    username: values.username,
                    full_name: values.fullname,
                },
            },
        });
    };

    const handleSignUp = async (values: FormValues) => {
        setLoading(true);
        const isUsernameExist = await checkUsername(values.username);
        if (isUsernameExist) {
            toast({
                variant: "destructive",
                title: "Username exist!",
                description: "please user another username",
            });
            return;
        }
        const { error } = await signup(values);
        if (error) {
            toast({
                variant: "destructive",
                title: error.code,
                description: error.message,
            });
            return;
        }
        toast({
            variant: "default",
            title: "OTP Sent!",
            description: "We have sent OTP to your email",
        });
        setEmail(values.email);
        setLoading(false);
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

const LoginSection: React.FC<{
    setSection: Dispatch<SetStateAction<string>>;
}> = ({ setSection }) => {
    const [loading, setLoading] = useState(false);
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
    const handleLogin = async (values: FormValues) => {
        setLoading(true);
        const client = createClient();
        const { data, error } = await client.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        });
        if (error) {
            toast({
                variant: "destructive",
                title: error.code,
                description: error.message,
            });
            setLoading(false);
            return;
        }
        await client.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        });
        setUser(data.user);
        setLoading(false);
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

const VerifySignUp: React.FC<{ email: string }> = ({ email }) => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [count, { startCountdown, resetCountdown, stopCountdown }] =
        useCountdown({
            countStart: 60,
            intervalMs: 1000,
        });
    useEffect(() => {
        (() => {
            startCountdown();
        })();
    }, []);
    useEffect(() => {
        if (count === 0) {
            stopCountdown();
        }
    }, [count]);
    const resendOtp = async (email: string) => {
        const client = createClient();
        const { error } = await client.auth.resend({
            email: email,
            type: "signup",
        });
        if (error) {
            toast({
                variant: "destructive",
                title: error.code,
                description: error.message,
            });
            return;
        }
        toast({
            variant: "default",
            title: "Otp sent!",
            description: "We have send you the otp",
        });
        resetCountdown();
        startCountdown();
    };
    const handleOtp = async (otp: string) => {
        setLoading(true);
        const client = createClient();
        const { data, error } = await client.auth.verifyOtp({
            email: email,
            token: otp,
            type: "email",
        });
        if (error) {
            toast({
                variant: "destructive",
                title: error.name,
                description: error.message,
            });
            setLoading(false);
            return;
        }
        await client.auth.setSession({
            access_token: data.session?.access_token as string,
            refresh_token: data.session?.refresh_token as string,
        });
        setLoading(false);
        window.location.reload();
    };
    return (
        <div className="mt-4 space-y-4">
            <div className="text-xl font-bold tracking-tight">
                OTP Verification
            </div>
            <div>
                We have sent an One Time Password (OTP) to your email address
            </div>
            <InputOTP
                maxLength={6}
                onChange={(e) => setOtp(e)}
                disabled={loading}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <div className="text-muted-foreground">
                Didn't receive the OTP ?{" "}
                <span
                    className={`cursor-pointer ${count === 0 ? "text-foreground" : "text-muted-foreground"} underline underline-offset-4`}
                    onClick={() => count === 0 && resendOtp(email)}
                >
                    Resend
                </span>{" "}
                in {String(Math.floor(count / 60)).padStart(2, "0")}:
                {String(count % 60).padStart(2, "0")}
            </div>
            <Button
                className="w-full gap-2"
                variant="default"
                size="sm"
                onClick={() => handleOtp(otp)}
                disabled={loading}
            >
                {loading && <PulseLoading />}
                Submit
            </Button>
        </div>
    );
};
