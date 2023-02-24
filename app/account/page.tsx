"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { FirstTimeUserDialog } from "./FirstTimeUserDialog";

export default function Account() {
    const { data: session } = useSession();
    const [newUser, setNewUser] = useState(false);

    useEffect(() => {
        if (session) {
            // Check if user is in database. If exists, update their data. If not, create a new user.
            // Checking is done by checking if username is null in the session (which retrieves the username (or null if not present) from supabase)
            // For more information, check [...nextauth].js and their callbacks
            if (session.user!.username) {
                // User is in database.
                console.log("User exists.");
                console.log("%cSuccess: " + session.user!.username, "color: yellow; font-size: 1.5rem;");
            } else {
                // User is not in database. Create a new user.
                console.log("User does not exist.");
                setNewUser(true);
            }
        }
    }, [session]);

    return (
        <>
            <h2>Account</h2>
            {!session && (
                <>
                    <p>Sign in to start accessing rooms and talking to others!</p>
                    <br />
                    <div className="flex flex-row gap-2">
                        <button className="nav-btn" data-tooltip="Sign in (Google)" onClick={() => signIn("google")}>
                            <img
                                src="https://img.icons8.com/ios-filled/512/google-logo.png"
                                height="24px"
                                width="24px"
                                alt="Google Logo"
                                className="dark:invert dark:filter"
                            />
                        </button>
                        <button className="nav-btn" data-tooltip="Sign in (Discord)" onClick={() => signIn("discord")}>
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
                    {newUser && <FirstTimeUserDialog email={session.user!.email as string} />}
                    <p>Okay, great! You are signed in.</p>
                    <p>
                        {session.user!.email} as {session.user!.name}
                    </p>
                    <img src={session.user!.image as string} className="border-2 border-white border-opacity-25" />
                    <br />
                    <button className="nav-btn" data-tooltip="Sign out" onClick={() => signOut()}>
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
