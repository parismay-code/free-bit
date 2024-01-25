<?php

namespace App\Enums;

enum OrderStatuses: string
{
    case CREATED = 'created';
    case ACCEPTED = 'accepted';
    case DECLINED = 'declined';
    case COOKING = 'cooking';
    case DELIVERING = 'delivering';
    case FINISHED = 'finished';
    case CLOSED_BY_CLIENT = 'cbc';
    case CLOSED_BY_ORGANIZATION = 'cbo';
    case CLOSED_BY_ADMINISTRATION = 'cba';
}
