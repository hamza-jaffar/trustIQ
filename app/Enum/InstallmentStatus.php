<?php

namespace App\Enum;

enum InstallmentStatus: string
{
    case PENDING_APPROVAL = 'pending_approval';
    case ACTIVE = 'active';
    case COMPLETED = 'completed';
    case DEFAULTED = 'defaulted';
    case CANCELLED = 'cancelled';
}
