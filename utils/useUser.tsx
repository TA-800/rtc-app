import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import supabase from "./supabase";

export default function useUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) console.log("%cError retrieving session: ", "color: red; font-size: 1.25rem;", error);
            setUser(session?.user ?? null);
        });

        // Use useEffect to set up a listener for auth state changes
        supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") setUser(null);
        });
    }, []);

    return user;
}
