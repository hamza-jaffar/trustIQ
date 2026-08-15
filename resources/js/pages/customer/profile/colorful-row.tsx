import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchableDropdown from "@/components/ui/searchable-dropdown";
import { CITIES, PROVINCES } from "@/lib/constants";
import { update } from "@/routes/customers";
import { Form } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

const ColorfulRow = ({
    title,
    data,
    icon: Icon,
    accentClass = "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
    editable = false,
    name,
    customerId,
}: {
    title: string;
    data: string | null | undefined;
    icon?: React.ComponentType<{ className?: string }>;
    accentClass?: string;
    editable?: boolean;
    name?: string;
    customerId: string;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(data ?? "");

    const inputRef = useRef<HTMLInputElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);
    const submittingRef = useRef(false);

    useEffect(() => {
        setValue(data ?? "");
    }, [data]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const startEditing = () => {
        if (!editable || !name) return;

        setValue(data ?? "");
        submittingRef.current = false;
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setValue(data ?? "");
        setIsEditing(false);
        submittingRef.current = false;
    };

    const handleSubmit = () => {
        if (submittingRef.current) return;

        const original = (data ?? "").trim();
        const current = (value ?? "").trim();

        // Nothing changed
        if (original === current) {
            setIsEditing(false);
            return;
        }

        submittingRef.current = true;

        // Close input immediately
        setIsEditing(false);

        // Submit form
        submitRef.current?.click();
    };

    return (
        <Form {...update.form(customerId)}>
            {({ processing, errors }) => (
                <div
                    className="
                        flex flex-col sm:flex-row sm:items-center
                        justify-between p-4 rounded-xl
                        bg-white dark:bg-zinc-900
                        border border-zinc-100 dark:border-zinc-800
                        shadow-sm hover:shadow-md
                        hover:border-indigo-100
                        dark:hover:border-indigo-950
                        transition-all duration-200
                    "
                >
                    {/* Label */}
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div
                                className={`p-2 rounded-lg shrink-0 ${accentClass}`}
                            >
                                <Icon className="h-4 w-4" />
                            </div>
                        )}

                        <span className="font-semibold text-zinc-500 dark:text-zinc-400 text-sm tracking-wide">
                            {title}
                        </span>
                    </div>

                    {/* Value / Input */}
                    {isEditing ? (
                        <>
                            {name === "city" || name === "province" ? (
                                <SearchableDropdown
                                    name={name}
                                    value={value}
                                    options={
                                        name === "city"
                                            ? CITIES
                                            : PROVINCES
                                    }
                                    placeholder={`Select ${name}`}
                                    disabled={processing}
                                    onChange={(selectedValue: string) => {
                                        setValue(selectedValue);
                                    }}
                                    onBlur={() => {
                                        if (!processing) {
                                            handleSubmit();
                                        }
                                    }}
                                    onKeyDown={(
                                        e: React.KeyboardEvent<HTMLInputElement>
                                    ) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();

                                            if (!processing) {
                                                handleSubmit();
                                            }
                                        }

                                        if (e.key === "Escape") {
                                            e.preventDefault();

                                            if (!processing) {
                                                cancelEditing();
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    value={value}
                                    name={name}
                                    disabled={processing}
                                    onChange={(e) =>
                                        setValue(e.target.value)
                                    }
                                    onBlur={() => {
                                        if (!processing) {
                                            handleSubmit();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();

                                            if (!processing) {
                                                handleSubmit();
                                            }
                                        }

                                        if (e.key === "Escape") {
                                            e.preventDefault();

                                            if (!processing) {
                                                cancelEditing();
                                            }
                                        }
                                    }}
                                    className="
                                        mt-1.5 sm:mt-0
                                        w-full sm:w-auto min-w-[200px]
                                        px-2 py-1
                                        text-base font-bold
                                        text-zinc-800 dark:text-zinc-100
                                        bg-zinc-50 dark:bg-zinc-800
                                        border border-indigo-400
                                        rounded
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-indigo-500/20
                                    "
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <p
                                onDoubleClick={startEditing}
                                title={
                                    editable
                                        ? "Double-click to edit"
                                        : undefined
                                }
                                className={`
                                    text-base font-bold
                                    text-zinc-800 dark:text-zinc-100
                                    mt-1.5 sm:mt-0
                                    px-2 py-0.5 rounded
                                    ${
                                        editable
                                            ? "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                            : "cursor-text"
                                    }
                                `}
                            >
                                {data || "—"}
                            </p>

                            <InputError
                                message={
                                    name ? errors[name] : undefined
                                }
                            />
                        </div>
                    )}

                    {/* Hidden submit button */}
                    <Button
                        ref={submitRef}
                        type="submit"
                        hidden
                    >
                        Submit
                    </Button>
                </div>
            )}
        </Form>
    );
};

export default ColorfulRow;