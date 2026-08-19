import {
    Installment
} from '@/types/data';
import { Link, router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import {
    Search,
    RotateCcw,
    ArrowUp,
    ArrowDown,
    Eye,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { index, show } from '@/routes/installments';
import { PaginatedInstallments } from '@/types/pagination';
import { InstallmentFilters } from '@/types/filters';
import { profile } from '@/routes/customers';

interface Props {
    installments: PaginatedInstallments;
    filters: InstallmentFilters;
    filterOptions: {
        users: {
            id: number;
            first_name: string;
            last_name: string;
        }[];
    };
}

const InstallmentTable = ({
    installments,
    filters,
    filterOptions,
}: Props) => {
    const [search, setSearch] = useState(filters.search ?? '');
    const { currency } = usePage().props;

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search === filters.search) {
                return;
            }

            updateFilters({
                search,
                page: 1,
            });
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const updateFilters = (values: Record<string, any>) => {
        router.get(
            index(),
            {
                ...filters,
                ...values,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        setSearch('');

        router.get(
            index(),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const sortBy = (column: string) => {
        const direction =
            filters.sort === column &&
                filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        updateFilters({
            sort: column,
            direction,
            page: 1,
        });
    };

    const sortIcon = (column: string) => {
        if (filters.sort !== column) {
            return null;
        }

        return filters.direction === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" />
        ) : (
            <ArrowDown className="h-3.5 w-3.5" />
        );
    };

    const statusClasses = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-50 text-green-700 ring-green-600/20';

            case 'approved':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20';

            case 'pending':
            case 'pending_approval':
                return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';

            case 'completed':
                return 'bg-purple-50 text-purple-700 ring-purple-600/20';

            case 'rejected':
            case 'cancelled':
                return 'bg-red-50 text-red-700 ring-red-600/20';

            default:
                return 'bg-gray-50 text-gray-700 ring-gray-600/20';
        }
    };

    return (
        <div className="space-y-4">
            <div className="rounded-xl border bg-background p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="md:col-span-2">
                        <label className="text-sm">
                            Search
                        </label>

                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Customer, CNIC, phone, email or item reference..."
                                className="pl-9 w-full"
                            />
                        </div>
                    </div>

                    <div className='md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                        <div className='w-full'>
                            <label className="text-sm">
                                Status
                            </label>

                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) =>
                                    updateFilters({
                                        status:
                                            value === 'all'
                                                ? ''
                                                : value,
                                        page: 1,
                                    })
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="pending_approval">
                                        Pending Approval
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='w-full'>
                            <label className="text-sm">
                                Frequency
                            </label>

                            <Select
                                value={filters.frequency || 'all'}
                                onValueChange={(value) =>
                                    updateFilters({
                                        frequency:
                                            value === 'all'
                                                ? ''
                                                : value,
                                        page: 1,
                                    })
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="All frequencies" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        All Frequencies
                                    </SelectItem>
                                    <SelectItem value="daily">
                                        Daily
                                    </SelectItem>
                                    <SelectItem value="weekly">
                                        Weekly
                                    </SelectItem>
                                    <SelectItem value="biweekly">
                                        Biweekly
                                    </SelectItem>
                                    <SelectItem value="monthly">
                                        Monthly
                                    </SelectItem>
                                    <SelectItem value="quarterly">
                                        Quarterly
                                    </SelectItem>
                                    <SelectItem value="yearly">
                                        Yearly
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                        <div className='w-full'>
                            <label className="text-sm">
                                Created By
                            </label>

                            <Select
                                value={
                                    filters.created_by
                                        ? String(
                                            filters.created_by,
                                        )
                                        : 'all'
                                }
                                onValueChange={(value) =>
                                    updateFilters({
                                        created_by:
                                            value === 'all'
                                                ? ''
                                                : value,
                                        page: 1,
                                    })
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Everyone" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        Everyone
                                    </SelectItem>

                                    {filterOptions.users.map(
                                        (user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={String(
                                                    user.id,
                                                )}
                                            >
                                                {user.first_name} {user.last_name}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='w-full'>
                            <label className="text-sm">
                                Per Page
                            </label>

                            <Select
                                value={String(filters.per_page)}
                                onValueChange={(value) =>
                                    updateFilters({
                                        per_page: Number(value),
                                        page: 1,
                                    })
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm">
                            Start Date From
                        </label>
                        <Input
                            type="date"
                            value={filters.start_date_from ?? ''}
                            onChange={(e) =>
                                updateFilters({
                                    start_date_from: e.target.value,
                                    page: 1,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm">
                            Start Date To
                        </label>
                        <Input
                            type="date"
                            value={filters.start_date_to ?? ''}
                            onChange={(e) =>
                                updateFilters({
                                    start_date_to: e.target.value,
                                    page: 1,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm">
                            Min Total Price
                        </label>
                        <Input
                            type="number"
                            value={filters.min_price ?? ''}
                            onChange={(e) =>
                                updateFilters({
                                    min_price: e.target.value,
                                    page: 1,
                                })
                            }
                            placeholder="e.g. 50000"
                        />
                    </div>

                    <div>
                        <label className="text-sm">
                            Max Total Price
                        </label>
                        <Input
                            type="number"
                            value={filters.max_price ?? ''}
                            onChange={(e) =>
                                updateFilters({
                                    max_price: e.target.value,
                                    page: 1,
                                })
                            }
                            placeholder="e.g. 500000"
                        />
                    </div>

                    <div>
                        <label className="text-sm">
                            Min Financed
                        </label>
                        <Input
                            type="number"
                            value={filters.min_financed ?? ''}
                            onChange={(e) =>
                                updateFilters({
                                    min_financed: e.target.value,
                                    page: 1,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm">
                            Max Financed
                        </label>
                        <Input
                            type="number"
                            value={filters.max_financed ?? ''}
                            onChange={(e) =>
                                updateFilters({
                                    max_financed: e.target.value,
                                    page: 1,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm">
                            Min Total Payable
                        </label>
                        <Input
                            type="number"
                            value={filters.min_payable ?? ''}
                            onChange={(e) =>
                                updateFilters({
                                    min_payable: e.target.value,
                                    page: 1,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm">
                            Max Total Payable
                        </label>
                        <Input
                            type="number"
                            value={filters.max_payable ?? ''}
                            onChange={(e) =>
                                updateFilters({
                                    max_payable: e.target.value,
                                    page: 1,
                                })
                            }
                        />
                    </div>
                </div>

                <div className="mt-4 flex justify-end border-t pt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />

                        Reset Filters
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-background shadow-sm">

                {/* Header */}

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div>
                        <h2 className="text-lg font-semibold">
                            Installment Plans
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            {installments.total} installment plans
                        </p>
                    </div>
                </div>

                {/* Table */}

                <div className="overflow-x-auto">

                    <table className="min-w-full divide-y">

                        <thead className="bg-muted/50">

                            <tr>

                                {/* Customer */}

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                    Customer
                                </th>

                                {/* Item */}

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                    Item
                                </th>

                                {/* Price */}

                                <th
                                    onClick={() =>
                                        sortBy(
                                            'total_price',
                                        )
                                    }
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-semibold uppercase"
                                >
                                    <div className="flex items-center gap-1">
                                        Total Price
                                        {sortIcon(
                                            'total_price',
                                        )}
                                    </div>
                                </th>

                                {/* Financed */}

                                <th
                                    onClick={() =>
                                        sortBy(
                                            'financed_amount',
                                        )
                                    }
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-semibold uppercase"
                                >
                                    <div className="flex items-center gap-1">
                                        Financed
                                        {sortIcon(
                                            'financed_amount',
                                        )}
                                    </div>
                                </th>

                                {/* Payable */}

                                <th
                                    onClick={() =>
                                        sortBy(
                                            'total_payable',
                                        )
                                    }
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-semibold uppercase"
                                >
                                    <div className="flex items-center gap-1">
                                        Payable
                                        {sortIcon(
                                            'total_payable',
                                        )}
                                    </div>
                                </th>

                                {/* Frequency */}

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                    Frequency
                                </th>

                                {/* Status */}

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                    Status
                                </th>

                                {/* Start */}

                                <th
                                    onClick={() =>
                                        sortBy(
                                            'start_date',
                                        )
                                    }
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-semibold uppercase"
                                >
                                    <div className="flex items-center gap-1">
                                        Start Date
                                        {sortIcon(
                                            'start_date',
                                        )}
                                    </div>
                                </th>

                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y">

                            {installments.data.length ? (

                                installments.data.map(
                                    (installment: Installment) => (

                                        <tr
                                            key={
                                                installment.id
                                            }
                                            className="hover:bg-muted/30"
                                        >

                                            {/* Customer */}
                                            <Link href={profile({ cnic: installment.customer?.cnic ?? '' })}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="font-medium">
                                                        {
                                                            installment
                                                                .customer
                                                                ?.first_name
                                                        }{' '}
                                                        {
                                                            installment
                                                                .customer
                                                                ?.last_name
                                                        }
                                                    </div>

                                                    <div className="text-xs text-muted-foreground">
                                                        {
                                                            installment
                                                                .customer
                                                                ?.phone
                                                        }
                                                    </div>

                                                </td>
                                            </Link>
                                            {/* Item */}

                                            <td className="whitespace-nowrap px-6 py-4">

                                                <div className="font-medium">
                                                    {installment.item_reference ||
                                                        '—'}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    #
                                                    {
                                                        installment.id
                                                    }
                                                </div>

                                            </td>

                                            {/* Price */}

                                            <td className="whitespace-nowrap px-6 py-4">
                                                {currency.symbol} {Number(
                                                    installment.total_price ??
                                                    0,
                                                ).toLocaleString()}
                                            </td>

                                            {/* Financed */}

                                            <td className="whitespace-nowrap px-6 py-4">
                                                {currency.symbol} {Number(
                                                    installment.financed_amount ??
                                                    0,
                                                ).toLocaleString()}
                                            </td>

                                            {/* Payable */}

                                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                {currency.symbol} {Number(
                                                    installment.total_payable ??
                                                    0,
                                                ).toLocaleString()}
                                            </td>

                                            {/* Frequency */}

                                            <td className="whitespace-nowrap px-6 py-4 capitalize">
                                                {
                                                    installment.frequency
                                                }
                                            </td>

                                            {/* Status */}

                                            <td className="whitespace-nowrap px-6 py-4">

                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${statusClasses(
                                                        installment.status,
                                                    )}`}
                                                >
                                                    {installment.status.replace(
                                                        /_/g,
                                                        ' ',
                                                    )}
                                                </span>

                                            </td>

                                            {/* Start */}

                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                {installment.start_date ??
                                                    '—'}
                                            </td>

                                            {/* Action */}

                                            <td className="px-6 py-4 text-right">
                                                <Link href={show({ id: installment.id })}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-2 cursor-pointer"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </Button>
                                                </Link>

                                            </td>

                                        </tr>

                                    ),
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={9}
                                        className="px-6 py-12 text-center"
                                    >
                                        <p className="text-sm text-muted-foreground">
                                            No installment
                                            plans found.
                                        </p>
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* ===================================================== */}
                {/* Pagination */}
                {/* ===================================================== */}

                <div className="flex flex-col gap-4 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-muted-foreground">

                        Showing{' '}

                        <span className="font-medium text-foreground">
                            {installments.from ??
                                0}
                        </span>

                        {' '}to{' '}

                        <span className="font-medium text-foreground">
                            {installments.to ??
                                0}
                        </span>

                        {' '}of{' '}

                        <span className="font-medium text-foreground">
                            {installments.total}
                        </span>

                    </p>

                    <div className="flex gap-1">

                        {installments.links.map(
                            (link: any, index: any) => (

                                <Button
                                    key={index}
                                    variant={
                                        link.active
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => {

                                        if (!link.url) {
                                            return;
                                        }

                                        router.get(
                                            link.url,
                                            {},
                                            {
                                                preserveState:
                                                    true,
                                                preserveScroll:
                                                    true,
                                            },
                                        );

                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            link.label,
                                    }}
                                />

                            ),
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
};

export default InstallmentTable;