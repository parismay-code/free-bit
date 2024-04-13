<?php

namespace App\Helpers\Contracts;

interface StorageHelpersContract
{
    static function uploadFile(mixed $file, string $filenameId, string $path): array;

    static function removeFile(string $path, string $filename): bool;
}
