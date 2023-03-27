"use client";

import { Input, TextArea } from "@/utils/comps";
import supabase from "@/utils/supabase";
import useUser from "@/utils/useUser";
import { useRouter } from "next/navigation";

export default function CreateNew() {
    const router = useRouter();
    const user = useUser();

    const handleNewRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            name: { value: string };
            description: { value: string };
        };
        if (!target.name.value || !target.description.value) return;
        // Send message to backend
        supabase
            .from("rooms")
            .insert({
                name: target.name.value,
                description: target.description.value,
                room_creator_id: user!.id,
            })
            .select()
            .then(({ data, error }) => {
                if (error) {
                    console.log("%cError creating room", "color: red; font-weight: bold; font-size: 1.5rem;");
                    console.log(error);
                }
                if (data) {
                    // Redirect to the new room
                    console.log("%cRoom created!", "color: green; font-weight: bold; font-size: 1.5rem;");

                    // Add the new user to the room
                    supabase
                        .from("rooms_users")
                        .insert({
                            room_id: data[0].id,
                            user_id: user!.id,
                        })
                        .select()
                        .then(({ data, error }) => {
                            if (error) {
                                console.log("%cError adding user to room", "color: red; font-weight: bold; font-size: 1.5rem;");
                                console.log(error);
                            }
                            if (data) {
                                console.log("%cUser added to room!", "color: green; font-weight: bold; font-size: 1.5rem;");
                                router.push(`/${data[0].room_id}`);
                            }
                        });
                }
            });
    };

    // Name and description of the room
    return (
        <>
            <h1>Create a new room</h1>
            <br />
            <form className="flex flex-col gap-2" onSubmit={(e) => handleNewRoom(e)}>
                <fieldset className="flex flex-col gap-1">
                    <label htmlFor="name">Name</label>
                    <Input name="name" placeholder="What do you want to call your room?" />
                </fieldset>
                <fieldset className="flex flex-col gap-1">
                    <label htmlFor="description">Description</label>
                    <TextArea name="description" placeholder="What is this room about?" />
                </fieldset>
                <button className="action-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Create
                </button>
            </form>
        </>
    );
}
