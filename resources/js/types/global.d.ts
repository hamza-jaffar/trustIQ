import type { Auth } from '@/types/auth';
import { Organization } from './data';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

interface CurrencyConfiguration {
    code: string;
    name: string;
    symbol: string;
    position: 'before' | 'after';
    decimalPlaces: number;
    decimalSeparator: string;
    thousandSeparator: string;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            currency: CurrencyConfiguration,
            sidebarOpen: boolean;
            permissions: string[];
            organization?: Organization;
            [key: string]: unknown;
        };
    }
}
