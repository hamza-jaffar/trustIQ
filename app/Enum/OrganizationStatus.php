<?php

namespace App\Enum;

enum OrganizationStatus: string
{
    case ACTIVE = 'active';
    case SUSPENDED = 'suspended';
    case PENDING = 'pending';
    case DELETED = 'deleted';
}
