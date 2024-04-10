export type Collection<T> = {
    data: Array<T>;
};

export type Paginated<T> = {
    data: Array<T>;
    links: {
        next: string | null;
        prev: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};
