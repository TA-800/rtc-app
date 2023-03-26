import { Input, TextArea } from "@/utils/comps";

export default function CreateNew() {
    // Name and description of the room
    return (
        <>
            <h1>Create a new room</h1>
            <br />
            <form className="flex flex-col gap-2">
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
