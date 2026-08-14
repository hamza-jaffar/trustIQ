import { store } from '@/actions/App/Http/Controllers/Customer/CustomerController'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import FileInput from '@/components/ui/file-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Form } from '@inertiajs/react'
import { Loader, LoaderCircleIcon, CheckIcon, ChevronDownIcon, SearchIcon } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

const PROVINCES = [
    "Azad Kashmir",
    "Balochistan",
    "Gilgit-Baltistan",
    "Islamabad Capital Territory",
    "Khyber Pakhtunkhwa",
    "Punjab",
    "Sindh"
];

const CITIES = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", 
    "Hyderabad", "Peshawar", "Quetta", "Gujranwala", "Sialkot", "Abbottabad", 
    "Bahawalpur", "Sukkur", "Larkana", "Nawabshah", "Mirpur Khas", "Chiniot", 
    "Kamoke", "Sadiqabad", "Burewala", "Jacobabad", "Muzaffargarh", "Muridke", 
    "Jhelum", "Shikarpur", "Hafizabad", "Kohat", "Khanewal", "Dera Ghazi Khan", 
    "Gujrat", "Kasur", "Mardan", "Mingora", "Okara", "Rahim Yar Khan", 
    "Sargodha", "Sheikhupura", "Sahiwal", "Jhang", "Dera Ismail Khan", 
    "Bahawalnagar", "Jaranwala", "Chishtian", "Vehari", "Kot Addu", "Khushab", 
    "Wazirabad", "Daska", "Gojra", "Mandi Bahauddin", "Tando Adam", "Khairpur", 
    "Dadu", "Tando Allahyar", "Ghotki", "Turbat", "Khuzdar", "Chaman", "Hub", 
    "Zhob", "Gwadar", "Gilgit", "Skardu", "Muzaffarabad", "Mirpur", "Rawalakot", 
    "Kotli"
].sort();

const SearchableDropdown = ({ options, name, placeholder, value, onChange }: any) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [internalValue, setInternalValue] = useState(value || "");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter((o: string) => o.toLowerCase().includes(search.toLowerCase()));
    
    return (
        <div ref={ref} className="relative w-full">
            <input type="hidden" name={name} value={internalValue} />
            <div 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <span className={internalValue ? "text-foreground" : "text-muted-foreground"}>
                    {internalValue || placeholder}
                </span>
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </div>
            {open && (
                <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                    <div className="flex items-center border-b px-3">
                        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input 
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" 
                            placeholder={`Search...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto p-1 bg-background">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm">No options found.</div>
                        ) : (
                            filteredOptions.map((option: string) => (
                                <div
                                    key={option}
                                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                    onClick={() => {
                                        setInternalValue(option);
                                        setSearch("");
                                        setOpen(false);
                                        if (onChange) onChange(option);
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

const CreateCustomerForm = ({ cnic, onCancel }: { cnic?: string; onCancel: () => void }) => {
    return (
        <div>
            <Form {...store.form()} >
                {({ processing, errors }) => (
                    <div className='w-full flex flex-col gap-5'>
                        <div className='w-full flex flex-col gap-2'>
                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        className="w-full"
                                        tabIndex={1}
                                        placeholder="Enter the customer's first name"
                                        name="first_name"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        className="w-full"
                                        placeholder="Enter the customer's last name"
                                        tabIndex={2}
                                        name="last_name"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <p className="text-xs text-gray-700 dark:text-gray-200">
                                Enter the name exactly matching the CNIC information.
                            </p>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="cnic">CNIC</Label>
                                    <Input
                                        id="cnic"
                                        className="w-full"
                                        tabIndex={3}
                                        placeholder="Enter the customer's cnic"
                                        name="cnic"
                                    />
                                    <InputError message={errors.cnic} />
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        className="w-full"
                                        tabIndex={3}
                                        placeholder="Enter the customer's email"
                                        name="email"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        className="w-full"
                                        placeholder="Enter the customer's phone"
                                        tabIndex={4}
                                        name="phone"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <p className="text-xs text-gray-700 dark:text-gray-200">
                                Enter the working email and phone number of the customer.
                            </p>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Input
                                        id="date_of_birth"
                                        className="w-full"
                                        tabIndex={5}
                                        type='date'
                                        placeholder="Enter the customer's data of birth"
                                        name="date_of_birth"
                                    />
                                    <InputError message={errors.date_of_birth} />
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender">
                                        <SelectTrigger id="gender" className="w-full" tabIndex={6}>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.gender} />
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="city">City</Label>
                                    <SearchableDropdown
                                        name="city"
                                        options={CITIES}
                                        placeholder="Select city"
                                    />
                                    <InputError message={errors.city} />
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="province">Province</Label>
                                    <SearchableDropdown
                                        name="province"
                                        options={PROVINCES}
                                        placeholder="Select province"
                                    />
                                    <InputError message={errors.province} />
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value="Pakistan"
                                        disabled
                                        className="w-full"
                                        placeholder="Enter the customer's country"
                                        tabIndex={7}
                                        name="country"
                                    />
                                    <InputError message={errors.country} />
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <div className="flex flex-col gap-2 w-full">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    className="w-full"
                                    tabIndex={8}
                                    placeholder="Enter the customer's address"
                                    name="address"
                                />
                                <InputError message={errors.address} />

                                <p className="text-xs text-gray-700 dark:text-gray-200">
                                    Enter the address of the customer match same as CNIC.
                                </p>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="occupation">Occupation</Label>
                                    <Input
                                        id="occupation"
                                        className="w-full"
                                        tabIndex={9}
                                        placeholder="Enter the customer's occupation"
                                        name="occupation"
                                    />
                                    <InputError message={errors.occupation} />
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="monthly_income">Monthly Income</Label>
                                    <Input
                                        id="monthly_income"
                                        className="w-full"
                                        placeholder="Enter the customer's monthly income"
                                        tabIndex={10}
                                        name="monthly_income"
                                    />
                                    <InputError message={errors.monthly_income} />
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="id_front">ID Front</Label>
                                    <FileInput id='id_front' name="id_front" tabIndex={11} />
                                    <InputError message={errors.id_front} />
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <Label htmlFor="id_back">ID Back</Label>
                                    <FileInput id='id_back' name="id_back" tabIndex={12} />
                                    <InputError message={errors.id_back} />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end gap-3'>
                            <Button className='cursor-pointer' variant="outline" onClick={onCancel}>Cancel</Button>
                            <Button className='cursor-pointer' type='submit' disabled={processing}>{processing ? <> <LoaderCircleIcon className='animate-spin' /> Submit</> : <>Submit</>}</Button>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    )
}

export default CreateCustomerForm