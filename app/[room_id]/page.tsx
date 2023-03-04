"use client";
import supabase from "@/utils/supabase";
import useUser from "@/utils/useUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

async function getRoom(room_id: string) {
    return await supabase.from("rooms").select().eq("id", room_id).single();
}

async function getMessages(room_id: string) {
    return await supabase.from("messages").select().eq("room_id", room_id);
}

type Room = Awaited<ReturnType<typeof getRoom>>;
type Messages = Awaited<ReturnType<typeof getMessages>>;

export default function Room({ params: { room_id } }: { params: { room_id: string } }) {
    const user = useUser();
    const [room, setRoom] = useState<Room["data"]>();
    const [messages, setMessages] = useState<Messages["data"]>();

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

        getMessages(room_id).then(({ data, error }) => {
            if (error) {
                console.log("%cError getting messages", "color: red; font-weight: bold; font-size: 1.5rem;");
                console.log(error);
            }
            if (data) {
                console.log("%cMessages obtained!", "color: green; font-weight: bold; font-size: 1.5rem;");
                setMessages(data);
            }
        });
    }, [refetch]);

    return (
        <>
            <h1>{room?.name}</h1>
            <h3 className="opacity-60">{room?.description}</h3>
            <br />
            <div>
                <ul className="flex flex-col gap-6">
                    {messages?.map((message) => (
                        <Message {...message} key={message.id} />
                    ))}
                </ul>
                <CreateMessage user={user?.user_metadata.full_name ?? ""} roomid={room_id} />
            </div>
        </>
    );
}

function Message(message: any) {
    return (
        <li className="flex flex-col gap-2">
            <p>
                <strong>{message.sender_name}</strong>
            </p>
            <div>
                <p>{message.content}</p>
                <p className="opacity-60">
                    {
                        // Date formatting
                        new Date(message.created_at).toDateString().substring(4) +
                            ", " + // Time formatting
                            new Date(message.created_at).toLocaleTimeString().substring(0, 4) +
                            " " + // AM/PM formatting
                            new Date(message.created_at).toLocaleTimeString().substring(8)
                    }
                </p>
            </div>
        </li>
    );
}

function CreateMessage({ user, roomid }: { user: string; roomid: string }) {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            content: { value: string };
        };
        console.log("user: " + user);
        if (target.content.value === "") return;
        console.log(target.content.value);
        // Send message to backend
        supabase
            .from("messages")
            .insert({ sender_name: user, content: target.content.value, room_id: roomid })
            .select()
            .then(({ data, error }) => {
                if (error) {
                    console.log("%cError sending message", "color: red; font-weight: bold; font-size: 1.5rem;");
                    console.log(error);
                }
                if (data) {
                    console.log("%cMessage sent!", "color: green; font-weight: bold; font-size: 1.5rem;");
                    console.log(data);
                    // Clear input
                    target.content.value = "";
                    window.location.reload();
                }
            });
    };

    return (
        <>
            <form className="flex flex-row gap-2 w-full fixed bottom-2 left-[2px]" onSubmit={(e) => handleSubmit(e)}>
                <input
                    autoComplete="off"
                    name="content"
                    className="border-2 border-blue-600 rounded-md w-full text-black p-2"
                    type="text"
                />
                <button className="action-btn" type="submit">
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
                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        />
                    </svg>
                    Send
                </button>
            </form>
        </>
    );
}
