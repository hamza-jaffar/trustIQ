import Heading from '@/components/heading';
import { index } from '@/routes/installments';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Installment } from '@/types/data';
import SchedulesList from './SchedulesList';
interface Props {
    installment: Installment;
    statuses: string[];
}

const ShowInstallment = ({ installment, statuses }: Props) => {
    const { currency } = usePage().props;
    const { data, setData, put, processing } = useForm({
        status: installment.status,
    });

    const submitStatusUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/installments/${installment.id}/status`, {
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className='flex flex-col gap-8 p-8'>
            <Heading title='Installment Detail' description='Review installment details and update status' />

            <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
                {/* Installment Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Information</CardTitle>
                        <CardDescription>Details about the installment plan</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Item Reference</Label>
                                <p className="font-medium mt-1">{installment.item_reference || 'N/A'}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
                                <div className="mt-1">
                                    <Badge variant="outline" className="capitalize">
                                        {installment.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Total Price</Label>
                                <p className="font-medium mt-1">{currency.symbol} {installment.total_price}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Down Payment</Label>
                                <p className="font-medium mt-1">{currency.symbol} {installment.down_payment}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Financed Amount</Label>
                                <p className="font-medium mt-1">{currency.symbol} {installment.financed_amount}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Flat Markup</Label>
                                <p className="font-medium mt-1">{currency.symbol} {installment.flat_markup}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Total Payable</Label>
                                <p className="font-medium text-primary mt-1">{currency.symbol} {installment.total_payable}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Frequency</Label>
                                <p className="font-medium capitalize mt-1">{installment.frequency.replace('_', ' ')}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Start Date</Label>
                                <p className="font-medium mt-1">{installment.start_date ? formatDate(installment.start_date) : 'N/A'}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Created At</Label>
                                <p className="font-medium mt-1">{formatDate(installment.created_at)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                    {statuses.includes(installment.status) ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Status</CardTitle>
                                <CardDescription>
                                    Change the current status of this installment plan
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form
                                    onSubmit={submitStatusUpdate}
                                    className="flex flex-col gap-4"
                                >
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="status">Status</Label>

                                        <Select
                                            value={data.status}
                                            onValueChange={(val) => setData("status", val)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {statuses.map((status) => (
                                                    <SelectItem
                                                        key={status}
                                                        value={status}
                                                        className="capitalize"
                                                    >
                                                        {status.replace(/_/g, " ")}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex justify-end mt-2">
                                        <Button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                data.status === installment.status
                                            }
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                "Update Status"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                                <CardDescription>
                                    Current status of this installment plan
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center">
                                    <span className="capitalize">
                                        {installment.status.replace(/_/g, " ")}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )}


                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                            <CardDescription>Details about the primary customer</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Name</Label>
                                    <p className="font-medium mt-1">{installment.customer?.first_name} {installment.customer?.last_name}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">CNIC</Label>
                                    <p className="font-medium mt-1">{installment.customer?.cnic || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
                                    <p className="font-medium mt-1">{installment.customer?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</Label>
                                    <p className="font-medium mt-1">{installment.customer?.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Guarantors */}
            {installment.guarantors && installment.guarantors.length > 0 && (
                <div className="flex flex-col gap-4 mt-4">
                    <h3 className="text-xl font-semibold tracking-tight">Guarantors</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {installment.guarantors.map((guarantor, i) => (
                            <Card key={guarantor.id}>
                                <CardHeader className="pb-3 border-b">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        Guarantor {i + 1}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Name</span>
                                        <span className="text-sm font-medium">{guarantor.full_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">CNIC</span>
                                        <span className="text-sm font-medium">{guarantor.cnic || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Phone</span>
                                        <span className="text-sm font-medium">{guarantor.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Relationship</span>
                                        <span className="text-sm font-medium">{guarantor.relationship || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Income</span>
                                        <span className="text-sm font-medium">{guarantor.monthly_income ? currency.symbol + ' ' + guarantor.monthly_income : 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col mt-1 pt-3 border-t">
                                        <span className="text-sm text-muted-foreground mb-1">Address</span>
                                        <span className="text-sm">{guarantor.address || 'N/A'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Installment Schedules List */}
            <SchedulesList schedules={installment.installment_schedules || []} />
        </div>
    );
};

export default ShowInstallment;

ShowInstallment.layout = {
    breadcrumbs: [
        {
            title: 'Installment',
            href: index(),
        },
        {
            title: 'Details',
        },
    ],
};