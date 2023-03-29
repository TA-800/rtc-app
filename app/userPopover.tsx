import React from "react";
import * as Popover from "@radix-ui/react-popover";
import useUser from "@/utils/useUser";
import supabase from "@/utils/supabase";
import { useRouter } from "next/navigation";

export default function UserPopover({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.log("%cError signing out: ", "color: red; font-size: 1.25rem;", error);
        else {
            router.push("account");
        }
    };

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                {/* This will be the user image component */}
                <button>{children}</button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="z-50 rounded p-3 border-2 border-black/25 bg-white text-black will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade">
                    <div className="flex flex-col gap-2.5">
                        {user ? (
                            <>
                                <p className="mb-2.5 opacity-60">Signed In</p>
                                <div className="flex flex-row gap-2 items-center">
                                    <strong>{user.user_metadata.full_name}</strong>
                                    <button
                                        onClick={handleSignOut}
                                        className="nav-btn !bg-gray-300 !text-black !p-0 !w-10 !h-10"
                                        data-tooltip="Sign Out">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="w-5 h-5">
                                            <path
                                                fillRule="evenodd"
                                                d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                                                clipRule="evenodd"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="whitespace-pre-wrap opacity-60">{"Not signed in     "}</p>
                                <button
                                    onClick={() => router.push("account")}
                                    className="nav-btn !bg-gray-300 !text-black !p-0 !w-10 !h-10"
                                    data-tooltip="Sign In">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5">
                                        <path
                                            fillRule="evenodd"
                                            d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                                            clipRule="evenodd"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                    <Popover.Close
                        className="rounded-full inline-flex items-center justify-center absolute top-[10px] right-[5px] opacity-50 hover:opacity-100 focus:outline-2 focus:outline-blue-500"
                        aria-label="Close">
                        {/* Close Icon */}
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
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </Popover.Close>
                    <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
