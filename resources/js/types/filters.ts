export interface InstallmentFilters {
    search: string;
    status: string;
    frequency: string;
    created_by: string | number | null;
    start_date_from: string;
    start_date_to: string;
    min_price: string | number | null;
    max_price: string | number | null;
    min_financed: string | number | null;
    max_financed: string | number | null;
    min_payable: string | number | null;
    max_payable: string | number | null;
    sort: string;
    direction: string;
    per_page: number;
}

export interface CustomerFilters {
    search: string;
    verification_status: string;
    gender: string;
    city: string;
    province: string;
    min_income: string | number | null;
    max_income: string | number | null;
    email_verified: string;
    phone_verified: string;
    sort: string;
    direction: string;
    per_page: number;
}

export interface CustomerFilterOptions {
    cities: string[];
    provinces: string[];
}