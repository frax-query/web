import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export const checkUsername = async (username: string) => {
    const client = createClient();
    const { error, data } = await client
        .from("profiles")
        .select()
        .eq("username", username);
    if (error || data.length === 0) return false;
    return true;
};
