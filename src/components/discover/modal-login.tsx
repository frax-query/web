"use client";

import { Logo } from "../logo";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import React, { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
import { ForgotPasswordSection } from "../auth/forgot-password";
import { SignUpSection } from "../auth/signup";
import { LoginSection } from "../auth/login";
import { VerifySignUp } from "../auth/verify-signup";
import { VerifyPasswordRecovery } from "../auth/verify-password-recovery";
import { ChangePassword } from "../auth/change-password";

export const ModalLogin: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [section, setSection] = useState<string>("login");
    const [email, setEmail] = useState<string>("");
    const matches = useMediaQuery("(min-width: 768px)");
    if (matches) {
        return (
            <Dialog
                onOpenChange={() => {
                    setSection("login");
                    setEmail("");
                }}
            >
                <DialogTrigger asChild>{children}</DialogTrigger>
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
                                <ForgotPasswordSection
                                    setSection={setSection}
                                    setEmail={setEmail}
                                />
                            )}
                            {section === "verify" && (
                                <VerifySignUp email={email} />
                            )}
                            {section === "verify-password" && (
                                <VerifyPasswordRecovery
                                    email={email}
                                    setSection={setSection}
                                />
                            )}
                            {section === "change-password" && (
                                <ChangePassword setSection={setSection} />
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    } else {
        return (
            <Drawer onOpenChange={() => setSection("login")}>
                <DrawerTrigger asChild>{children}</DrawerTrigger>
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
                                <ForgotPasswordSection
                                    setSection={setSection}
                                    setEmail={setEmail}
                                />
                            )}
                            {section === "verify" && (
                                <VerifySignUp email={email} />
                            )}
                            {section === "verify-password" && (
                                <VerifyPasswordRecovery
                                    email={email}
                                    setSection={setSection}
                                />
                            )}
                            {section === "change-password" && (
                                <ChangePassword setSection={setSection} />
                            )}
                        </DrawerDescription>
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>
        );
    }
};
