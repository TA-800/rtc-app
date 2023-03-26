import * as Accordion from "@radix-ui/react-accordion";

export default function RoomDescription({ description }: { description: string }) {
    return (
        <Accordion.Root className="lg:w-3/4 w-full" type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <span className="opacity-75">Description</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 opacity-75">
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </AccordionTrigger>
                <AccordionContent>{description}</AccordionContent>
            </AccordionItem>
        </Accordion.Root>
    );
}

const AccordionItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
    return (
        <Accordion.Item value={value} className="w-full">
            {children}
        </Accordion.Item>
    );
};

const AccordionTrigger = ({ children }: { children: React.ReactNode }) => {
    return (
        <Accordion.Trigger className="transition-[border-radius] data-[state=closed]:delay-500 duration-200 dark:bg-zinc-700 bg-gray-200 dark:border-white/25 border-black/25 border-2 w-full flex flex-row gap-1 justify-center items-center p-2 data-[state=closed]:rounded-md data-[state=open]:rounded-t-md">
            {children}
        </Accordion.Trigger>
    );
};
const AccordionContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <Accordion.Content className="AccordionContent dark:bg-zinc-800 bg-gray-100 dark:border-white/25 border-black/25 border-2 border-t-0 rounded-b-md p-2">
            {/* padding height is also controlled in css file */}
            {children}
        </Accordion.Content>
    );
};
