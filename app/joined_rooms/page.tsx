"use client";

import supabase from "@/utils/supabase";
import useUser from "@/utils/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export async function getRooms(user_id: string) {
    // select rooms in which the user is not a member
    // select room id, room name from rooms table where room id is in rooms_users table where user id is not equal to current user id
    // return await supabase.from("rooms_users").select("*, rooms (id, name)").neq("user_id", user_id);
    return await supabase.rpc("get_joined_rooms", { user_id_input: user_id });
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
        router.push(`/${room_id}`);
    }

    return (
        <>
            <h1>Joined Rooms</h1>
            <br />
            <ul className="flex flex-col gap-6">
                {rooms?.map((room) => (
                    <li key={room.id} className="flex flex-col gap-2">
                        <h3>{room.name}</h3>
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
                                    d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3"
                                />
                            </svg>
                            Jump back in
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}
