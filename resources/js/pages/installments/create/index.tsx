import Heading from '@/components/heading'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import installments from '@/routes/installments'
import { Customer } from '@/types/data'
import { Form } from '@inertiajs/react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import CustomerSearchableDropdown from './customer-searchable-dropdown'

type Guarantor = {
    customer_id: string
    full_name: string
    cnic: string
    phone: string
    address: string
    relationship: string
    monthly_income: string
}

const emptyGuarantor = (): Guarantor => ({
    customer_id: '',
    full_name: '',
    cnic: '',
    phone: '',
    address: '',
    relationship: '',
    monthly_income: '',
})

const CreateInstallment = ({
    customer_id,
    customers,
}: {
    customer_id?: string
    customers: Customer[]
}) => {
    /*
     * Customer selected from URL:
     *
     * /installments/create?customer_id=5
     */
    const [customerId, setCustomerId] = useState<string>(
        customer_id ?? ''
    )

    /*
     * At least one guarantor is required.
     */
    const [guarantors, setGuarantors] = useState<Guarantor[]>([
        emptyGuarantor(),
    ])

    /*
     * Add a new guarantor.
     */
    const addGuarantor = () => {
        setGuarantors((prev) => [
            ...prev,
            emptyGuarantor(),
        ])
    }

    /*
     * Remove guarantor.
     *
     * We don't allow removing the last guarantor
     * because at least one is required.
     */
    const removeGuarantor = (index: number) => {
        if (guarantors.length <= 1) {
            return
        }

        setGuarantors((prev) =>
            prev.filter((_, i) => i !== index)
        )
    }

    /*
     * Update a single guarantor field.
     */
    const updateGuarantor = (
        index: number,
        field: keyof Guarantor,
        value: string
    ) => {
        setGuarantors((prev) =>
            prev.map((guarantor, i) =>
                i === index
                    ? {
                        ...guarantor,
                        [field]: value,
                    }
                    : guarantor
            )
        )
    }

    /*
     * Select an existing customer as guarantor.
     *
     * When a customer is selected, we automatically
     * populate their basic information.
     */
    const selectGuarantorCustomer = (
        index: number,
        value: string | number | null
    ) => {
        const customer = customers.find(
            (customer) =>
                String(customer.id) === String(value)
        )

        if (!customer) {
            updateGuarantor(
                index,
                'customer_id',
                value ? String(value) : ''
            )

            return
        }

        setGuarantors((prev) =>
            prev.map((guarantor, i) =>
                i === index
                    ? {
                        ...guarantor,
                        customer_id: String(customer.id),
                        full_name:
                            `${customer.first_name} ${customer.last_name}`.trim(),
                        cnic: customer.cnic ?? '',
                        phone: customer.phone ?? '',
                    }
                    : guarantor
            )
        )
    }

    return (
        <div className="p-8">
            <Heading
                title="Create Installment"
                description="Create the new installment"
            />

            <Form {...installments.store.form()}>
                {({ processing, errors }) => (
                    <div className="flex w-full flex-col gap-6">

                        {/* =====================================================
                            CUSTOMER + ITEM REFERENCE
                        ====================================================== */}
                        <div className="flex w-full flex-col gap-5 md:flex-row">

                            {/* Customer */}
                            <div className="flex w-full flex-col gap-2 md:w-1/2">
                                <Label htmlFor="customer_id">
                                    Customer
                                </Label>

                                <CustomerSearchableDropdown
                                    name="customer_id"
                                    customers={customers}
                                    value={customerId}
                                    placeholder="Select customer"
                                    searchPlaceholder="Search by name, phone, email or CNIC..."
                                    disabled={processing}
                                    onChange={(value) => {
                                        setCustomerId(
                                            value
                                                ? String(value)
                                                : ''
                                        )
                                    }}
                                />

                                <InputError
                                    message={errors.customer_id}
                                />
                            </div>

                            {/* Item Reference */}
                            <div className="flex w-full flex-col gap-2 md:w-1/2">
                                <Label htmlFor="item_reference">
                                    Item Reference
                                </Label>

                                <Input
                                    id="item_reference"
                                    name="item_reference"
                                    required
                                    placeholder="Enter the item reference number"
                                    tabIndex={1}
                                    disabled={processing}
                                />

                                <InputError
                                    message={
                                        errors.item_reference
                                    }
                                />
                            </div>
                        </div>

                        {/* =====================================================
                            PRODUCT PRICE + DOWN PAYMENT
                        ====================================================== */}
                        <div className="flex w-full flex-col gap-5 md:flex-row">

                            {/* Product Price */}
                            <div className="flex w-full flex-col gap-2 md:w-1/2">
                                <Label htmlFor="total_price">
                                    Product Price
                                </Label>

                                <Input
                                    id="total_price"
                                    name="total_price"
                                    type="number"
                                    min="0"
                                    required
                                    placeholder="Enter the price of the product"
                                    tabIndex={2}
                                    disabled={processing}
                                />

                                <InputError
                                    message={
                                        errors.total_price
                                    }
                                />
                            </div>

                            {/* Down Payment */}
                            <div className="flex w-full flex-col gap-2 md:w-1/2">
                                <Label htmlFor="down_payment">
                                    Down Payment
                                </Label>

                                <Input
                                    id="down_payment"
                                    name="down_payment"
                                    type="number"
                                    min="0"
                                    required
                                    placeholder="Enter the down payment paid by customer"
                                    tabIndex={3}
                                    disabled={processing}
                                />

                                <InputError
                                    message={
                                        errors.down_payment
                                    }
                                />
                            </div>
                        </div>

                        {/* =====================================================
                            FREQUENCY + START DATE
                        ====================================================== */}
                        <div className="flex w-full flex-col gap-5 md:flex-row">

                            {/* Frequency */}
                            <div className="flex w-full flex-col gap-2 md:w-1/2">
                                <Label htmlFor="frequency">
                                    Frequency
                                </Label>

                                <Select
                                    required
                                    name="frequency"
                                    disabled={processing}
                                >
                                    <SelectTrigger
                                        id="frequency"
                                        className="w-full"
                                        tabIndex={4}
                                    >
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="weekly">
                                            Weekly
                                        </SelectItem>

                                        <SelectItem value="bi_weekly">
                                            Bi Weekly
                                        </SelectItem>

                                        <SelectItem value="monthly">
                                            Monthly
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <InputError
                                    message={
                                        errors.frequency
                                    }
                                />
                            </div>

                            {/* Start Date */}
                            <div className="flex w-full flex-col gap-2 md:w-1/2">
                                <Label htmlFor="start_date">
                                    Start Date
                                </Label>

                                <Input
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    required
                                    tabIndex={5}
                                    disabled={processing}
                                />

                                <InputError
                                    message={
                                        errors.start_date
                                    }
                                />
                            </div>
                        </div>

                        {/* =====================================================
                            GUARANTORS
                        ====================================================== */}
                        <section className="flex flex-col gap-5 rounded-xl border bg-card p-5">

                            {/* Header */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Guarantors
                                    </h2>

                                    <p className="text-sm text-muted-foreground">
                                        Add at least one guarantor.
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addGuarantor}
                                    disabled={processing}
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Guarantor
                                </Button>
                            </div>

                            {/* Guarantor List */}
                            <div className="flex flex-col gap-6">

                                {guarantors.map(
                                    (guarantor, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl border bg-background p-5"
                                        >

                                            {/* Guarantor Header */}
                                            <div className="mb-5 flex items-center justify-between">

                                                <div>
                                                    <h3 className="font-semibold">
                                                        Guarantor{' '}
                                                        {index + 1}
                                                    </h3>

                                                    <p className="text-xs text-muted-foreground">
                                                        Guarantor information
                                                    </p>
                                                </div>

                                                {guarantors.length >
                                                    1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                removeGuarantor(
                                                                    index
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                            </div>

                                            {/* Existing Customer */}
                                            <div className="flex flex-col gap-2">
                                                <Label>
                                                    Existing Customer
                                                </Label>

                                                <CustomerSearchableDropdown
                                                    name={`guarantors[${index}][customer_id]`}
                                                    customers={
                                                        customers
                                                    }
                                                    value={
                                                        guarantor.customer_id
                                                    }
                                                    placeholder="Select existing customer"
                                                    searchPlaceholder="Search by name, phone, email or CNIC..."
                                                    disabled={
                                                        processing
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        selectGuarantorCustomer(
                                                            index,
                                                            value
                                                        )
                                                    }
                                                />

                                                <InputError
                                                    message={
                                                        errors[
                                                        `guarantors.${index}.customer_id`
                                                        ]
                                                    }
                                                />

                                                <p className="text-xs text-muted-foreground">
                                                    Optional. Select an existing customer or enter the guarantor details manually.
                                                </p>
                                            </div>

                                            {/* Full Name + CNIC */}
                                            <div className="mt-5 flex flex-col gap-5 md:flex-row">

                                                {/* Full Name */}
                                                <div className="flex w-full flex-col gap-2 md:w-1/2">
                                                    <Label
                                                        htmlFor={`guarantors.${index}.full_name`}
                                                    >
                                                        Full Name
                                                    </Label>

                                                    <Input
                                                        id={`guarantors.${index}.full_name`}
                                                        name={`guarantors[${index}][full_name]`}
                                                        value={
                                                            guarantor.full_name
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateGuarantor(
                                                                index,
                                                                'full_name',
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Enter guarantor full name"
                                                        required
                                                        disabled={
                                                            processing
                                                        }
                                                    />

                                                    <InputError
                                                        message={
                                                            errors[
                                                            `guarantors.${index}.full_name`
                                                            ]
                                                        }
                                                    />
                                                </div>

                                                {/* CNIC */}
                                                <div className="flex w-full flex-col gap-2 md:w-1/2">
                                                    <Label
                                                        htmlFor={`guarantors.${index}.cnic`}
                                                    >
                                                        CNIC
                                                    </Label>

                                                    <Input
                                                        id={`guarantors.${index}.cnic`}
                                                        name={`guarantors[${index}][cnic]`}
                                                        value={
                                                            guarantor.cnic
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateGuarantor(
                                                                index,
                                                                'cnic',
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Enter CNIC"
                                                        required
                                                        disabled={
                                                            processing
                                                        }
                                                    />

                                                    <InputError
                                                        message={
                                                            errors[
                                                            `guarantors.${index}.cnic`
                                                            ]
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone + Relationship */}
                                            <div className="mt-5 flex flex-col gap-5 md:flex-row">

                                                {/* Phone */}
                                                <div className="flex w-full flex-col gap-2 md:w-1/2">
                                                    <Label
                                                        htmlFor={`guarantors.${index}.phone`}
                                                    >
                                                        Phone
                                                    </Label>

                                                    <Input
                                                        id={`guarantors.${index}.phone`}
                                                        name={`guarantors[${index}][phone]`}
                                                        value={
                                                            guarantor.phone
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateGuarantor(
                                                                index,
                                                                'phone',
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Enter phone number"
                                                        required
                                                        disabled={
                                                            processing
                                                        }
                                                    />

                                                    <InputError
                                                        message={
                                                            errors[
                                                            `guarantors.${index}.phone`
                                                            ]
                                                        }
                                                    />
                                                </div>

                                                {/* Relationship */}
                                                <div className="flex w-full flex-col gap-2 md:w-1/2">
                                                    <Label
                                                        htmlFor={`guarantors.${index}.relationship`}
                                                    >
                                                        Relationship
                                                    </Label>

                                                    <Input
                                                        id={`guarantors.${index}.relationship`}
                                                        name={`guarantors[${index}][relationship]`}
                                                        value={
                                                            guarantor.relationship
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateGuarantor(
                                                                index,
                                                                'relationship',
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="e.g. Brother, Father, Friend"
                                                        required
                                                        disabled={
                                                            processing
                                                        }
                                                    />

                                                    <InputError
                                                        message={
                                                            errors[
                                                            `guarantors.${index}.relationship`
                                                            ]
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Monthly Income */}
                                            <div className="mt-5 flex flex-col gap-2">
                                                <Label
                                                    htmlFor={`guarantors.${index}.monthly_income`}
                                                >
                                                    Monthly Income
                                                </Label>

                                                <Input
                                                    id={`guarantors.${index}.monthly_income`}
                                                    name={`guarantors[${index}][monthly_income]`}
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        guarantor.monthly_income
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateGuarantor(
                                                            index,
                                                            'monthly_income',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Enter monthly income"
                                                    required
                                                    disabled={
                                                        processing
                                                    }
                                                />

                                                <InputError
                                                    message={
                                                        errors[
                                                        `guarantors.${index}.monthly_income`
                                                        ]
                                                    }
                                                />
                                            </div>

                                            {/* Address */}
                                            <div className="mt-5 flex flex-col gap-2">
                                                <Label
                                                    htmlFor={`guarantors.${index}.address`}
                                                >
                                                    Address
                                                </Label>

                                                <Input
                                                    id={`guarantors.${index}.address`}
                                                    name={`guarantors[${index}][address]`}
                                                    value={
                                                        guarantor.address
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateGuarantor(
                                                            index,
                                                            'address',
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Enter guarantor address"
                                                    required
                                                    disabled={
                                                        processing
                                                    }
                                                />

                                                <InputError
                                                    message={
                                                        errors[
                                                        `guarantors.${index}.address`
                                                        ]
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>

                        {/* =====================================================
                            SUBMIT
                        ====================================================== */}
                        <div className="flex justify-end gap-2">
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    )
}

export default CreateInstallment