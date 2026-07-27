<?php

namespace App\Helpers;


class FileHelper {

    public static function store(string $directory, $file): string
    {
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();

        $path = $file->storeAs($directory, $filename, 'public');

        return $path;
    }
}