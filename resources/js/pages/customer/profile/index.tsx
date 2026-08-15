import React, { useEffect, useRef, useState } from 'react'
import { ShieldCheck, ShieldAlert, ShieldQuestion, User, Phone, MapPin, Briefcase, PenBoxIcon, Mail, Calendar, Check, Currency } from 'lucide-react'
import { Customer } from '@/types/data';
import { Form } from '@inertiajs/react';
import { update } from '@/routes/customers';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import ColorfulRow from './colorful-row';


const CustomerProfile = ({ customer }: { customer: Customer }) => {
    // Colorful Badge configuration matching Laravel verification status
    const statusMap = {
        verified: {
            bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
            label: "Verified",
            icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />
        },
        pending: {
            bg: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
            label: "Pending Verification",
            icon: <ShieldQuestion className="h-4 w-4 text-amber-500" />
        },
        rejected: {
            bg: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
            label: "Rejected",
            icon: <ShieldAlert className="h-4 w-4 text-rose-500" />
        },
    };

    const status = statusMap[customer.verification_status];

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 p-4 bg-zinc-50/50 dark:bg-zinc-950 rounded-2xl">

            {/* Header Identity Card with Modern Gradient Background */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-8 rounded-2xl shadow-xl text-white">
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                {customer.first_name} {customer.last_name}
                            </h1>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/20 border border-white/30 text-white shadow-sm`}>
                                {status.icon}
                                <span>{status.label}</span>
                            </div>
                        </div>
                        <p className="text-indigo-100 font-medium tracking-wide">National ID (CNIC): <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">{customer.cnic}</span></p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                {/* Left Column: Personal and Financial Profile (60%) */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-100/50 dark:border-indigo-950/40 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-indigo-100/30">
                            <User className="h-5 w-5 text-indigo-500" />
                            <h2 className="font-bold text-lg text-indigo-950 dark:text-indigo-300">Personal & Financial Profile</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorfulRow customerId={customer.id} title="Date of Birth" data={customer.dob} icon={Calendar} accentClass="bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40" />
                            <ColorfulRow customerId={customer.id} title="Gender" data={customer.gender.toUpperCase()} icon={User} accentClass="bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40" />
                            <ColorfulRow customerId={customer.id} title="Occupation" editable name="occupation" data={customer.occupation} icon={Briefcase} accentClass="bg-purple-50 text-purple-500 dark:bg-purple-950/40" />
                            <ColorfulRow customerId={customer.id} title="Monthly Income" editable name='monthly_income' data={customer.monthly_income} icon={Currency} accentClass="bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact Details and Address Info (40%) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Communications Box */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/5 to-rose-500/5 border border-pink-100/50 dark:border-pink-950/40 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-pink-100/30">
                            <Phone className="h-5 w-5 text-pink-500" />
                            <h2 className="font-bold text-lg text-pink-950 dark:text-pink-300">Contact Details</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorfulRow customerId={customer.id} title="Email" editable name='email' data={customer.email} icon={Mail} accentClass="bg-pink-50 text-pink-500 dark:bg-pink-950/40" />
                            <ColorfulRow customerId={customer.id} title="Phone Number" editable name='phone' data={customer.phone} icon={Phone} accentClass="bg-pink-50 text-pink-500 dark:bg-pink-950/40" />

                            {/* Verification Indicators using explicit contextual colors */}
                            <ColorfulRow
                                customerId={customer.id}
                                title="Email Status"
                                data={customer.email_confirm_at ? "✓ Confirmed" : "⚠️ Unverified"}
                                accentClass={customer.email_confirm_at ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40" : "bg-amber-50 text-amber-600"}
                            />
                            <ColorfulRow
                                customerId={customer.id}
                                title="Phone Status"
                                data={customer.phone_confirm_at ? "✓ Confirmed" : "⚠️ Unverified"}
                                accentClass={customer.phone_confirm_at ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40" : "bg-amber-50 text-amber-600"}
                            />
                        </div>
                    </div>

                    {/* Geography Address Box */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-100/50 dark:border-cyan-950/40 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-cyan-100/30">
                            <MapPin className="h-5 w-5 text-cyan-500" />
                            <h2 className="font-bold text-lg text-cyan-950 dark:text-cyan-300">Address Information</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorfulRow customerId={customer.id} title="Street Address" editable name='address' data={customer.address} icon={MapPin} accentClass="bg-cyan-50 text-cyan-500 dark:bg-cyan-950/40" />
                            <ColorfulRow customerId={customer.id} title="City" editable data={customer.city} name='city' icon={MapPin} accentClass="bg-blue-50 text-blue-500 dark:bg-blue-950/40" />
                            <ColorfulRow customerId={customer.id} title="Province" editable data={customer.province} name='province' icon={MapPin} accentClass="bg-blue-50 text-blue-500 dark:bg-blue-950/40" />
                            <ColorfulRow customerId={customer.id} title="Country" data={customer.country} name='country' icon={MapPin} accentClass="bg-blue-50 text-blue-500 dark:bg-blue-950/40" />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default CustomerProfile;
