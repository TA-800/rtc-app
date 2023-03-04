"use client";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";

// Create a simple view that just prints out in h2 the id of the room
// which can be retrieved from the url params

async function getRoom(room_id: string) {
    return await supabase.from("rooms").select().eq("id", room_id).single();
}

type Room = Awaited<ReturnType<typeof getRoom>>;

export default function Room({ params: { room_id } }: { params: { room_id: string } }) {
    const [room, setRoom] = useState<Room["data"]>();

    useEffect(() => {
        getRoom(room_id).then(({ data, error }) => {
            if (error) {
                console.log("%cError getting room", "color: red; font-weight: bold; font-size: 1.5rem;");
                console.log(error);
            }
            if (data) {
                console.log("%cRoom obtained!", "color: green; font-weight: bold; font-size: 1.5rem;");
                setRoom(data);
            }
        });
    }, []);

    return (
        <>
            <h1>Room Name: {room?.name}</h1>
            <br />
            <h2>Room ID: {room?.id}</h2>
        </>
    );
}
