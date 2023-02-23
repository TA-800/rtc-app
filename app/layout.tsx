"use client";

import Link from "next/link";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Add dark mode class to body
        if (localStorage.getItem("dark") === "true") {
            document.documentElement.classList.add("dark");
        }
    }, []);

    return (
        <html lang="en">
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head />
            <SessionProvider>
                <body className="">
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
                        <button onClick={toggleDark} className="btn" data-tooltip="Toggle Dark">
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
                    </Navbar>
                    <main className="w-screen h-[calc(100vh-5rem)] mt-20 p-2 text-inherit">{children}</main>
                    <UserComponent />
                </body>
            </SessionProvider>
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
            <Link href={path} data-tooltip={tooltip} className="btn">
                {children}
            </Link>
        </li>
    );
}

// User component
function UserComponent() {
    const { data: session } = useSession();

    return (
        <div className="fixed min-w-max md:min-w-0 bottom-2 md:left-2 md:-translate-x-0 left-1/2 -translate-x-1/2 flex scale-90 flex-row items-center justify-center gap-4 border-2 border-white border-opacity-25 bg-black bg-opacity-25 p-4 backdrop-blur-sm transition hover:scale-100">
            {session && (
                <>
                    <img src={session.user!.image as string} className="h-12 w-12 rounded-full border-2 border-white/25" />
                    <div className="flex flex-col gap-1">
                        <span className="text-lg font-semibold">{session!.user!.name}</span>
                        {session.user!.username !== session.user!.name && (
                            <span className="text-sm font-light">{session!.user!.username}</span>
                        )}
                    </div>
                </>
            )}
            {!session && (
                <>
                    <Link href="/account" className="btn" data-tooltip="Sign In">
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
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                            />
                        </svg>
                    </Link>
                    <span>Not signed in</span>
                </>
            )}
        </div>
    );
}

function toggleDark() {
    // Toggle dark mode
    document.documentElement.classList.toggle("dark");
    // Add to local storage the preference
    localStorage.setItem("dark", document.documentElement.classList.contains("dark") ? "true" : "false");
}
