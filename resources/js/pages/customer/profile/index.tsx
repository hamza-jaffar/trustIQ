import { ShieldCheck, ShieldAlert, ShieldQuestion, User, Phone, MapPin, Briefcase, PenBoxIcon, Mail, Calendar, Check, Currency, Plus, MoveLeft, Star } from 'lucide-react'
import { Customer } from '@/types/data';
import { Form, Link, usePage } from '@inertiajs/react';
import { create, index, update } from '@/routes/customers';
import { Button } from '@/components/ui/button';
import ColorfulRow from './colorful-row';
import installments from '@/routes/installments';
import ProfileInstallment from './installments';
import ProfileBanner from './banner';
import InstallmentCountsCard from './installment-count-cards';
import TrustScoreCard from './trust-score-card';

const CustomerProfile = ({ customer }: { customer: Customer }) => {

    const { currency } = usePage().props;



    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 p-4 rounded-2xl">

            <ProfileBanner customer={customer} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-3 space-y-4">
                    <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-100/50 dark:border-indigo-950/40 ">
                        {customer.active_or_pending_installments ?
                            <div className='space-y-4'>
                                <div className="flex items-center justify-between pb-2 border-b border-indigo-100/30">
                                    <h2 className="font-bold text-lg text-indigo-950 dark:text-indigo-300">Installment Overview</h2>
                                    <Link href={installments.index({ query: { search: customer.cnic } })} className='hover:underline text-xs flex gap-1 items-center text-indigo-600 dark:text-indigo-400'>
                                        <MoveLeft size={14} /> View All
                                    </Link>
                                </div>
                                {/* Quick Count Summary Metrics Bar */}
                                <InstallmentCountsCard customer={customer} />

                                {customer.active_or_pending_installments?.map((installment) => (
                                    <div key={installment.id}>
                                        <ProfileInstallment installment={installment} />
                                    </div>
                                ))}
                                <Link href={installments.index({
                                    query: {
                                        search: customer.cnic
                                    }
                                })} className='hover:underline text-xs flex gap-2 justify-center'> <MoveLeft size={15} /> View all installments</Link>
                            </div>
                            : <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600">
                                <span className="h-2 w-2 rounded-full bg-gray-400" />
                                No Active or Approval Pending Installment
                            </div>}
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <TrustScoreCard trustScore={customer.trust_score} />
                    <div className="p-5 rounded-2xl bg-linear-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-100/50 dark:border-cyan-950/40 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-indigo-100/30">
                            <User className="h-5 w-5 text-indigo-500" />
                            <h2 className="font-bold text-lg text-indigo-950 dark:text-indigo-300">Personal & Financial Profile</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorfulRow customerId={customer.id} title="Date of Birth" data={customer.dob} icon={Calendar} accentClass="bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40" />
                            <ColorfulRow customerId={customer.id} title="Gender" data={customer.gender.toUpperCase()} icon={User} accentClass="bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40" />
                            <ColorfulRow customerId={customer.id} title="Occupation" editable name="occupation" data={customer.occupation} icon={Briefcase} accentClass="bg-purple-50 text-purple-500 dark:bg-purple-950/40" />
                            <ColorfulRow customerId={customer.id} title="Monthly Income" editable name='monthly_income' data={`${currency.symbol} ${customer.monthly_income}`} icon={Currency} accentClass="bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40" />
                        </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-linear-to-br from-pink-500/5 to-rose-500/5 border border-pink-100/50 dark:border-pink-950/40 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-pink-100/30">
                            <Phone className="h-5 w-5 text-pink-500" />
                            <h2 className="font-bold text-lg text-pink-950 dark:text-pink-300">Contact Details</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorfulRow customerId={customer.id} title="Email" editable name='email' data={customer.email} icon={Mail} accentClass="bg-pink-50 text-pink-500 dark:bg-pink-950/40" />
                            <ColorfulRow customerId={customer.id} title="Phone Number" editable name='phone' data={customer.phone} icon={Phone} accentClass="bg-pink-50 text-pink-500 dark:bg-pink-950/40" />
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
                    <div className="p-5 rounded-2xl bg-linear-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-100/50 dark:border-cyan-950/40 space-y-4">
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


CustomerProfile.layout = {
    breadcrumbs: [
        {
            title: 'Customers',
            href: index(),
        },
        {
            title: 'Search Customer',
            href: create(),
        },
        {
            title: 'Profile'
        }
    ],
}
