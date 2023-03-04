"use client";

import supabase from "@/utils/supabase";
import useUser from "@/utils/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export async function getRooms(user_id: string) {
    // select rooms in which the user is not a member
    // select room id, room name from rooms table where room id is in rooms_users table where user id is not equal to current user id
    // return await supabase.from("rooms_users").select("*, rooms (id, name)").neq("user_id", user_id);
    return await supabase.rpc("get_unjoined_rooms", { user_id_input: user_id });
}

type Rooms = Awaited<ReturnType<typeof getRooms>>;

export default function Rooms() {
    const [rooms, setRooms] = useState<Rooms["data"]>([]);
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
        console.table({ room_id, user_id: user!.id });
        const { data } = await supabase.rpc("join_room", { user_id_input: user!.id, room_id_input: room_id });
        console.log("%cData from RPC", "color: green; font-weight: bold; font-size: 1.5rem;");
        console.log(data);
        router.push(`/${room_id}`);
    }

    return (
        <>
            <h1>New Rooms</h1>
            <br />
            <ul className="flex flex-col gap-4">
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
                                    d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
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
