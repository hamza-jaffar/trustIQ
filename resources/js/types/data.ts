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