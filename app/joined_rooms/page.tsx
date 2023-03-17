"use client";

import { Database } from "@/utils/schema";
import supabase from "@/utils/supabase";
import useUser from "@/utils/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export async function getRooms(user_id: string) {
    return await supabase.rpc("get_joined_rooms", { user_id_input: user_id });
}

// type Rooms = Awaited<ReturnType<typeof getRooms>>;
type Room = Database["public"]["Tables"]["rooms"]["Row"];
type ModifiedRoom = Room & { new_messages_count: number };

export default function Rooms() {
    // const [rooms, setRooms] = useState<Room[]>([]);
    const [rooms, setRooms] = useState<ModifiedRoom[]>([]);
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
                    // setRooms(data);
                    data.forEach(async (room) => {
                        let time: Date | null = null;
                        const last_message_times = JSON.parse(localStorage.getItem("last_message_times") ?? "null");
                        const room_index = last_message_times?.findIndex(
                            ({ room_id }: { room_id: string }) => room_id === room.id
                        );
                        if (room_index !== -1) {
                            time = last_message_times[room_index].time_iso;
                        }

                        const { data: new_messages_count, error } = await supabase.rpc("get_new_messages_count", {
                            time_iso: time ? time.toString() : new Date().toISOString(),
                            room_id_input: room.id,
                        });

                        console.table({
                            "room-id": room.id,
                            "last-message-time": time,
                            "new-messages-count": new_messages_count,
                        });

                        console.log("%cNew messages count", "color: green; font-weight: bold; font-size: 1.5rem;");
                        console.log(new_messages_count);
                        console.log(error);

                        setRooms((prev) => {
                            return [
                                ...prev,
                                {
                                    ...room,
                                    new_messages_count: new_messages_count!,
                                },
                            ];
                        });
                    });
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
                {rooms?.map((room) => {
                    return (
                        <li key={room.id} className="flex flex-col gap-2">
                            <div className="flex flex-row items-center gap-3">
                                {room.new_messages_count > 0 ? (
                                    <>
                                        <span className="text-2xl font-extrabold">{room.name}</span>
                                        <div className="flex flex-row gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="w-5 h-5">
                                                <path d="M4.214 3.227a.75.75 0 00-1.156-.956 8.97 8.97 0 00-1.856 3.826.75.75 0 001.466.316 7.47 7.47 0 011.546-3.186zM16.942 2.271a.75.75 0 00-1.157.956 7.47 7.47 0 011.547 3.186.75.75 0 001.466-.316 8.971 8.971 0 00-1.856-3.826z" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.94 32.94 0 003.256.508 3.5 3.5 0 006.972 0 32.933 32.933 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zm0 14.5a2 2 0 01-1.95-1.557 33.54 33.54 0 003.9 0A2 2 0 0110 16.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {room.new_messages_count}
                                        </div>
                                    </>
                                ) : (
                                    <h3>{room.name}</h3>
                                )}
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
                                        d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3"
                                    />
                                </svg>
                                Jump back in
                            </button>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
