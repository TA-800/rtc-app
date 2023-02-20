"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { FirstTimeUserDialog } from "../test/page";
import supabase from "@/utils/supabase";

export default function Account() {
    const { data: session } = useSession();
    const [newUser, setNewUser] = useState(false);

    useEffect(() => {
        if (session) {
            // Check if user is in database. If exists, update their data. If not, create a new user.
            supabase
                .from("users")
                .select()
                .match({ email: session.user!.email })
                .maybeSingle()
                .then(({ data, error }) => {
                    if (error) console.log("%cError: " + (error.details || error.message), "color: red; font-size: 1.5rem;");
                    else {
                        if (data) {
                            // User exists. Update their data.
                            console.log("User exists.");
                            supabase.from("users").update({ is_online: true }).match({ email: session.user!.email });
                        } else {
                            // User doesn't exist. Prompt for username and then create a new user.
                            console.log("User doesn't exist.");
                            setNewUser(true);
                        }
                    }
                });
        }
    }, [session]);

    return (
        <>
            <h2>Account</h2>
            {!session && (
                <>
                    <p>Unfortunately, you aren't signed in. Wanna do that?</p>
                    <br />
                    <div className="flex flex-row gap-2">
                        <button className="btn" data-tooltip="Sign in (Google)" onClick={() => signIn("google")}>
                            <img
                                src="https://img.icons8.com/ios-filled/512/google-logo.png"
                                height="24px"
                                width="24px"
                                alt="Google Logo"
                                className="dark:invert dark:filter"
                            />
                        </button>
                        <button className="btn" data-tooltip="Sign in (Discord)" onClick={() => signIn("discord")}>
                            <img
                                src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg"
                                height="24px"
                                width="24px"
                                alt="Discord Logo"
                                className="dark:invert dark:filter"
                            />
                        </button>
                    </div>
                </>
            )}
            {session && (
                <>
                    {newUser && <FirstTimeUserDialog email={session.user?.email as string} />}
                    <p>Okay, great! You are signed in.</p>
                    <p>
                        {session.user?.email} as {session.user?.name}
                    </p>
                    <img src={session.user?.image as string} className="border-2 border-white border-opacity-25" />
                    <br />
                    <button className="btn" data-tooltip="Sign out" onClick={() => signOut()}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                            />
                        </svg>
                    </button>
                </>
            )}
        </>
    );
}
