import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                },
            },
        }
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const nextUrl = request.nextUrl.pathname;
    const splitPathname = nextUrl.split("/");
    if (splitPathname.length === 3 && splitPathname[1] === "dashboard") {
        const { error } = await supabase.rpc("increase_dashboard_views", {
            slug: splitPathname[2],
        });
        if (error) {
            const isHome = nextUrl === "/";
            const resp = isHome
                ? NextResponse.next()
                : NextResponse.redirect(new URL("/", request.url));
            resp.cookies.delete("user");
            return resp;
        }
    }

    if (user) {
        // response.cookies.set({
        //     name: "user",
        //     value: JSON.stringify(user),
        // });
    } else {
        const blackList = ["query", "dashboard"];
        if (
            nextUrl.split("/").length === 2 &&
            blackList.includes(nextUrl.split("/")[1])
        ) {
            const isHome = nextUrl === "/";
            const resp = isHome
                ? NextResponse.next()
                : NextResponse.redirect(new URL("/", request.url));
            resp.cookies.delete("user");
            return resp;
        }
        const resp = NextResponse.next();
        resp.cookies.delete("user");
        return resp;
    }
    return response;
}
