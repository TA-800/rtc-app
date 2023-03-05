"use client";
import supabase from "@/utils/supabase";
import useUser from "@/utils/useUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Database } from "@/utils/schema";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import RoomDescription from "./description";

async function getRoom(room_id: string) {
    return await supabase.from("rooms").select().eq("id", room_id).single();
}

async function getMessages(room_id: string) {
    return await supabase.from("messages").select().eq("room_id", room_id);
}

type Room = Awaited<ReturnType<typeof getRoom>>;
type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function Room({ params: { room_id } }: { params: { room_id: string } }) {
    const user = useUser();
    const [room, setRoom] = useState<Room["data"]>();
    const [messages, setMessages] = useState<Message[]>([]);

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

        // Subscribe to realtime updates
        const messagesSubscription = supabase
            .channel(`room:${room_id}`)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
                console.log("Received realtime update:", payload);
                // Update messages
                // Ignore TS error from line below because payload isn't typed correctly... ?
                // @ts-ignore
                setMessages((messages) => [...messages, payload.new]);
            })
            .subscribe();

        return () => {
            messagesSubscription.unsubscribe();
        };
    }, []);

    return (
        <>
            <div className="flex flex-col gap-1">
                <h1>{room?.name}</h1>
                <RoomDescription description={room?.description ?? ""} />
            </div>
            <br />
            <MessagesScrollList messages={messages} />
            <CreateMessage user={user?.user_metadata.full_name ?? ""} roomid={room_id} />
        </>
    );
}

function MessagesScrollList({ messages }: { messages: Message[] }) {
    return (
        <ScrollArea.Root className="text-black lg:w-3/4 w-full h-[calc(100vh-270px)] rounded overflow-hidden bg-gray-100 dark:bg-zinc-800 dark:text-white border-black/25 dark:border-white/25 border-2">
            <ScrollArea.Viewport className="w-full h-full rounded">
                <div className="w-full bg-gray-300 dark:bg-zinc-700 p-4">Message Log</div>
                {messages.map((message) => (
                    <Message message={message} key={message.id} />
                ))}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
                className="flex select-none touch-none p-0.5 bg-black/10 dark:bg-white/10 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                orientation="vertical">
                <ScrollArea.Thumb className="flex-1 bg-black dark:bg-white rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar
                className="flex select-none touch-none p-0.5 bg-black/10 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                orientation="horizontal">
                <ScrollArea.Thumb className="flex-1 bg-black rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="bg-blackA8" />
        </ScrollArea.Root>
    );
}

function Message({ message }: { message: Message }) {
    return (
        <li className="flex flex-col gap-2 w-full p-4 border-b-2 border-black/5 dark:border-white/5">
            <p>
                <strong>{message.sender_name}</strong>
            </p>
            <div>
                <p>{message.content}</p>
                <p className="opacity-60">
                    {
                        // Date formatting
                        new Date(message.created_at).toDateString() + " " + new Date(message.created_at).toLocaleTimeString()
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
                    // No need to update messages here, updates will be handled by the realtime subscription
                }
            });
    };

    return (
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
    );
}
