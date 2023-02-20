"use client";

import { useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();

    return (
        <div className="flex justify-center items-center w-full h-full pb-[5.875rem]">
            {!session && <h3>Hi. Sign up to get started!</h3>}
            {session && <Start />}
        </div>
    );
}

function Start() {
    return (
        <div className="bg-black w-full max-w-xs bg-opacity-25 border-white border-opacity-10 border-2 p-2 grid grid-flow-row place-content-center gap-4">
            <div className="flex flex-row gap-2 items-center">
                <button className="btn btn-small btn-rounded" data-tooltip="Rejoin room">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M4.75 3A1.75 1.75 0 003 4.75v2.752l.104-.002h13.792c.035 0 .07 0 .104.002V6.75A1.75 1.75 0 0015.25 5h-3.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H4.75zM3.104 9a1.75 1.75 0 00-1.673 2.265l1.385 4.5A1.75 1.75 0 004.488 17h11.023a1.75 1.75 0 001.673-1.235l1.384-4.5A1.75 1.75 0 0016.896 9H3.104z" />
                    </svg>
                </button>
                <span className="opacity-75">Rejoin an old room.</span>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <button className="btn btn-small btn-rounded" data-tooltip="Join new">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path
                            fillRule="evenodd"
                            d="M3.75 3A1.75 1.75 0 002 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-8.5A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM10 8a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
                <span className="opacity-75">Join a new room.</span>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <button className="btn btn-small btn-rounded" data-tooltip="Create Room">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
                <span className="opacity-75">Create a new room.</span>
            </div>
        </div>
    );
}
