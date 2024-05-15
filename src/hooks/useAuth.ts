import { useCallback, useState } from "react";
import type { ResponseData } from "@/types";
import type { Session, User, WeakPassword } from "@supabase/supabase-js";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);

    const resetPassword = useCallback(
        async (email: string): Promise<ResponseData<object>> => {
            let res: ResponseData<object> = {
                data: {},
                isError: false,
                message: "",
            };
            try {
                setLoading(true);
                const data = await fetch("/api/user/reset-password", {
                    method: "POST",
                    body: JSON.stringify({ email: email }),
                });
                res = await data.json();
                setLoading(false);
                return res;
            } catch (error) {
                setLoading(false);
                if (error instanceof Error)
                    return { ...res, isError: true, message: error.message };
                return { ...res, isError: true, message: "unknown error" };
            }
        },
        [setLoading]
    );

    const changePassword = useCallback(
        async (password: string): Promise<ResponseData<object>> => {
            let res: ResponseData<object> = {
                data: {},
                isError: false,
                message: "",
            };
            try {
                setLoading(true);
                const data = await fetch("/api/user/change-password", {
                    method: "POST",
                    body: JSON.stringify({ password: password }),
                });
                res = await data.json();
                setLoading(false);
                return res;
            } catch (error) {
                setLoading(false);
                if (error instanceof Error)
                    return { ...res, isError: true, message: error.message };
                return { ...res, isError: true, message: "unknown error" };
            }
        },
        [setLoading]
    );

    const handleLogin = useCallback(
        async (
            email: string,
            password: string
        ): Promise<
            ResponseData<{
                user: User | null;
                session: Session | null;
                weakPassword?: WeakPassword | null | undefined;
            }>
        > => {
            let res: ResponseData<{
                user: User | null;
                session: Session | null;
                weakPassword?: WeakPassword | null | undefined;
            }> = {
                data: { user: null, session: null },
                isError: false,
                message: "",
            };
            try {
                setLoading(true);
                const data = await fetch("/api/user/login", {
                    method: "POST",
                    body: JSON.stringify({ email: email, password: password }),
                });
                res = await data.json();
                setLoading(false);
                return res;
            } catch (error) {
                setLoading(false);
                if (error instanceof Error)
                    return { ...res, isError: true, message: error.message };
                return { ...res, isError: true, message: "unknown error" };
            }
        },
        [setLoading]
    );

    const handleSignup = useCallback(
        async (
            email: string,
            password: string,
            username: string,
            fullname: string
        ): Promise<
            ResponseData<{ user: User | null; session: Session | null }>
        > => {
            let res: ResponseData<{
                user: User | null;
                session: Session | null;
            }> = {
                data: { user: null, session: null },
                isError: false,
                message: "",
            };
            try {
                setLoading(true);
                const data = await fetch("/api/user/signup", {
                    method: "POST",
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        username: username,
                        fullname: fullname,
                    }),
                });
                res = await data.json();
                setLoading(false);
                return res;
            } catch (error) {
                setLoading(false);
                if (error instanceof Error)
                    return { ...res, isError: true, message: error.message };
                return { ...res, isError: true, message: "unknown error" };
            }
        },
        [setLoading]
    );

    const handleSignupResend = useCallback(
        async (email: string): Promise<ResponseData<object>> => {
            let res: ResponseData<object> = {
                data: {},
                isError: false,
                message: "",
            };
            try {
                setLoading(true);
                const data = await fetch("/api/user/signup/resend", {
                    method: "POST",
                    body: JSON.stringify({ email: email }),
                });
                res = await data.json();
                setLoading(false);
                return res;
            } catch (error) {
                setLoading(false);
                if (error instanceof Error)
                    return { ...res, isError: true, message: error.message };
                return { ...res, isError: true, message: "unknown error" };
            }
        },
        [setLoading]
    );

    const verifyOtp = useCallback(
        async (
            email: string,
            type: string,
            token: string
        ): Promise<
            ResponseData<{ user: User | null; session: Session | null }>
        > => {
            let res: ResponseData<{
                user: User | null;
                session: Session | null;
            }> = {
                data: { user: null, session: null },
                isError: false,
                message: "",
            };
            try {
                setLoading(true);
                const data = await fetch("/api/user/verify-otp", {
                    method: "POST",
                    body: JSON.stringify({
                        email: email,
                        type: type,
                        otp: token,
                    }),
                });
                res = await data.json();
                setLoading(false);
                return res;
            } catch (error) {
                setLoading(false);
                if (error instanceof Error)
                    return { ...res, isError: true, message: error.message };
                return { ...res, isError: true, message: "unknown error" };
            }
        },
        [setLoading]
    );

    return {
        loading,
        resetPassword,
        changePassword,
        handleLogin,
        handleSignup,
        handleSignupResend,
        verifyOtp,
    };
};
