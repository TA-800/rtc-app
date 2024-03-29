"use client";
import { useEffect } from "react";
import useUser from "@/utils/useUser";
import supabase from "@/utils/supabase";

async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: "http://localhost:3000/account",
        },
    });
    if (error) {
        console.log("%cError signing in with Google", "color: red; font-weight: bold; font-size: 1.5rem;");
    }
    if (data) {
        console.log("%Signing in with Google", "color: yellow; font-weight: bold; font-size: 1.5rem;");
    }
}

async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
            redirectTo: "http://localhost:3000/account",
        },
    });
    if (error) {
        console.log("%cError signing in with Discord", "color: red; font-weight: bold; font-size: 1.5rem;");
    }
    if (data) {
        console.log("%Signing in with Discord", "color: yellow; font-weight: bold; font-size: 1.5rem;");
    }
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log("%cError signing out", "color: red; font-weight: bold; font-size: 1.5rem;");
    } else {
        // Refresh the page to clear the user session object
        window.location.reload();
    }
}

export default function Account() {
    const { user, loading } = useUser();

    return (
        <>
            <h2 className="font-extrabold">Account</h2>
            {!loading && (
                <>
                    {!user ? (
                        <>
                            <p className="opacity-60">Sign in to start accessing rooms and talking to others!</p>
                            <br />
                            <div className="flex flex-row gap-2">
                                <button className="nav-btn" data-tooltip="Sign in (Google)" onClick={signInWithGoogle}>
                                    <img
                                        src="https://img.icons8.com/ios-filled/512/google-logo.png"
                                        height="24px"
                                        width="24px"
                                        alt="Google Logo"
                                        className="dark:invert dark:filter"
                                    />
                                </button>
                                <button className="nav-btn" data-tooltip="Sign in (Discord)" onClick={signInWithDiscord}>
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
                    ) : (
                        <>
                            <p className="opacity-60">Sign out from RTC by clicking on the button below.</p>
                            <br />
                            <div className="flex flex-row gap-4 mb-2">
                                <p className="font-bold">{user.user_metadata.full_name}</p>
                                <p className="opacity-60">{user.user_metadata.email}</p>
                            </div>
                            <button className="nav-btn" data-tooltip="Sign Out" onClick={signOut}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6">
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
            )}
        </>
    );
}
