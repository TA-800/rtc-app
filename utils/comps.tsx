export function Input({
    name,
    placeholder,
    type,
    classNames,
    maxLength,
}: {
    name: string;
    placeholder?: string;
    type?: string;
    classNames?: string;
    maxLength?: number;
}) {
    return (
        <input
            autoComplete="off"
            name={name}
            className={"text-black border-2 border-blue-600 border-opacity-25 rounded w-full p-2 " + classNames}
            placeholder={placeholder}
            type={type || "text"}
            maxLength={maxLength}
        />
    );
}

export function TextArea({ name, placeholder }: { name: string; placeholder?: string }) {
    return (
        <textarea
            autoComplete="off"
            name={name}
            className="text-black border-2 border-blue-600 border-opacity-25 rounded w-full p-2"
            placeholder={placeholder}
        />
    );
}
