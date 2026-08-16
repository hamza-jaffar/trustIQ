<?php

namespace App\Enum;

enum InstallmentSchedulesStatus: string
{
    case PENDING = "pending";
    case PAID = "paid";
    case PARTIAL = "partial";
    case OVERDUE = "overdue";

}
