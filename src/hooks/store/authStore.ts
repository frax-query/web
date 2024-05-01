import { create } from "zustand";
import type { IUser } from "@/types";

export const useAuthStore = create<IUser>()((set) => ({
    user: null,
    setUser: (newUser) => set(() => ({ user: newUser })),
}));
