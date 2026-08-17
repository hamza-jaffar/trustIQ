import { Installment } from '@/types/data'
import React from 'react'

const ProfileInstallment = ({ installment }: { installment: Installment }) => {
    return (
        <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Installment
                    </p>

                    <h3 className="mt-1 truncate font-semibold text-gray-900 dark:text-gray-200">
                        {installment.item_reference}
                    </h3>
                </div>

                <span className="shrink-0 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium capitalize text-yellow-700">
                    {installment.status.replace('_', ' ')}
                </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                        Total Payable
                    </p>

                    <p className="text-xl font-bold text-gray-900 dark:text-gray-200">
                        Rs. {Number(installment.total_payable).toLocaleString()}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                        {installment.frequency}
                    </p>

                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Starts {installment.start_date}
                    </p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x rounded-lg border bg-background py-3">
                <div className="px-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-200">Price</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-200">
                        Rs. {Number(installment.total_price).toLocaleString()}
                    </p>
                </div>

                <div className="px-3 text-center">
                    <p className="text-xs text-gray-500  dark:text-gray-200">Down</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-200">
                        Rs. {Number(installment.down_payment).toLocaleString()}
                    </p>
                </div>

                <div className="px-3 text-center">
                    <p className="text-xs text-gray-500  dark:text-gray-200">Markup</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-200">
                        Rs. {Number(installment.flat_markup).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProfileInstallment