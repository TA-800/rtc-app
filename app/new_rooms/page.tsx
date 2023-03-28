"use client";

import supabase from "@/utils/supabase";
import useUser from "@/utils/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Database } from "@/utils/schema";

export async function getRooms(user_id: string) {
    return await supabase.rpc("get_unjoined_rooms", { user_id_input: user_id });
}

// type Rooms = Awaited<ReturnType<typeof getRooms>>;
type Room = Database["public"]["Tables"]["rooms"]["Row"];

export default function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            getRooms(user.id).then(({ data, error }) => {
                if (error) {
                    console.log("%cError getting rooms", "color: red; font-weight: bold; font-size: 1.5rem;");
                    console.log(error);
                }
                if (data) {
                    console.log("%cRooms obtained!", "color: green; font-weight: bold; font-size: 1.5rem;");
                    console.log(data);
                    setRooms(data);
                }
            });
        }
    }, [user]);

    async function joinRoom(room_id: string) {
        const { data } = await supabase.rpc("join_room", { user_id_input: user!.id, room_id_input: room_id });
        console.log("%cData from RPC", "color: green; font-weight: bold; font-size: 1.5rem;");
        console.log(data);
        router.push(`/room/${room_id}`);
    }

    return (
        <>
            <h1>New Rooms</h1>
            <br />
            <ul className="flex flex-col gap-6">
                {rooms?.map((room) => (
                    <li key={room.id} className="flex flex-col gap-2">
                        <div>
                            <h2>{room.name}</h2>
                            <p className="opacity-60">{room.description}</p>
                        </div>
                        <button className="action-btn" onClick={() => joinRoom(room.id)}>
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
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                            </svg>
                            Join
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}
