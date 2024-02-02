<?php

namespace App\Http\Filters;

use App\Enums\OrderStatuses;

class OrdersFilter extends QueryFilter
{
    private array $finishedStatuses = [
        OrderStatuses::FINISHED,
        OrderStatuses::DECLINED,
    ];

    private array $closedStatuses = [
        OrderStatuses::CLOSED_BY_ADMINISTRATION,
        OrderStatuses::CLOSED_BY_CLIENT,
        OrderStatuses::CLOSED_BY_ORGANIZATION,
    ];

    public function status(string $status): void
    {
        switch ($status) {
            case 'finished':
                $this->builder->whereIn('status', $this->finishedStatuses);
                break;
            case 'closed':
                $this->builder->whereIn('status', $this->closedStatuses);
                break;
            default:
                $this->builder->whereNotIn('status', array_merge($this->finishedStatuses, $this->closedStatuses));
                break;
        }
    }
}
