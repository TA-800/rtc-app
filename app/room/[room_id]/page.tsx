"use client";
import supabase from "@/utils/supabase";
import useUser from "@/utils/useUser";
import { useEffect, useState } from "react";
import { Database } from "@/utils/schema";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import RoomDescription from "./description";
import Members from "./members";
import { Input } from "@/utils/comps";
import { useRouter } from "next/navigation";

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
    id: string;
    name: string;
    avatar: string;
    email: string;
};

export default function Room({ params: { room_id } }: { params: { room_id: string } }) {
    const { user, loading } = useUser();
    const [room, setRoom] = useState<Room>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [members, setMembers] = useState<User[]>([]);
    const [showMembers, setShowMembers] = useState(false);
    const router = useRouter();

    function updateLastTime(created_at: string = new Date().toISOString()) {
        // Save current time to local storage
        // localstorage -> last_message_time is an array of objects: {user-id, room-id, time-of-last-seen-msg}
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

    function handleRoomDelete() {
        supabase
            .from("rooms")
            .delete()
            .eq("id", room_id)
            .select()
            .then(({ data, error }) => {
                if (error) {
                    console.log("%cError deleting room", "color: red; font-weight: bold; font-size: 1.5rem;");
                    console.log(error);
                }
                if (data) {
                    console.log("%cRoom deleted!", "color: green; font-weight: bold; font-size: 1.5rem;");
                    // Redirect to home
                    router.push("/");
                }
            });
    }

    // Get information about room, messages, and users
    useEffect(() => {
        // Update last message time
        if (user) updateLastTime();

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
                setMembers(data);
            }
        });

        // Subscribe to realtime updates
        const messagesSubscription = supabase
            .channel(`room:${room_id}`)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
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

    // Accessibility: Escape key closes members list if open
    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape" && showMembers) setShowMembers(false);
    }
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showMembers]);

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center">
                    {/* Room Name */}
                    <h1 className="break-all">{room?.name}</h1>
                    {/* Room delete button */}
                    {/* Conditions to render delete button */}
                    {/* 1. Room data fetched
                        2. User data is not loading
                        3. User is the room creator */}
                    {room && !loading && room.room_creator_id === user?.id && (
                        <button className="action-btn bg-red-700 ml-auto" onClick={handleRoomDelete}>
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
                <RoomDescription description={room?.description ?? ""} />
            </div>
            <br />
            <div className="grid grid-flow-col grid-cols-4 gap-2">
                <MessagesScrollList messages={messages} />
                <Members
                    members={members}
                    setMembers={setMembers}
                    showMembers={showMembers}
                    setShowMembers={setShowMembers}
                    room_creator_id={room?.room_creator_id}
                    current_user_id={user?.id}
                    room_id={room_id}
                />
            </div>
            <div className="md:h-0 h-14" />
            <CreateMessage roomid={room_id} setShowMembers={setShowMembers} />
        </>
    );
}

function MessagesScrollList({ messages }: { messages: Message[] }) {
    return (
        <ScrollArea.Root className="text-black lg:col-span-3 col-span-4 h-[calc(100vh-290px)] rounded overflow-hidden bg-gray-100 dark:bg-zinc-800 dark:text-white border-black/25 dark:border-white/25 border-2">
            <ScrollArea.Viewport className="w-full h-full rounded">
                <div className="w-full bg-gray-200 dark:bg-zinc-700 p-4 opacity-75">Message Log</div>
                {messages
                    // We can sort by id because it's incremental
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
    const { user } = useUser();

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
            <div className="flex flex-col gap-2">
                <p>{message.content}</p>
                <div className="flex flex-row">
                    <p className="opacity-60">
                        {new Date(message.created_at).toLocaleString("en-GB", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                    {message.sender_id === user?.id && message.sender_name === user?.user_metadata.full_name && (
                        <button className="action-btn-sm bg-red-700 ml-auto" onClick={handleDelete}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path
                                    fillRule="evenodd"
                                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                    clipRule="evenodd"
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
    const { user } = useUser();

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
            <button className="lg:hidden action-btn bg-blue-700" onClick={() => setShowMembers(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                </svg>
            </button>
            <Input name="content" placeholder="Type your message here" />
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
