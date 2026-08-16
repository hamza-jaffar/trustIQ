<?php

namespace App\Enum;

enum InstallmentFrequency: string
{
    case WEEKLY = 'weekly';
    case BI_WEEKLY = 'bi_weekly';
    case MONTHLY = 'monthly';
}
