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
        console.log(error);
    }
    if (data) {
        console.log("%Signing in with Google", "color: yellow; font-weight: bold; font-size: 1.5rem;");
        console.log(data);
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
        console.log(error);
    }
    if (data) {
        console.log("%Signing in with Discord", "color: yellow; font-weight: bold; font-size: 1.5rem;");
        console.log(data);
    }
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log("%cError signing out", "color: red; font-weight: bold; font-size: 1.5rem;");
        console.log(error);
    } else {
        // Refresh the page to clear the user session object
        window.location.reload();
    }
}

export default function Account() {
    const user = useUser();

    useEffect(() => {
        console.log("%cUser", "color: green; font-weight: bold; font-size: 1.5rem;");
        console.log(user);
    }, [user]);

    return (
        <>
            <h2>Account</h2>
            {!user && (
                <>
                    <p>Sign in to start accessing rooms and talking to others!</p>
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
            )}
            {user && (
                <>
                    <p>Sign out to stop accessing rooms and talking to others.</p>
                    <br />
                    <p>User ID: {user.id}</p>
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
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                            />
                        </svg>
                    </button>
                </>
            )}
        </>
    );
}
