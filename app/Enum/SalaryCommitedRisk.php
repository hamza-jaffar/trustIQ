<?php

namespace App\Enum;

enum SalaryCommitedRisk: string
{
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
    case CRITICAL = 'critical';

    /**
     * Determine the risk level based on the DTI percentage.
     */
    public static function fromPercentage(float $percentage): self
    {
        return match (true) {
            $percentage <= 30 => self::LOW,
            $percentage <= 50 => self::MEDIUM,
            $percentage <= 75 => self::HIGH,
            default => self::CRITICAL,
        };
    }

    /**
     * Get a human-readable label for UI rendering.
     */
    public function label(): string
    {
        return match ($this) {
            self::LOW => 'Low Risk',
            self::MEDIUM => 'Medium Risk',
            self::HIGH => 'High Risk',
            self::CRITICAL => 'Critical Risk',
        };
    }

    /**
     * Get tailwind badge colors for UI styling.
     */
    public function badgeColor(): string
    {
        return match ($this) {
            self::LOW => 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            self::MEDIUM => 'bg-amber-500/10 text-amber-600 border-amber-500/20',
            self::HIGH => 'bg-orange-500/10 text-orange-600 border-orange-500/20',
            self::CRITICAL => 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        };
    }
}