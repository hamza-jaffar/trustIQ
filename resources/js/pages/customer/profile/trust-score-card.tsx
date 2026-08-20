import { TrustScore } from '@/types/data';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Star,
    TrendingUp,
    Trophy,
} from 'lucide-react';

// ─── Colour config per rating ───────────────────────────────────────────────

const RATING_CONFIG = {
    Excellent: {
        gradient: 'from-emerald-500/10 to-teal-500/10',
        border: 'border-emerald-100/50 dark:border-emerald-950/40',
        heading: 'text-emerald-950 dark:text-emerald-300',
        scoreBg: 'bg-emerald-500/10',
        scoreText: 'text-emerald-600 dark:text-emerald-400',
        badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
        bar: 'bg-emerald-500',
        icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
    },
    Good: {
        gradient: 'from-blue-500/10 to-indigo-500/10',
        border: 'border-blue-100/50 dark:border-blue-950/40',
        heading: 'text-blue-950 dark:text-blue-300',
        scoreBg: 'bg-blue-500/10',
        scoreText: 'text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400',
        bar: 'bg-blue-500',
        icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    },
    Fair: {
        gradient: 'from-amber-500/10 to-yellow-500/10',
        border: 'border-amber-100/50 dark:border-amber-950/40',
        heading: 'text-amber-950 dark:text-amber-300',
        scoreBg: 'bg-amber-500/10',
        scoreText: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400',
        bar: 'bg-amber-400',
        icon: <Clock className="h-5 w-5 text-amber-500" />,
    },
    Poor: {
        gradient: 'from-rose-500/10 to-red-500/10',
        border: 'border-rose-100/50 dark:border-rose-950/40',
        heading: 'text-rose-950 dark:text-rose-300',
        scoreBg: 'bg-rose-500/10',
        scoreText: 'text-rose-600 dark:text-rose-400',
        badge: 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400',
        bar: 'bg-rose-500',
        icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
    },
    'New Customer': {
        gradient: 'from-gray-500/5 to-slate-500/5',
        border: 'border-gray-100/50 dark:border-gray-800/40',
        heading: 'text-gray-700 dark:text-gray-300',
        scoreBg: 'bg-gray-500/10',
        scoreText: 'text-gray-500 dark:text-gray-400',
        badge: 'bg-gray-500/10 border-gray-300/30 text-gray-600 dark:text-gray-400',
        bar: 'bg-gray-400',
        icon: <Star className="h-5 w-5 text-gray-400" />,
    },
} as const;

// ─── Stat row ────────────────────────────────────────────────────────────────

interface StatRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string;
}

const StatRow = ({ icon, label, value, sub }: StatRowProps) => (
    <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-background px-4 py-3 shadow-xs dark:border-zinc-800">
        <div className="flex items-center gap-3">
            <div className="shrink-0">{icon}</div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {label}
            </span>
        </div>
        <div className="text-right">
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                {value}
            </span>
            {sub && (
                <span className="ml-1 text-xs text-zinc-400 dark:text-zinc-500">
                    {sub}
                </span>
            )}
        </div>
    </div>
);

// ─── Progress bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({ value, barClass }: { value: number; barClass: string }) => (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${barClass}`}
            style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
    </div>
);

// ─── Main card ───────────────────────────────────────────────────────────────

const TrustScoreCard = ({ trustScore }: { trustScore?: TrustScore }) => {
    if (!trustScore) return null;

    const cfg = RATING_CONFIG[trustScore.rating] ?? RATING_CONFIG['New Customer'];
    const { score, rating, details } = trustScore;
    const isNewCustomer = rating === 'New Customer';

    return (
        <div
            className={`p-5 rounded-2xl bg-linear-to-br ${cfg.gradient} border ${cfg.border} space-y-4`}
        >
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100/30 dark:border-zinc-800/60">
                {cfg.icon}
                <h2 className={`font-bold text-lg ${cfg.heading}`}>Trust Score</h2>
            </div>

            {/* Score + rating */}
            <div className="flex items-center justify-between gap-4">
                <div className={`flex flex-col items-center justify-center rounded-2xl px-5 py-3 min-w-[90px] ${cfg.scoreBg}`}>
                    <span className={`text-4xl font-extrabold leading-none ${cfg.scoreText}`}>
                        {score}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        / 100
                    </span>
                </div>

                <div className="flex-1 space-y-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${cfg.badge}`}>
                        {cfg.icon}
                        {rating}
                    </span>
                    <ProgressBar value={score} barClass={cfg.bar} />
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        Based on payment history &amp; plan completion
                    </p>
                </div>
            </div>

            {/* Empty state for new customers */}
            {isNewCustomer ? (
                <div className="rounded-xl border border-gray-100/50 bg-gray-50/50 px-4 py-3 text-center dark:border-gray-800/40 dark:bg-gray-900/20">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        No installment history yet. Score will update once payments begin.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    <StatRow
                        icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        label="Payment Completion"
                        value={`${details.payment_completion ?? 0}%`}
                        sub={`${details.paid_schedules}/${details.total_schedules} schedules`}
                    />
                    <StatRow
                        icon={<Clock className="h-4 w-4 text-blue-500" />}
                        label="On-Time Rate"
                        value={`${details.on_time_payments ?? 0}%`}
                        sub={`${details.on_time_schedules} on time`}
                    />
                    <StatRow
                        icon={<AlertCircle className="h-4 w-4 text-rose-500" />}
                        label="Overdue Payments"
                        value={details.overdue_schedules}
                        sub="schedules"
                    />
                    <StatRow
                        icon={<Trophy className="h-4 w-4 text-amber-500" />}
                        label="Completed Plans"
                        value={details.completed_plans}
                        sub="plans"
                    />
                </div>
            )}
        </div>
    );
};

export default TrustScoreCard;
