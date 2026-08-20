export interface OrganizationUser {
    id: string;
    user_id: string;
    is_owner: boolean;
    role_id: string;
    organization_id: string;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo: string;
    email: string;
    phone: string;
    website: string;
    business_type: string;
    registration_number: string;
    tax_number: string;
    trust_score: string;
    status: string;
}

export interface Permission {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface TrustScore {
    score: number;
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'New Customer';
    color: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
    details: {
        total_schedules: number;
        paid_schedules: number;
        on_time_schedules: number;
        overdue_schedules: number;
        completed_plans: number;
        payment_completion: number;
        on_time_payments: number;
        scores?: {
            completion: number;
            on_time: number;
            overdue: number;
            history: number;
        };
    };
}

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    cnic: string;
    phone: string;
    email: string;
    dob: string | null;
    gender: 'male' | 'female' | 'other';
    address: string;
    city: string;
    active_or_pending_installments?: Installment[];
    province: string;
    country: string;
    occupation: string;
    monthly_income: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    email_confirm_at: string | null;
    phone_confirm_at: string | null;
    installment_counts: {
        pending: number;
        active: number;
        completed: number;
        rejected: number;
        cancelled: number;
        total: number;
    }
    dti_percentage: string;
    risk: {
        value: string;
        label: string;
        badge_color: string;
    }
    trust_score?: TrustScore;
    created_at: string;
    updated_at: string;
}

export type Guarantor = {
    id: number | string;
    customer_id: string
    full_name: string
    cnic: string
    phone: string
    address: string
    relationship: string
    monthly_income: string
}

export interface Installment {
    id: number | string;
    organization_id: number | null;
    customer_id: number | null;
    created_by_user_id: number | null;
    item_reference: string | null;
    total_price: string | null;
    down_payment: string | null;
    financed_amount: string | null;
    flat_markup: string | null;
    total_payable: string | null;
    frequency: string;
    status: string;
    start_date: string | null;
    created_at: string;
    updated_at: string;
    customer?: {
        id: number;
        first_name: string;
        last_name: string;
        cnic: string;
        phone: string;
        email: string;
    };
    guarantors: Guarantor[];
    created_by?: {
        id: number;
        name: string;
        email: string;
    };
    installment_schedules?: InstallmentSchedule[];
}

export interface InstallmentPayment {
    id: number;
    installment_schedule_id: number;
    amount_paid: string;
    payment_date: string;
    payment_method: string | null;
    transaction_reference: string | null;
    notes: string | null;
    created_at: string;
}

export interface InstallmentSchedule {
    id: number;
    installment_plan_id: number;
    installment_number: number;
    due_date: string;
    amount_due: string;
    amount_paid: string;
    status: string;
    paid_at: string | null;
    installment_payments?: InstallmentPayment[];
}