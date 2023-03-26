"use client";
import supabase from "@/utils/supabase";
import useUser from "@/utils/useUser";
import { useEffect, useState } from "react";
import { Database } from "@/utils/schema";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import RoomDescription from "./description";
import Members from "./members";
import { Member } from "./members";

async function getRoom(room_id: string) {
    return await supabase.from("rooms").select().eq("id", room_id).single();
}

async function getMessages(room_id: string) {
    return await supabase.from("messages").select().eq("room_id", room_id);
}

async function getUsers(room_id: string) {
    return await supabase.rpc("get_users_from_room", { room_id_input: room_id }).returns<User[]>();
}

type Room = Database["public"]["Tables"]["rooms"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];
type User = {
    name: string;
    avatar: string;
    email: string;
};

export default function Room({ params: { room_id } }: { params: { room_id: string } }) {
    const user = useUser();
    const [room, setRoom] = useState<Room>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [showMembers, setShowMembers] = useState(false);

    function updateLastTime(created_at: string = new Date().toISOString()) {
        // Save current time to local storage
        // localstorage -> last_message_time is an array of objects: {room-id, time-of-last-seen-msg}
        // Convert last_message_time to array of objects from JSON String, then add/modify current room object's time, then convert back to JSON String and save to localstorage
        const last_message_times = JSON.parse(localStorage.getItem("last_message_times") ?? "[]");
        const room_index = last_message_times.findIndex(
            (room: { user_id: string; room_id: string }) => room.room_id === room_id && room.user_id === user!.id
        );
        if (room_index === -1) {
            last_message_times.push({ user_id: user!.id, room_id: room_id, time_iso: created_at });
        } else {
            last_message_times[room_index].time_iso = created_at;
        }
        localStorage.setItem("last_message_times", JSON.stringify(last_message_times));
    }

    useEffect(() => {
        // Update last message time
        if (user) {
            updateLastTime();
        }

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

        getUsers(room_id).then(({ data, error }) => {
            if (error) {
                console.log("%cError getting users", "color: red; font-weight: bold; font-size: 1.5rem;");
                console.log(error);
            }
            if (data) {
                console.log("%cUsers obtained!", "color: green; font-weight: bold; font-size: 1.5rem;");
                console.log(data);
                setMembers(data);
            }
        });

        // Subscribe to realtime updates
        const messagesSubscription = supabase
            .channel(`room:${room_id}`)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
                console.log("Received realtime update:", payload);
                // Update messages
                // @ts-ignore
                setMessages((messages) => [...messages, payload.new]);
                // Save current time to local storage
                updateLastTime(payload.new.created_at);
                // Scroll to bottom
                document.querySelector("[data-radix-scroll-area-viewport]")!.scrollTo({
                    top: document.querySelector("[data-radix-scroll-area-viewport]")!.scrollHeight,
                    behavior: "smooth",
                });
            })
            .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, (payload) => {
                console.log("Received realtime update:", payload);
                // Update messages
                setMessages((messages) => messages.filter((message) => message.id !== payload.old.id));
                // Save current time to local storage
                updateLastTime();
            })
            .subscribe();

        return () => {
            messagesSubscription.unsubscribe();
        };
    }, [user]);

    return (
        <>
            <div className="flex flex-col gap-1">
                <h1>{room?.name}</h1>
                <RoomDescription description={room?.description ?? ""} />
            </div>
            <br />
            <div className="grid grid-flow-col grid-cols-4 gap-2">
                <MessagesScrollList messages={messages} />
                <Members members={members} showMembers={showMembers} setShowMembers={setShowMembers} />
            </div>
            <CreateMessage roomid={room_id} setShowMembers={setShowMembers} />
        </>
    );
}

function MessagesScrollList({ messages }: { messages: Message[] }) {
    return (
        <ScrollArea.Root className="text-black lg:col-span-3 col-span-4 h-[calc(100vh-270px)] rounded overflow-hidden bg-gray-100 dark:bg-zinc-800 dark:text-white border-black/25 dark:border-white/25 border-2">
            <ScrollArea.Viewport className="w-full h-full rounded">
                <div className="w-full bg-gray-200 dark:bg-zinc-700 p-4">Message Log</div>
                {messages
                    .sort((a, b) => a.id - b.id)
                    .map((message) => (
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
            <ScrollArea.Corner className="bg-black" />
        </ScrollArea.Root>
    );
}

function Message({ message }: { message: Message }) {
    const user = useUser();

    const handleDelete = () => {
        supabase
            .from("messages")
            .delete()
            .eq("id", message.id)
            .then(({ data, error }) => {
                if (error) {
                    console.log("%cError deleting message", "color: red; font-weight: bold; font-size: 1.5rem;");
                    console.log(error);
                }
                if (data) {
                    console.log("%cMessage deleted!", "color: green; font-weight: bold; font-size: 1.5rem;");
                    console.log(data);
                }
            });
    };

    return (
        <li className="flex flex-col gap-2 w-full p-4 border-b-2 border-black/5 dark:border-white/5">
            <div className="flex flex-row items-center gap-2">
                <img
                    src={message.sender_avatar_url}
                    className="rounded-full w-14 h-14 border-2 border-black/50 dark:border-white/50"
                />
                <strong>{message.sender_name}</strong>
            </div>
            <div>
                <p>{message.content}</p>
                <div className="flex flex-row">
                    <p className="opacity-60">
                        {new Date(message.created_at).toLocaleString("en-GB", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                    {message.sender_id === user?.id && message.sender_name === user?.user_metadata.full_name && (
                        <button className="action-btn bg-red-700 ml-auto" onClick={handleDelete}>
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
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
}

function CreateMessage({
    roomid,
    setShowMembers,
}: {
    roomid: string;
    setShowMembers: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const user = useUser();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            content: { value: string };
        };
        if (target.content.value === "") return;
        // Send message to backend
        supabase
            .from("messages")
            .insert({
                sender_name: user!.user_metadata.full_name,
                sender_id: user!.id,
                sender_avatar_url: user?.user_metadata.avatar_url,
                content: target.content.value,
                room_id: roomid,
            })
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
            <button className="lg:hidden action-btn dark:bg-blue-900 bg-blue-400" onClick={() => setShowMembers(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                </svg>
            </button>
            <input
                autoComplete="off"
                name="content"
                className="border-2 border-blue-600 rounded-md w-full text-black p-2"
                placeholder="Type your message here..."
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
