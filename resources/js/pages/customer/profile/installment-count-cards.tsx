import { Customer } from '@/types/data'
import React from 'react'

const InstallmentCountsCard = ({ customer }: { customer: Customer }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
            {[
                {
                    label: 'Pending',
                    count: customer.installment_counts?.pending ?? 0,
                    bg: 'bg-amber-500/10 border-amber-500/20',
                    text: 'text-amber-600 dark:text-amber-400',
                    value: 'text-amber-700 dark:text-amber-300'
                },
                {
                    label: 'Active',
                    count: customer.installment_counts?.active ?? 0,
                    bg: 'bg-emerald-500/10 border-emerald-500/20',
                    text: 'text-emerald-600 dark:text-emerald-400',
                    value: 'text-emerald-700 dark:text-emerald-300'
                },
                {
                    label: 'Completed',
                    count: customer.installment_counts?.completed ?? 0,
                    bg: 'bg-blue-500/10 border-blue-500/20',
                    text: 'text-blue-600 dark:text-blue-400',
                    value: 'text-blue-700 dark:text-blue-300'
                },
                {
                    label: 'Rejected',
                    count: customer.installment_counts?.rejected ?? 0,
                    bg: 'bg-rose-500/10 border-rose-500/20',
                    text: 'text-rose-600 dark:text-rose-400',
                    value: 'text-rose-700 dark:text-rose-300'
                },
                {
                    label: 'Cancelled',
                    count: customer.installment_counts?.cancelled ?? 0,
                    bg: 'bg-orange-500/10 border-orange-500/20',
                    text: 'text-orange-600 dark:text-orange-400',
                    value: 'text-orange-700 dark:text-orange-300'
                },
                {
                    label: 'Total',
                    count: customer.installment_counts?.total ?? 0,
                    bg: 'bg-purple-500/10 border-purple-500/20',
                    text: 'text-purple-600 dark:text-purple-400',
                    value: 'text-purple-700 dark:text-purple-300'
                },
            ].map((stat, idx) => (
                <div key={idx} className={`${stat.bg} border rounded-xl p-3 text-center shadow-xs`}>
                    <span className={`block text-xs font-semibold ${stat.text}`}>{stat.label}</span>
                    <span className={`text-xl font-extrabold ${stat.value}`}>{stat.count}</span>
                </div>
            ))}
        </div>
    )
}

export default InstallmentCountsCard