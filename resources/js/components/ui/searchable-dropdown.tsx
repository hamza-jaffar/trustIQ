import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SearchableDropdown = ({
    options,
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    onKeyDown,
}: any) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [internalValue, setInternalValue] = useState(value || "");

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInternalValue(value || "");
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                setOpen(false);

                // Trigger parent's onBlur
                if (onBlur) {
                    onBlur();
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onBlur]);

    const filteredOptions = options.filter((o: string) =>
        o.toLowerCase().includes(search.toLowerCase())
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();

            setOpen(false);

            // Trigger parent's onKeyDown
            if (onKeyDown) {
                onKeyDown(e);
            }
        }

        if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
        }
    };

    return (
        <div
            ref={ref}
            className="relative w-full"
        >
            <input
                type="hidden"
                name={name}
                value={internalValue}
            />

            {/* Dropdown trigger */}
            <div
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <span
                    className={
                        internalValue
                            ? "text-foreground"
                            : "text-muted-foreground"
                    }
                >
                    {internalValue || placeholder}
                </span>

                <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </div>

            {open && (
                <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none">

                    {/* Search */}
                    <div className="flex items-center border-b px-3">
                        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />

                        <input
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </div>

                    {/* Options */}
                    <div className="max-h-[200px] overflow-y-auto p-1 bg-background">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm">
                                No options found.
                            </div>
                        ) : (
                            filteredOptions.map((option: string) => (
                                <div
                                    key={option}
                                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => {
                                        setInternalValue(option);
                                        setSearch("");
                                        setOpen(false);

                                        if (onChange) {
                                            onChange(option);
                                        }
                                    }}
                                >
                                    {internalValue === option && (
                                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                            <CheckIcon className="h-4 w-4" />
                                        </span>
                                    )}

                                    {option}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;