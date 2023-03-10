import React from "react";
import * as Popover from "@radix-ui/react-popover";
import useUser from "@/utils/useUser";

export default function UserPopover({ children }: { children: React.ReactNode }) {
    const user = useUser();

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                {/* This will be the user image component */}
                <button>{children}</button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="z-50 rounded p-5 border-2 border-black/25 bg-white text-black will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade">
                    <div className="flex flex-col gap-2.5">
                        {user ? (
                            <>
                                <p className="text-mauve12 text-[15px] leading-[19px] font-medium mb-2.5">Signed In</p>
                                <p>{user.user_metadata.full_name}</p>
                            </>
                        ) : (
                            <>
                                <p className="text-mauve12 text-[15px] leading-[19px] font-medium mb-2.5">Not signed In</p>
                                <p>Not signed in</p>
                            </>
                        )}
                    </div>
                    <Popover.Close
                        className="rounded-full inline-flex items-center justify-center absolute top-[5px] right-[5px] opacity-50 hover:opacity-100 focus:outline-2 focus:outline-blue-500"
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
