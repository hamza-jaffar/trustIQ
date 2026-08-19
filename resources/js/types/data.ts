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
}