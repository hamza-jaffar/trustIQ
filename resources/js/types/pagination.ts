import { Customer, Installment } from "./data";

export interface PaginatedCustomers {
    data: Customer[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface PaginatedInstallments {
    data: Installment[];

    current_page: number;

    first_page_url: string;

    from: number | null;

    last_page: number;

    last_page_url: string;

    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];

    next_page_url: string | null;

    path: string;

    per_page: number;

    prev_page_url: string | null;

    to: number | null;

    total: number;
}