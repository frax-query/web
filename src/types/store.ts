import { type User } from "@supabase/supabase-js";

export interface IUser {
    user: User | null;
    setUser: (user: User | null) => void;
}
