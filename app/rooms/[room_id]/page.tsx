"use client";

import { Database } from "@/utils/schema";
import supabase from "@/utils/supabase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseISO } from "date-fns";

// Reference: https://supabase.com/docs/reference/javascript/select#nested-tables
type Message = Database["public"]["Tables"]["messages"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];
type DisplayMessage = Message & {
    sender: User;
};

async function getMessages() {
    return await supabase.from("messages").select("*, sender:users (username)").returns<DisplayMessage[]>();
}

export default function Room({ params: { room_id } }: { params: { room_id: string } }) {
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const { data: session } = useSession();
    const router = useRouter();

    // Fetch messages from the database
    useEffect(() => {
        console.log("%cRoom ID: " + room_id, "color: blue, font-size: 1.5rem");
        getMessages().then(({ data, error }) => {
            if (error) console.log(error);
            else setMessages(data);
        });
    }, []);

    // Send message to the database
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            content: { value: string };
        };
        const content = target.content.value;
        // Clear the input field
        target.content.value = "";
        // Send the message to the database
        supabase
            .from("messages")
            .insert({ content, sender_id: session!.user!.id!, room_id })
            .select("*, sender:users (username)")
            .returns<DisplayMessage[]>()
            .single()
            .then(({ data, error }) => {
                if (error) console.log(error);
                else {
                    console.log("%cMessage sent by %s!", "color: green, font-size: 1.5rem", data.sender.username);
                    console.log(data);
                    setMessages((messages) => [...messages, data]);
                }
            });
    };

    return (
        <>
            {/* Two containers */}
            {/* Container 1: Users + utility buttons (search message, leave room) - LEFT */}
            {/* Container 2: All messages in the room - CENTER & RIGHT */}
            <div className="flex flex-col gap-2 mb-20">
                {messages &&
                    messages.map((message) => (
                        <div key={message.id} className="flex flex-col gap-2">
                            <div className="flex flex-col">
                                <p className="text-lg">{message.content}</p>
                                <p className="text-sm text-gray-500">{parseISO(message.created_at!).toLocaleTimeString()}</p>
                                {/* Convert sender_id to sender_username from supabase */}
                                <p className="text-sm text-gray-500">{message.sender.username}</p>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Input element fixed on bottom of the screen */}
            <form className="flex flex-row fixed bottom-2 right-[1px] w-full p-2 gap-2" onSubmit={(e) => handleSubmit(e)}>
                <input autoComplete="off" name="content" type="text" className="w-full p-2 rounded-md text-black" />
                <button type="submit" className="action-btn md:px-5">
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
                    <span>Send</span>
                </button>
            </form>
        </>
    );
}
