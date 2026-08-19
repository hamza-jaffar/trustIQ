import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { profile } from '@/routes/customers';
import { Customer } from '@/types/data';
import { PaginatedCustomers } from '@/types/pagination';
import { Link, router, usePage } from '@inertiajs/react';
import { Eye, RotateCcw, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CustomerFilters {
    search: string;
    verification_status: string;
    gender: string;
    city: string;
    province: string;
    min_income: string | number | null;
    max_income: string | number | null;
    email_verified: string;
    phone_verified: string;
    sort: string;
    direction: string;
    per_page: number;
}

interface CustomerFilterOptions {
    cities: string[];
    provinces: string[];
}

interface CustomerTableProps {
    customers: PaginatedCustomers;
    filters: CustomerFilters;
    filterOptions: CustomerFilterOptions;
}

const CustomerTable = ({
    customers,
    filters,
    filterOptions,
}: CustomerTableProps) => {
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search === filters.search) {
                return;
            }

            router.get(
                window.location.pathname,
                {
                    ...filters,
                    search,
                    page: 1,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const updateFilter = (key: string, value: string) => {
        router.get(
            window.location.pathname,
            {
                ...filters,
                [key]: value,
                page: 1,
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
            window.location.pathname,
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
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        updateFilter('sort', column);

        router.get(
            window.location.pathname,
            {
                ...filters,
                sort: column,
                direction,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'verified':
                return 'bg-green-50 text-green-700 ring-green-600/20';

            case 'pending':
                return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';

            case 'rejected':
                return 'bg-red-50 text-red-700 ring-red-600/20';

            default:
                return 'bg-gray-50 text-gray-700 ring-gray-600/20';
        }
    };

    return (
        <div className="space-y-4">
            {/* Search & Filters */}
            <div className="rounded-xl border divide-border bg-background p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Search
                        </label>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name, CNIC, phone, email..."
                                className="h-10 pl-9"
                            />
                        </div>
                    </div>

                    {/* Verification */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Verification
                        </label>

                        <Select
                            value={filters.verification_status || 'all'}
                            onValueChange={(value) =>
                                updateFilter(
                                    'verification_status',
                                    value === 'all' ? '' : value,
                                )
                            }
                        >
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Gender
                        </label>

                        <Select
                            value={filters.gender || 'all'}
                            onValueChange={(value) =>
                                updateFilter(
                                    'gender',
                                    value === 'all' ? '' : value,
                                )
                            }
                        >
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All genders" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Genders</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            City
                        </label>

                        <Select
                            value={filters.city || 'all'}
                            onValueChange={(value) =>
                                updateFilter(
                                    'city',
                                    value === 'all' ? '' : value,
                                )
                            }
                        >
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All cities" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Cities</SelectItem>

                                {filterOptions.cities.map((city) => (
                                    <SelectItem key={city} value={city}>
                                        {city}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Province */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Province
                        </label>

                        <Select
                            value={filters.province || 'all'}
                            onValueChange={(value) =>
                                updateFilter(
                                    'province',
                                    value === 'all' ? '' : value,
                                )
                            }
                        >
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All provinces" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Provinces</SelectItem>

                                {filterOptions.provinces.map((province) => (
                                    <SelectItem key={province} value={province}>
                                        {province}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Email Verification
                        </label>

                        <Select
                            value={filters.email_verified || 'all'}
                            onValueChange={(value) =>
                                updateFilter(
                                    'email_verified',
                                    value === 'all' ? '' : value,
                                )
                            }
                        >
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="verified">
                                    Verified
                                </SelectItem>
                                <SelectItem value="unverified">
                                    Unverified
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Phone Verification
                        </label>

                        <Select
                            value={filters.phone_verified || 'all'}
                            onValueChange={(value) =>
                                updateFilter(
                                    'phone_verified',
                                    value === 'all' ? '' : value,
                                )
                            }
                        >
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="verified">
                                    Verified
                                </SelectItem>
                                <SelectItem value="unverified">
                                    Unverified
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Minimum Income */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Minimum Income
                        </label>

                        <Input
                            type="number"
                            value={filters.min_income ?? ''}
                            onChange={(e) =>
                                updateFilter('min_income', e.target.value)
                            }
                            placeholder="e.g. 50,000"
                            className="h-10"
                        />
                    </div>

                    {/* Maximum Income */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Maximum Income
                        </label>

                        <Input
                            type="number"
                            value={filters.max_income ?? ''}
                            onChange={(e) =>
                                updateFilter('max_income', e.target.value)
                            }
                            placeholder="e.g. 200,000"
                            className="h-10"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t divide-border pt-4">
                    <p className="text-xs text-muted-foreground">
                        Search and filters are applied automatically.
                    </p>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="gap-2"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset Filters
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border divide-border bg-background shadow-sm">
                <div className="border-b divide-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Customers
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Customers associated with your installment
                                plans.
                            </p>
                        </div>

                        <div className="text-sm text-gray-500">
                            {customers.total} customers
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
                            <tr>
                                <th
                                    onClick={() => sortBy('first_name')}
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                >
                                    Customer
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    CNIC
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Phone
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Email
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    City
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Occupation
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Verification
                                </th>

                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border bg-background">
                            {customers.data.length > 0 ? (
                                customers.data.map((customer: Customer) => (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-background/10"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                                                    {customer.first_name.charAt(
                                                        0,
                                                    )}
                                                    {customer.last_name.charAt(
                                                        0,
                                                    )}
                                                </div>

                                                <div className="ml-3">
                                                    <div className="font-medium text-gray-900">
                                                        {customer.first_name}{' '}
                                                        {customer.last_name}
                                                    </div>

                                                    <div className="text-sm capitalize text-gray-500">
                                                        {customer.gender}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {customer.cnic}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {customer.phone}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {customer.email}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {customer.city}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {customer.occupation}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusClasses(
                                                    customer.verification_status,
                                                )}`}
                                            >
                                                {
                                                    customer.verification_status
                                                }
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <Link href={profile({ cnic: customer.cnic })}>
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
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center"
                                    >
                                        <p className="text-sm text-gray-500">
                                            No customers found.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t divide-border px-6 py-4">
                    <div className="text-sm text-gray-500">
                        Showing{' '}
                        <span className="font-medium">
                            {customers.from ?? 0}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                            {customers.to ?? 0}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">
                            {customers.total}
                        </span>
                    </div>

                    <div className="flex gap-1">
                        {customers.links.map((link: any, index: any) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => {
                                    if (!link.url) return;

                                    router.get(
                                        link.url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    );
                                }}
                                className={`rounded-lg px-3 py-2 text-sm ${link.active
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerTable;