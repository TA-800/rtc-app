"use client";

import supabase from "@/utils/supabase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Room = {
    created_at: string;
    id: string;
    name: string;
};

export default function Room() {
    const { data: session } = useSession();
    const [rooms, setRooms] = useState<Room[]>([]);
    const router = useRouter();

    useEffect(() => {
        supabase
            .from("rooms")
            .select()
            .then(({ data, error }) => {
                if (error) console.log(error);
                else setRooms(data);
            });
    }, []);

    return (
        <>
            <h2>Rooms</h2>
            <p>Here are all the rooms you can join.</p>
            <br />
            <div className="flex flex-col gap-2">
                {rooms.map((room) => (
                    <div key={room.id} className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <p className="text-lg">{room.name}</p>
                            <p className="text-sm text-gray-500">{room.created_at}</p>
                        </div>
                        <button onClick={() => router.push(`/rooms/${room.id}`)} className="action-btn" data-tooltip="Join room">
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
                                    d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
                                />
                            </svg>
                            <span className="opacity-75">Join</span>
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}
