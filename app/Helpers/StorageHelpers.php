<?php

namespace App\Helpers;

use App\Helpers\Contracts\StorageHelpersContract;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Storage;

class StorageHelpers implements StorageHelpersContract
{
    /**
     * @param UploadedFile | UploadedFile[] | array | null $file
     * @param string $filenameId
     * @param string $path
     * @return array
     */
    static function uploadFile(mixed $file, string $filenameId, string $path): array
    {
        if (empty($file) || !$file->isValid()) {
            return [null, false];
        }

        $extension = $file->getClientOriginalExtension();

        $now = (new Carbon())->format('Ymd_his');

        $filename = "$now-$filenameId.$extension";

        if (!$file->storeAs($path, $filename)) {
            return [null, false];
        }

        return [$path . $filename, true];
    }

    static function removeFile(string $path, string $filename): bool
    {
        return Storage::delete($path . $filename);
    }
}
