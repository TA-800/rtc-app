"use client";

import useUser from "@/utils/useUser";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import "./globals.css";
import UserPopover from "./userPopover";
import { User } from "@supabase/supabase-js"; // Import User type from supabase-js

import { Inter } from "@next/font/google";
const inter = Inter({
    subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    const protectedPaths = ["/create_room", "/joined_rooms", "/new_rooms"];

    // Add dark mode class to body
    useEffect(() => {
        if (localStorage.getItem("dark") === "true") {
            document.documentElement.classList.add("dark");
        }
    }, []);

    // Check if the user is logged in on every protected page
    useEffect(() => {
        if (!loading && !user) {
            if (protectedPaths.includes(pathname!) || pathname!.startsWith("/room/")) {
                router.push("/account");
            }
        }
    }, [loading, pathname]);

    return (
        <html lang="en">
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head />

            <body className={inter.className + " overflow-x-hidden"}>
                <Navbar>
                    <Navitem path="/" tooltip="Home">
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
                                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                        </svg>
                    </Navitem>
                    <Navitem path="/account" tooltip="Account">
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
                                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                            />
                        </svg>
                    </Navitem>
                    <button onClick={toggleDark} className="nav-btn" data-tooltip="Toggle Dark">
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
                                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                            />
                        </svg>
                    </button>
                    <UserPopover>
                        <UserNavItem user={user} />
                    </UserPopover>
                </Navbar>
                <main className="max-w-screen h-[calc(100vh-5rem)] mt-20 p-2 text-inherit">{children}</main>
            </body>
        </html>
    );
}

// Navbar component
function Navbar({ children }: { children: React.ReactNode }) {
    return (
        <nav>
            <ul className="fixed top-0 bottom-0 z-10 flex h-20 w-full flex-row items-center justify-center gap-4 border-b-2 border-white border-opacity-25 bg-black bg-opacity-25 text-white backdrop-blur-xl">
                {children}
            </ul>
        </nav>
    );
}
// Navitem component
function Navitem({ path, tooltip, children }: { path: string; tooltip?: string; children: React.ReactNode }) {
    return (
        <li
            onClick={() => {
                // Scroll to top if already on the page
                if (window.location.pathname === path) window.scrollTo({ top: 0, behavior: "smooth" });
            }}>
            <Link href={path} data-tooltip={tooltip} className="nav-btn">
                {children}
            </Link>
        </li>
    );
}

function UserNavItem({ user }: { user: User | null }) {
    if (user) {
        return (
            <img
                src={user.user_metadata.avatar_url}
                className="h-[50px] w-[50px] rounded-sm border-2 border-black/10 dark:border-white/10"
            />
        );
    } else {
        return (
            <div className="nav-btn" data-tooltip="User Info">
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
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                </svg>
            </div>
        );
    }
}

function toggleDark() {
    // Toggle dark mode
    document.documentElement.classList.toggle("dark");
    // Add to local storage the preference
    localStorage.setItem("dark", document.documentElement.classList.contains("dark") ? "true" : "false");
}
