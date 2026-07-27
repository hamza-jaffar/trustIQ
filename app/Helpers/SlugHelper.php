<?php

namespace App\Helpers;

use Str;

class SlugHelper
{
    public static function create(
        string $model,
        string $value,
        string $column = 'slug'
    ): string {
        $slug = Str::slug($value);
        $originalSlug = $slug;
        $counter = 1;

        while ($model::where($column, $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
