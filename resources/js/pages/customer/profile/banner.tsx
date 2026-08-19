import { Button } from '@/components/ui/button';
import installments from '@/routes/installments';
import { Customer } from '@/types/data'
import { Link } from '@inertiajs/react';
import { Plus, ShieldAlert, ShieldCheck, ShieldQuestion, Star } from 'lucide-react';

const ProfileBanner = ({ customer }: { customer: Customer }) => {
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
        <div className="relative overflow-hidden bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-8 rounded-2xl shadow-xl text-white">
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
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-amber-400/20 border border-amber-300/40 text-amber-200 shadow-sm">
                            <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                            <span>Trust Score: {4.8}/5</span>
                        </div>
                    </div>
                    <p className="text-indigo-100 font-medium tracking-wide">National ID (CNIC): <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">{customer.cnic}</span></p>
                </div>
                <div>
                    <Link href={installments.create({
                        query: {
                            customer_id: customer.id,
                        },
                    })}>
                        <Button variant="link" className='text-white'>
                            <Plus /> Create Installment
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProfileBanner