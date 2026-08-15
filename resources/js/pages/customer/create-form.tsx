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
import { PROVINCES, CITIES } from '@/lib/constants'
import SearchableDropdown from '@/components/ui/searchable-dropdown'

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