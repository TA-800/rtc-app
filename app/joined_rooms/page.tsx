"use client";

import { Database } from "@/utils/schema";
import supabase from "@/utils/supabase";
import useUser from "@/utils/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

async function getRooms(user_id: string) {
    return await supabase.rpc("get_joined_rooms", { user_id_input: user_id });
}

type Room = Database["public"]["Tables"]["rooms"]["Row"];
type ModifiedRoom = Room & { new_messages_count: number };

export default function Rooms() {
    const [rooms, setRooms] = useState<ModifiedRoom[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 1000);
    const [filteredRooms, setFilteredRooms] = useState<ModifiedRoom[]>([]);

    const { user } = useUser();
    const router = useRouter();

    // Get the rooms that the user has joined, and also get number of new messages for each room since the last time the user visited the room
    useEffect(() => {
        if (user) {
            getRooms(user.id).then(({ data, error }) => {
                if (error) {
                    console.log("%cError getting rooms", "color: red; font-weight: bold; font-size: 1.5rem;");
                    console.log(error);
                }
                if (data) {
                    console.log("%cRooms obtained!", "color: green; font-weight: bold; font-size: 1.5rem;");
                    // For each room, get the last message time and the new messages count
                    data.forEach(async (room) => {
                        // time is the last message time for the currently iterated room
                        let time: Date | null = null;
                        // last_message_times is the array of last message times for all rooms
                        const last_message_times = JSON.parse(localStorage.getItem("last_message_times") ?? "null");

                        let room_index = -1;

                        // If the last message times array exists
                        if (last_message_times) {
                            // Find the index of the currently iterated room in the array
                            // using the room id and the user id as the search criteria
                            room_index = last_message_times.findIndex(
                                ({ room_id, user_id }: { room_id: string; user_id: string }) =>
                                    room_id === room.id && user_id === user.id
                            );
                            // If the room is found in the array
                            if (room_index !== -1) {
                                // Get the last message time for the currently iterated room and store it in time variable
                                time = last_message_times[room_index].time_iso;
                            }
                        }

                        // Get count of messages that are newer than the last message time for the currently iterated room
                        const { data: new_messages_count, error } = await supabase.rpc("get_new_messages_count", {
                            // If either last message times array didn't exist or the currently iterated room wasn't found in the array
                            // then set the last message time to the current time (which will retrieve no messages)
                            time_iso: time ? time.toString() : new Date().toISOString(),
                            room_id_input: room.id,
                        });
                        // Add the new messages count to the currently iterated room in the rooms state array
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

    // Filters the rooms based on the search query
    useEffect(() => {
        setFilteredRooms(rooms.filter((room) => room.name.toLowerCase().includes(debouncedSearch.toLowerCase())));
    }, [rooms, debouncedSearch]);

    async function joinRoom(room_id: string) {
        router.push(`/room/${room_id}`);
    }

    return (
        <div className="flex flex-col gap-9">
            <h1>Joined Rooms</h1>
            <div className="flex flex-col gap-2">
                <input
                    name="search"
                    placeholder="🔍 Search for joined rooms..."
                    className="text-black border-2 border-blue-600 border-opacity-25 rounded w-full p-2"
                    onChange={(e) => setSearch(e.target.value)}
                />
                {debouncedSearch && (
                    <span>
                        Search results for
                        <span className="font-bold"> {debouncedSearch}</span>
                    </span>
                )}
            </div>
            <ul className="flex flex-col gap-6">
                {filteredRooms
                    ?.sort((a, b) => b.new_messages_count - a.new_messages_count)
                    .map((room) => {
                        return (
                            <li key={room.id} className="flex flex-col gap-2">
                                <div className="flex flex-row items-center gap-3">
                                    <h3 className={room.new_messages_count > 0 ? "font-bold" : ""}>{room.name}</h3>
                                    {room.new_messages_count > 0 && (
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
        </div>
    );
}
