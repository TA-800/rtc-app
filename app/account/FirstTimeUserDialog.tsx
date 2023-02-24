"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import supabase from "@/utils/supabase";
import { signOut } from "next-auth/react";

export function FirstTimeUserDialog({ email }: { email: string }) {
    const [open, setOpen] = useState(true);
    const [username, setUsername] = useState("");

    const handleSubmit = () => {
        console.log("Submitting username with value: " + username);
        supabase
            .from("users")
            .insert({ username: username, email: email })
            .select() // Return the data back to the client after inserting it.
            .single()
            .then(({ data, error }) => {
                if (error) console.log("%cError: " + (error.details || error.message), "color: red; font-size: 1.5rem;");
                else {
                    console.log("%cSuccess: " + data.username, "color: green; font-size: 1.5rem;");
                    // Next-auth does not have a straightforward way to update/mutate the session data, so we have to sign out and sign back in.
                    // https://github.com/nextauthjs/next-auth/discussions/4229
                    signOut();
                }
            });
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="bg-slate-900 px-4 py-2 text-white">Open</button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content
                    onInteractOutside={(e) => e?.preventDefault()}
                    className="rounded-md dark:bg-white dark:text-black bg-black text-white h-fit w-80 px-4 py-4 fixed inset-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
                    <Dialog.Title className="m-0">Edit Profile</Dialog.Title>
                    <Dialog.Description className="opacity-50">
                        Specify a preferred, unique display username (or use your email or real name). You will need to sign in
                        again once you save.
                    </Dialog.Description>
                    <br />
                    <label className="block" htmlFor="username">
                        Username
                    </label>
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        className="block border-2 border-black/50 rounded-md p-2 text-black"
                        autoComplete="off"
                        type="text"
                        id="username"
                    />
                    <AnimatePresence>
                        {username && (
                            <Dialog.Close asChild>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{
                                        opacity: 0,
                                        transition: {
                                            duration: 0.2,
                                        },
                                    }}
                                    onClick={handleSubmit}
                                    className="focus:outline focus:outline-2 focus:outline-black flex flex-row gap-2 items-center justify-center bg-blue-600 w-max p-2 text-white ml-auto rounded-md">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5">
                                        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                                        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                                    </svg>
                                    <span>Save Changes</span>
                                </motion.button>
                            </Dialog.Close>
                        )}
                    </AnimatePresence>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
