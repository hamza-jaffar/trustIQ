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
    province: string;
    country: string;
    occupation: string;
    monthly_income: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    email_confirm_at: string | null;
    phone_confirm_at: string | null;
    created_at: string;
    updated_at: string;
}

export type Guarantor = {
    customer_id: string
    full_name: string
    cnic: string
    phone: string
    address: string
    relationship: string
    monthly_income: string
}