import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Customer } from "@/types/data";

interface CustomerSearchableDropdownProps {
    customers: Customer[];
    value?: string | number | null;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    name: string;
}

const CustomerSearchableDropdown = ({
    customers,
    value,
    onChange,
    placeholder = "Select customer",
    searchPlaceholder = "Search customer...",
    disabled = false,
    name,
}: CustomerSearchableDropdownProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [internalValue, setInternalValue] = useState<
        string | number | null
    >(value ?? "");

    const ref = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInternalValue(value ?? "");
    }, [value]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                setOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // Focus search when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 0);
        }
    }, [open]);

    const selectedCustomer = customers.find(
        (customer) =>
            String(customer.id) === String(internalValue)
    );

    const filteredCustomers = customers.filter((customer) => {
        const searchTerm = search.toLowerCase().trim();

        if (!searchTerm) {
            return true;
        }

        const fullName =
            `${customer.first_name} ${customer.last_name}`.toLowerCase();

        const phone = customer.phone?.toLowerCase() ?? "";
        const email = customer.email?.toLowerCase() ?? "";
        const cnic = customer.cnic?.toLowerCase() ?? "";

        return (
            fullName.includes(searchTerm) ||
            phone.includes(searchTerm) ||
            email.includes(searchTerm) ||
            cnic.includes(searchTerm)
        );
    });

    const getCustomerName = (customer: Customer) => {
        return `${customer.first_name} ${customer.last_name}`.trim();
    };

    const handleSelect = (customer: Customer) => {
        setInternalValue(customer.id);
        setOpen(false);
        setSearch("");

        onChange(customer.id);
    };

    return (
        <div
            ref={ref}
            className="relative w-full"
        >
            {/* Actual value submitted with the Form */}
            <input
                type="hidden"
                name={name}
                value={internalValue ?? ""}
            />

            {/* Trigger */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                className="
                    flex h-10 w-full items-center justify-between
                    rounded-md border border-input
                    bg-background px-3 py-2
                    text-sm text-left
                    hover:bg-accent
                    focus:outline-none
                    focus:ring-2 focus:ring-ring
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                <span
                    className={
                        selectedCustomer
                            ? "text-foreground"
                            : "text-muted-foreground"
                    }
                >
                    {selectedCustomer
                        ? getCustomerName(selectedCustomer)
                        : placeholder}
                </span>

                <ChevronDownIcon
                    className={`
                        h-4 w-4 opacity-50 transition-transform
                        ${open ? "rotate-180" : ""}
                    `}
                />
            </button>

            {/* Dropdown */}
            {open && !disabled && (
                <div
                    className="
                        absolute left-0 top-full z-50 mt-1
                        w-full overflow-hidden
                        rounded-md border
                        bg-popover
                        text-popover-foreground
                        shadow-md
                    "
                >
                    {/* Search */}
                    <div className="flex items-center border-b px-3">
                        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />

                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder={searchPlaceholder}
                            className="
                                h-11 w-full
                                bg-transparent
                                text-sm
                                outline-none
                                placeholder:text-muted-foreground
                            "
                        />
                    </div>

                    {/* Customers */}
                    <div className="max-h-64 overflow-y-auto p-1">
                        {filteredCustomers.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No customers found.
                            </div>
                        ) : (
                            filteredCustomers.map((customer) => {
                                const selected =
                                    String(customer.id) ===
                                    String(internalValue);

                                return (
                                    <button
                                        key={customer.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelect(customer)
                                        }
                                        className="
                                            relative flex w-full
                                            items-center
                                            gap-3
                                            rounded-sm
                                            px-3 py-2
                                            text-left
                                            hover:bg-accent
                                            hover:text-accent-foreground
                                        "
                                    >
                                        {selected && (
                                            <CheckIcon className="h-4 w-4 shrink-0" />
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium">
                                                {getCustomerName(customer)}
                                            </div>

                                            <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                                                {customer.phone && (
                                                    <span>
                                                        <b> PHONE: </b>{customer.phone}
                                                    </span>
                                                )}

                                                {customer.email && (
                                                    <span>
                                                       <b> EMAIL: </b>{customer.email}
                                                    </span>
                                                )}

                                                {customer.cnic && (
                                                    <span>
                                                       <b> CNIC: </b>{customer.cnic}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerSearchableDropdown;