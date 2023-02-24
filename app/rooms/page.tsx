"use client";

import supabase from "@/utils/supabase";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Room = {
    id: string;
    name: string;
};

export default function Room() {
    const { data: session } = useSession();
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {}, []);

    return (
        <>
            <h2>Rooms</h2>
            <p>Here are all the rooms you can join.</p>
        </>
    );
}
