"use client";

import useUser from "@/utils/useUser";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
    const { user, loading } = useUser();

    return (
        <div className="flex justify-center items-center w-full h-full pb-[5.875rem]">
            <div className="absolute flex flex-col items-center gap-10 z-[-1]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-96 h-96 opacity-10">
                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                </svg>

                <span className="font-mono text-5xl font-black opacity-10">RTC Webapp</span>
            </div>

            {!loading && <>{user ? <Start /> : <h3>Sign in to get started!</h3>}</>}
        </div>
    );
}

function Start() {
    const router = useRouter();

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <motion.button
                onClick={() => {
                    router.push("/joined_rooms");
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ opacity: { duration: 0.5 } }}
                // Animate the margins after you're able to detect if we are on mobile or not
                // because it is flex-col on mobile and flex-row on desktop
                // whileHover={{ scale: 1.1, marginRight: 10 }}
                whileHover={{ scale: 1.1 }}
                className="action-btn w-52">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M4.75 3A1.75 1.75 0 003 4.75v2.752l.104-.002h13.792c.035 0 .07 0 .104.002V6.75A1.75 1.75 0 0015.25 5h-3.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H4.75zM3.104 9a1.75 1.75 0 00-1.673 2.265l1.385 4.5A1.75 1.75 0 004.488 17h11.023a1.75 1.75 0 001.673-1.235l1.384-4.5A1.75 1.75 0 0016.896 9H3.104z" />
                </svg>
                <span className="opacity-75">See joined rooms.</span>
            </motion.button>
            <motion.button
                onClick={() => {
                    router.push("/new_rooms");
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ opacity: { duration: 0.5 } }}
                whileHover={{ scale: 1.1 }}
                className="action-btn w-52"
                data-tooltip="Join new">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path
                        fillRule="evenodd"
                        d="M3.75 3A1.75 1.75 0 002 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-8.5A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM10 8a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 8z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className="opacity-75">Join a new room.</span>
            </motion.button>
            <motion.button
                onClick={() => {
                    router.push("/create_room");
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ opacity: { duration: 0.5 } }}
                whileHover={{ scale: 1.1 }}
                className="action-btn w-52"
                data-tooltip="Create Room">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className="opacity-75">Create a new room.</span>
            </motion.button>
        </div>
    );
}
