"use client";

import {
    EnvelopeClosedIcon,
    GitHubLogoIcon,
    TwitterLogoIcon,
} from "@radix-ui/react-icons";
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
import { useState } from "react";

export const ModalLogin = () => {
    const [section, setSection] = useState<string>("login");

    return (
        <Dialog onOpenChange={() => setSection("login")}>
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
                        {section === "signup" && <SignUpSection />}
                        {section === "forgot-password" && (
                            <ForgotPasswordSection />
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
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

const SignUpSection = () => {
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
            <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="Email" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type="password"
                        id="password"
                        placeholder="Password"
                    />
                </div>
                <Button variant="default" size="sm" className="w-full">
                    Sign Up
                </Button>
            </div>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="space-x-2">
                    <EnvelopeClosedIcon />
                    <div>Google</div>
                </Button>
                <Button variant="outline" size="sm" className="space-x-2">
                    <GitHubLogoIcon />
                    <div>Github</div>
                </Button>
                <Button variant="outline" size="sm" className="space-x-2">
                    <TwitterLogoIcon />
                    <div>Twitter (X)</div>
                </Button>
            </div>
        </div>
    );
};

const LoginSection: React.FC<{
    setSection: Dispatch<SetStateAction<string>>;
}> = ({ setSection }) => {
    return (
        <div className="mt-4 space-y-4">
            <form action="" className="space-y-4">
                <div className="text-base">
                    Sign in and create your analytic dashboard
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="space-x-2">
                        <EnvelopeClosedIcon />
                        <div>Google</div>
                    </Button>
                    <Button variant="outline" size="sm" className="space-x-2">
                        <GitHubLogoIcon />
                        <div>Github</div>
                    </Button>
                    <Button variant="outline" size="sm" className="space-x-2">
                        <TwitterLogoIcon />
                        <div>Twitter (X)</div>
                    </Button>
                </div>
                <Separator />
                <div className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="Email" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="Password"
                        />
                    </div>
                    <Button variant="default" size="sm" className="w-full">
                        Login
                    </Button>
                </div>
            </form>
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
