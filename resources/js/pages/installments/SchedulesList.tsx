import React, { useState } from 'react';
import { InstallmentSchedule } from '@/types/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePage, useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface Props {
    schedules: InstallmentSchedule[];
}

export default function SchedulesList({ schedules }: Props) {
    const { currency } = usePage().props as any;
    const [selectedSchedule, setSelectedSchedule] = useState<InstallmentSchedule | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        amount_paid: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        transaction_reference: '',
        notes: '',
    });

    const openPaymentModal = (schedule: InstallmentSchedule) => {
        setSelectedSchedule(schedule);
        const remaining = parseFloat(schedule.amount_due) - parseFloat(schedule.amount_paid);
        setData('amount_paid', remaining.toFixed(2));
        setIsModalOpen(true);
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSchedule) return;

        post(`/installments/schedules/${selectedSchedule.id}/payments`, {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid': return <Badge className="bg-green-500">Paid</Badge>;
            case 'partial': return <Badge className="bg-yellow-500">Partial</Badge>;
            case 'overdue': return <Badge variant="destructive">Overdue</Badge>;
            default: return <Badge variant="outline">Pending</Badge>;
        }
    };

    if (!schedules || schedules.length === 0) {
        return (
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Installment Schedules</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">No schedules generated yet. Activate the plan to generate schedules.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Installment Schedules</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Due Date</th>
                                <th className="p-3">Amount Due</th>
                                <th className="p-3">Amount Paid</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule) => (
                                <React.Fragment key={schedule.id}>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">{schedule.installment_number}</td>
                                        <td className="p-3">{new Date(schedule.due_date).toLocaleDateString()}</td>
                                        <td className="p-3">{currency?.symbol} {schedule.amount_due}</td>
                                        <td className="p-3">{currency?.symbol} {schedule.amount_paid}</td>
                                        <td className="p-3">{getStatusBadge(schedule.status)}</td>
                                        <td className="p-3 text-right">
                                            {schedule.status !== 'paid' && (
                                                <Button size="sm" variant="outline" onClick={() => openPaymentModal(schedule)}>
                                                    Record Payment
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                    {schedule.installment_payments && schedule.installment_payments.length > 0 && (
                                        <tr className="bg-muted/30">
                                            <td colSpan={6} className="p-3">
                                                <div className="text-xs pl-8">
                                                    <span className="font-medium">Payment History:</span>
                                                    <ul className="list-disc mt-1 ml-4 text-muted-foreground">
                                                        {schedule.installment_payments.map((payment: any) => (
                                                            <li key={payment.id}>
                                                                {currency?.symbol} {payment.amount_paid} on {new Date(payment.payment_date).toLocaleDateString()} via {payment.payment_method} 
                                                                {payment.transaction_reference && ` (Ref: ${payment.transaction_reference})`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Payment</DialogTitle>
                            <DialogDescription>
                                Recording payment for Installment #{selectedSchedule?.installment_number}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitPayment} className="flex flex-col gap-4 mt-4">
                            <div>
                                <Label htmlFor="amount">Amount Paid</Label>
                                <Input 
                                    id="amount" 
                                    type="number" 
                                    step="0.01" 
                                    value={data.amount_paid} 
                                    onChange={e => setData('amount_paid', e.target.value)} 
                                />
                                {errors.amount_paid && <p className="text-sm text-red-500 mt-1">{errors.amount_paid}</p>}
                            </div>
                            <div>
                                <Label htmlFor="date">Payment Date</Label>
                                <Input 
                                    id="date" 
                                    type="date" 
                                    value={data.payment_date} 
                                    onChange={e => setData('payment_date', e.target.value)} 
                                />
                                {errors.payment_date && <p className="text-sm text-red-500 mt-1">{errors.payment_date}</p>}
                            </div>
                            <div>
                                <Label htmlFor="method">Payment Method</Label>
                                <Input 
                                    id="method" 
                                    value={data.payment_method} 
                                    onChange={e => setData('payment_method', e.target.value)} 
                                    placeholder="e.g. Cash, Bank Transfer, Stripe"
                                />
                                {errors.payment_method && <p className="text-sm text-red-500 mt-1">{errors.payment_method}</p>}
                            </div>
                            <div>
                                <Label htmlFor="reference">Transaction Reference</Label>
                                <Input 
                                    id="reference" 
                                    value={data.transaction_reference} 
                                    onChange={e => setData('transaction_reference', e.target.value)} 
                                    placeholder="Optional"
                                />
                                {errors.transaction_reference && <p className="text-sm text-red-500 mt-1">{errors.transaction_reference}</p>}
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Payment
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
