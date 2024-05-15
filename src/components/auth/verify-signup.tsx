"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useCountdown } from "usehooks-ts";
import { PulseLoading } from "../pulse-loading";
import { Button } from "../ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "../ui/input-otp";
import { useToast } from "../ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const VerifySignUp: React.FC<{ email: string }> = ({ email }) => {
    const [otp, setOtp] = useState("");
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

    const { loading, handleSignupResend, verifyOtp } = useAuth();

    const resendOtp = async (email: string) => {
        const { isError, message } = await handleSignupResend(email);
        if (isError) {
            toast({
                variant: "destructive",
                description: message,
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
        const client = createClient();
        const { data, isError, message } = await verifyOtp(email, "email", otp);
        if (isError) {
            toast({
                variant: "destructive",
                description: message,
            });
            return;
        }
        await client.auth.setSession({
            access_token: data.session?.access_token as string,
            refresh_token: data.session?.refresh_token as string,
        });
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
