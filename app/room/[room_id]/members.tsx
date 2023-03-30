import supabase from "@/utils/supabase";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useRouter } from "next/navigation";

type User = {
    id: string;
    name: string;
    avatar: string;
    email: string;
};

export default function Members({
    members,
    showMembers,
    setShowMembers,
    room_id,
    room_creator_id,
    current_user_id,
}: {
    members: User[];
    showMembers: boolean;
    setShowMembers: React.Dispatch<React.SetStateAction<boolean>>;
    room_id?: string;
    room_creator_id?: string;
    current_user_id?: string;
}) {
    const router = useRouter();

    function handleLeaveRoom() {
        supabase
            .from("rooms_users")
            .delete()
            .match({ user_id: current_user_id, room_id: room_id })
            .select()
            .then(({ data, error }) => {
                if (error) {
                    console.log("%cError leaving room", "color: red; font-weight: bold;");
                    console.log(error);
                }
                if (data) {
                    console.log("%cSuccess leaving room", "color: green; font-weight: bold;");
                    // Redirect to home page
                    router.push("/");
                }
            });
    }

    return (
        <div
            className={`lg:col-span-1 lg:static lg:h-[calc(100vh-290px)] transition-all duration-300
                        w-full h-full top-0 fixed z-50 ${showMembers ? "left-0" : "-left-full"}`}>
            <ScrollArea.Root className="text-black h-full rounded overflow-hidden bg-gray-100 dark:bg-zinc-800 dark:text-white border-black/25 dark:border-white/25 border-2">
                <ScrollArea.Viewport className="w-full h-full rounded">
                    <div className="flex flex-row w-full bg-gray-200 dark:bg-zinc-700 p-4">
                        <span>Room Members: {members.length}</span>
                        <button
                            className="ml-auto lg:hidden"
                            onClick={() => {
                                setShowMembers(false);
                            }}>
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
                                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 p-2">
                        {members.map((member, index) => (
                            <div key={index} className="flex flex-row items-center gap-2">
                                <img
                                    src={member.avatar}
                                    className="rounded-full w-14 h-14 border-2 border-black/50 dark:border-white/50"
                                />
                                <strong>{member.name}</strong>
                                {/* Button to leave room */}
                                {member.id === current_user_id && member.id !== room_creator_id && (
                                    <button className="action-btn-sm !bg-red-600 ml-auto" onClick={handleLeaveRoom}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="w-5 h-5">
                                            <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                                            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                                        </svg>
                                        Leave
                                    </button>
                                )}
                                {/* Icon for creator */}
                                {member.id === room_creator_id && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-6 h-6">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
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
        </div>
    );
}
